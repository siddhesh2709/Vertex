require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { connectPostgres, connectMongo, sequelize } = require('./config/db');
const { connectRedis } = require('./config/redis');
const diseaseModel = require('./services/diseaseModel');

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const cropRoutes = require('./routes/cropRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // For local image serving if needed
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/social', postRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/cultivations', require('./routes/cultivationRoutes'));
app.use('/api/disease', require('./routes/diseaseRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Database Connections & Server Start
const startServer = async () => {
  // Connect to PostgreSQL (non-fatal)
  try {
    await connectPostgres();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL models synced.');

    app.use('/api/dashboard', require('./routes/dashboardRoutes'));

    // Non-fatal: the rest of the API still serves if the model worker is down.
    await diseaseModel.load();

    app.listen(PORT, () => {
      console.log(`🚀 Vertex Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('⚠️  PostgreSQL unavailable, continuing without it:', error.message);
  }

  // Connect to MongoDB (non-fatal)
  try {
    await connectMongo();
  } catch (error) {
    console.error('⚠️  MongoDB unavailable, continuing without it:', error.message);
  }

  // Connect to Redis (non-fatal)
  try {
    await connectRedis();
  } catch (error) {
    console.error('⚠️  Redis unavailable, continuing without it:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 HarvestHub Backend running on port ${PORT}`);
  });
};

startServer();
