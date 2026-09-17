require('dotenv').config();
const { connectMongo } = require('./config/db');
const Post = require('./models/mongo/Post');

const seedData = async () => {
    try {
        await connectMongo();

        const posts = [
            {
                userId: 'sample-farmer-1',
                userName: 'Ramesh Patel',
                userPhoto: '',
                content: 'Just finished sowing wheat on the north field. Soil moisture looks good after last week\'s rain — hoping for a strong rabi season this year!',
                likes: [],
                comments: []
            },
            {
                userId: 'sample-farmer-2',
                userName: 'Sunita Devi',
                userPhoto: '',
                content: 'Tomato prices are finally picking up in our local mandi. Anyone else holding stock, or is it time to sell?',
                likes: [],
                comments: []
            },
            {
                userId: 'sample-farmer-3',
                userName: 'Vijay Kumar',
                userPhoto: '',
                content: 'Tried bamboo staking for my tomato crop this season instead of the usual method — much easier to harvest and less fruit rot. Happy to share what worked for me.',
                likes: [],
                comments: []
            }
        ];

        await Post.deleteMany({ userId: { $in: posts.map(p => p.userId) } });
        await Post.insertMany(posts);

        console.log('✅ FarmFeed seeded with sample posts!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding posts failed:', error);
        process.exit(1);
    }
};

seedData();
