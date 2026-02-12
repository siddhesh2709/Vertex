const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// PostgreSQL Connection (Sequelize)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL:', error);
    }
};

// MongoDB Connection (Mongoose)
const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully.');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
};

module.exports = {
    sequelize,
    connectPostgres,
    connectMongo
};
