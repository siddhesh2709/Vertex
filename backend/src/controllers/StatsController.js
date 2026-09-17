const Roadmap = require('../models/mongo/Roadmap');
const Post = require('../models/mongo/Post');
const User = require('../models/postgres/User');

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Real dashboard figures computed from the user's saved roadmaps and the
 * database, replacing the hardcoded placeholder numbers.
 */
const getDashboardStats = async (req, res) => {
    try {
        const uid = req.user.uid;
        const [roadmaps, farmerCount, postCount] = await Promise.all([
            Roadmap.find({ userId: uid }),
            User.count(),
            Post.countDocuments()
        ]);

        const now = Date.now();
        const upcoming = [];
        let pendingTotal = 0;

        for (const rm of roadmaps) {
            const start = new Date(rm.startDate).getTime();
            for (const task of rm.tasks) {
                if (task.status === 'completed') continue;
                pendingTotal += 1;
                const dueAt = start + (task.week - 1) * WEEK_MS;
                upcoming.push({
                    roadmapId: rm._id,
                    taskId: task._id,
                    crop: rm.cropName,
                    task: task.task,
                    description: task.description,
                    week: task.week,
                    dueAt: new Date(dueAt).toISOString(),
                    daysUntil: Math.round((dueAt - now) / (24 * 60 * 60 * 1000))
                });
            }
        }

        upcoming.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

        const dueThisWeek = upcoming.filter((t) => t.daysUntil >= 0 && t.daysUntil <= 7).length;
        const overdue = upcoming.filter((t) => t.daysUntil < 0).length;

        res.json({
            activeCrops: {
                count: roadmaps.length,
                names: roadmaps.map((r) => r.cropName)
            },
            tasks: {
                dueThisWeek,
                overdue,
                pendingTotal,
                upcoming: upcoming.slice(0, 5)
            },
            community: {
                farmers: farmerCount,
                posts: postCount
            },
            land: {
                totalAcres: roadmaps.reduce((sum, r) => sum + (r.landArea || 0), 0)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDashboardStats };
