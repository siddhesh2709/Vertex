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
const roadmapRoutes = require('./routes/roadmapRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const marketRoutes = require('./routes/marketRoutes');
const statsRoutes = require('./routes/statsRoutes');

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
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Database Connections & Server Start
const startServer = async () => {
  try {
    await connectPostgres();
    await connectMongo();
    await connectRedis();

    // Sync PostgreSQL Models
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL models synced.');

    // Non-fatal: the API still serves everything else if the model is missing.
    await diseaseModel.load();

    app.listen(PORT, () => {
      console.log(`🚀 Vertex Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
