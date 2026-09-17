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
  // Each dependency is non-fatal so the API still serves what it can, but they
  // are all attempted before routes mount and before the port is bound.
  try {
    await connectPostgres();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL models synced.');
  } catch (error) {
    console.error('⚠️  PostgreSQL unavailable, continuing without it:', error.message);
  }

  try {
    await connectMongo();
  } catch (error) {
    console.error('⚠️  MongoDB unavailable, continuing without it:', error.message);
  }

  try {
    await connectRedis();
  } catch (error) {
    console.error('⚠️  Redis unavailable, continuing without it:', error.message);
  }

  // Mounted here rather than inside the Postgres block so the dashboard still
  // responds when Postgres is down.
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));

  await diseaseModel.load();

  app.listen(PORT, () => {
    console.log(`🚀 Vertex Backend running on port ${PORT}`);
  });
};

startServer();
