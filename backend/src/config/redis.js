const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: false  // Don't auto-reconnect; avoids log spam when Docker is down
    }
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis connected successfully.');
    } catch (error) {
        console.error('❌ Redis connection error:', error);
    }
};

module.exports = {
    redisClient,
    connectRedis
};
