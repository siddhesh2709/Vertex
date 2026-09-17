// Ported from the former Supabase edge function. Fixed sample data - not live mandi prices.
const SAMPLE_PRICES = [
    { crop: 'Rice', price: 2100, unit: 'quintal', trend: 'up', change: 5.2 },
    { crop: 'Wheat', price: 2050, unit: 'quintal', trend: 'up', change: 3.1 },
    { crop: 'Cotton', price: 5800, unit: 'quintal', trend: 'down', change: -2.3 },
    { crop: 'Tomato', price: 1200, unit: 'quintal', trend: 'up', change: 12.5 },
    { crop: 'Potato', price: 800, unit: 'quintal', trend: 'down', change: -5.8 },
    { crop: 'Sugarcane', price: 315, unit: 'quintal', trend: 'stable', change: 0.5 },
    { crop: 'Soybean', price: 4200, unit: 'quintal', trend: 'up', change: 4.7 },
    { crop: 'Maize', price: 1850, unit: 'quintal', trend: 'up', change: 2.9 }
];

const getMarketPrices = (req, res) => {
    res.json({ prices: SAMPLE_PRICES, isSampleData: true });
};

module.exports = { getMarketPrices };
