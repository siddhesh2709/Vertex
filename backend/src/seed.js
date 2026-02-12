require('dotenv').config();
const { connectMongo } = require('./config/db');
const Crop = require('./models/mongo/Crop');

const seedData = async () => {
    try {
        await connectMongo();

        const crops = [
            {
                name: 'Rice (Paddy)',
                suitableSoil: ['Alluvial', 'Clay', 'Black'],
                growingSeason: ['kharif'],
                harvestTime: '120-150 days',
                description: 'Major food crop of India, thrives in hot and humid climates with abundant water.',
                benefits: ['High yield', 'Food security', 'Economic stability'],
                imageURL: 'https://images.unsplash.com/photo-1536633340742-134a65d0a134?q=80&w=800'
            },
            {
                name: 'Wheat',
                suitableSoil: ['Loamy', 'Alluvial', 'Black'],
                growingSeason: ['rabi'],
                harvestTime: '110-140 days',
                description: 'Primary winter crop, requires cool climate and moderate rainfall.',
                benefits: ['Nutritious', 'Easy storage', 'Stable market price'],
                imageURL: 'https://images.unsplash.com/photo-1501233321609-0010d8ef39da?q=80&w=800'
            },
            {
                name: 'Tomato',
                suitableSoil: ['Sandy', 'Loamy', 'Red'],
                growingSeason: ['kharif', 'rabi', 'zaid'],
                harvestTime: '60-90 days',
                description: 'High-value fruit vegetable, grows well in well-drained soils.',
                benefits: ['Short duration', 'High profit potential', 'Cash crop'],
                imageURL: 'https://images.unsplash.com/photo-1591850443137-068a15ac2026?q=80&w=800'
            },
            {
                name: 'Cotton',
                suitableSoil: ['Black', 'Alluvial'],
                growingSeason: ['kharif'],
                harvestTime: '150-180 days',
                description: 'Fiber crop, thrives in high temperature and low rainfall.',
                benefits: ['Industrial demand', 'Drought resistant', 'Long shelf life'],
                imageURL: 'https://images.unsplash.com/photo-1594903335541-118e7e170068?q=80&w=800'
            }
        ];

        await Crop.deleteMany({}); // Clear existing
        await Crop.insertMany(crops);

        console.log('✅ Database seeded successfully with initial crops!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
