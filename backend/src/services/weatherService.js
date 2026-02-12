const axios = require('axios');
const { redisClient } = require('../config/redis');

const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

const getWeather = async (lat, lon) => {
    const cacheKey = `weather:${lat}:${lon}`;

    try {
        // Check Cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Serving weather from cache');
            return JSON.parse(cachedData);
        }

        // Fetch from API
        // Current weather
        const currentRes = await axios.get(`${OPENWEATHER_URL}/weather`, {
            params: { lat, lon, appid: API_KEY, units: 'metric' }
        });

        // 5-day forecast (OpenWeather Free Tier doesn't include One Call 3.0 easily without credit card, using 5-day/3-hour)
        const forecastRes = await axios.get(`${OPENWEATHER_URL}/forecast`, {
            params: { lat, lon, appid: API_KEY, units: 'metric' }
        });

        const weatherData = {
            current: currentRes.data,
            forecast: forecastRes.data
        };

        // Store in Redis for 1 hour
        await redisClient.set(cacheKey, JSON.stringify(weatherData), {
            EX: 3600
        });

        return weatherData;
    } catch (error) {
        console.error('Weather Service Error:', error.message);
        throw error;
    }
};

module.exports = { getWeather };
