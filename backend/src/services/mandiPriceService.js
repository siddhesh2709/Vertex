const axios = require('axios');
const { redisClient } = require('../config/redis');
const PriceSnapshot = require('../models/mongo/PriceSnapshot');

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
// data.gov.in's published sample key works but is heavily rate limited.
// Set DATA_GOV_API_KEY in .env to use your own.
const SAMPLE_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const CACHE_TTL_SECONDS = 3 * 60 * 60;

// App crop name -> Agmarknet commodity name.
const COMMODITY_MAP = {
    Rice: 'Rice',
    Paddy: 'Paddy(Dhan)(Common)',
    Wheat: 'Wheat',
    Tomato: 'Tomato',
    Cotton: 'Cotton',
    Potato: 'Potato',
    Maize: 'Maize',
    Onion: 'Onion',
    Soybean: 'Soyabean'
};

const apiKey = () => process.env.DATA_GOV_API_KEY || SAMPLE_KEY;

const fetchCommodity = async (commodity, state) => {
    const params = {
        'api-key': apiKey(),
        format: 'json',
        limit: 50,
        'filters[commodity]': commodity
    };
    if (state) params['filters[state]'] = state;

    const { data } = await axios.get(BASE_URL, { params, timeout: 15000 });
    const records = data.records || [];
    if (records.length === 0) return null;

    const modal = records.map((r) => Number(r.modal_price)).filter((n) => Number.isFinite(n) && n > 0);
    if (modal.length === 0) return null;

    return {
        commodity,
        arrivalDate: records[0].arrival_date,
        avgModalPrice: Math.round(modal.reduce((a, b) => a + b, 0) / modal.length),
        minPrice: Math.min(...records.map((r) => Number(r.min_price)).filter(Number.isFinite)),
        maxPrice: Math.max(...records.map((r) => Number(r.max_price)).filter(Number.isFinite)),
        marketCount: records.length,
        totalAvailable: data.total,
        sampleMarkets: records.slice(0, 3).map((r) => ({
            market: r.market,
            district: r.district,
            state: r.state,
            modalPrice: Number(r.modal_price)
        }))
    };
};

/**
 * Compare against the most recent earlier snapshot to get a real trend.
 * Returns nulls when there is no prior day to compare against, rather than
 * inventing a number.
 */
const withTrend = async (current, state) => {
    const previous = await PriceSnapshot.findOne({
        commodity: current.commodity,
        state: state || null,
        arrivalDate: { $ne: current.arrivalDate }
    }).sort({ createdAt: -1 });

    let change = null;
    let trend = 'unknown';
    if (previous && previous.avgModalPrice > 0) {
        const pct = ((current.avgModalPrice - previous.avgModalPrice) / previous.avgModalPrice) * 100;
        change = Number(pct.toFixed(1));
        trend = Math.abs(change) < 0.5 ? 'stable' : change > 0 ? 'up' : 'down';
    }

    await PriceSnapshot.updateOne(
        { commodity: current.commodity, state: state || null, arrivalDate: current.arrivalDate },
        {
            commodity: current.commodity,
            state: state || null,
            arrivalDate: current.arrivalDate,
            avgModalPrice: current.avgModalPrice,
            minPrice: current.minPrice,
            maxPrice: current.maxPrice,
            marketCount: current.marketCount
        },
        { upsert: true }
    );

    return {
        ...current,
        change,
        trend,
        comparedWith: previous ? previous.arrivalDate : null
    };
};

const getPrices = async (crops, state = null) => {
    const cacheKey = `mandi:${state || 'all'}:${crops.join(',')}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) return { ...JSON.parse(cached), cached: true };
    } catch (err) {
        console.warn('Redis read failed for mandi prices:', err.message);
    }

    const results = await Promise.all(
        crops.map(async (crop) => {
            const commodity = COMMODITY_MAP[crop] || crop;
            try {
                const current = await fetchCommodity(commodity, state);
                if (!current) return { crop, unavailable: true };
                const withChange = await withTrend(current, state);
                return { crop, ...withChange };
            } catch (err) {
                console.warn(`Mandi fetch failed for ${crop}:`, err.message);
                return { crop, unavailable: true, error: err.message };
            }
        })
    );

    const payload = {
        prices: results,
        source: 'Agmarknet via data.gov.in',
        state,
        fetchedAt: new Date().toISOString(),
        usingSampleKey: !process.env.DATA_GOV_API_KEY
    };

    try {
        await redisClient.set(cacheKey, JSON.stringify(payload), { EX: CACHE_TTL_SECONDS });
    } catch (err) {
        console.warn('Redis write failed for mandi prices:', err.message);
    }

    return payload;
};

module.exports = { getPrices, COMMODITY_MAP };
