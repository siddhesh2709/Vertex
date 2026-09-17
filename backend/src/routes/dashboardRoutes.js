const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Cultivation = require('../models/mongo/Cultivation');
require('../models/mongo/Crop');
const User = require('../models/postgres/User');

const router = express.Router();
const DAY_MS = 24 * 60 * 60 * 1000;

router.get('/summary', verifyToken, async (req, res) => {
    const today = req.query.today || new Date().toISOString().slice(0, 10);

    if (
        typeof today !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(today)
    ) {
        return res.status(400).json({
            error: 'Use YYYY-MM-DD for today.'
        });
    }

    const start = new Date(`${today}T00:00:00.000Z`);

    if (
        Number.isNaN(start.getTime()) ||
        start.toISOString().slice(0, 10) !== today
    ) {
        return res.status(400).json({
            error: 'Invalid calendar date.'
        });
    }

    try {
        const [plans, profile] = await Promise.all([
            Cultivation.find({
                userId: req.user.uid,
                status: { $ne: 'cancelled' }
            })
                .sort({ createdAt: -1, _id: -1 })
                .populate('crop', 'name')
                .lean(),

            User.findOne({
                where: { firebaseUid: req.user.uid },
                attributes: ['name', 'location', 'soilType', 'farmSize']
            })
        ]);

        let totalTasks = 0;
        let completedTasks = 0;
        const pending = [];

        const planSummaries = plans.map((plan) => {
            const tasks = plan.tasks || [];
            const completed = tasks.filter(
                (task) => task.status === 'completed'
            ).length;

            const cropName = plan.crop?.name || 'Previously selected crop';

            totalTasks += tasks.length;
            completedTasks += completed;

            for (const task of tasks) {
                if (task.status !== 'pending') continue;

                const due = new Date(task.dueDate);

                pending.push({
                    id: String(task._id),
                    cultivationId: String(plan._id),
                    title: task.title,
                    cropName,
                    description: task.description || '',
                    dueDate: due.toISOString(),
                    daysUntilDue: Math.round(
                        (due.getTime() - start.getTime()) / DAY_MS
                    )
                });
            }

            return {
                id: String(plan._id),
                cropName,
                areaAcres: plan.areaAcres,
                startDate: plan.startDate,
                totalTasks: tasks.length,
                completedTasks: completed,
                progressPercent: tasks.length
                    ? Math.round((completed / tasks.length) * 100)
                    : 0
            };
        });

        pending.sort(
            (a, b) =>
                a.dueDate.localeCompare(b.dueDate) ||
                a.id.localeCompare(b.id)
        );

        const overdueTasks = pending.filter(
            (task) => task.daysUntilDue < 0
        ).length;

        const dueNext7Days = pending.filter(
            (task) => task.daysUntilDue >= 0 && task.daysUntilDue < 7
        ).length;

        res.set('Cache-Control', 'no-store');

        return res.json({
            today,
            generatedAt: new Date().toISOString(),
            profile: profile ? profile.toJSON() : null,
            stats: {
                cultivationPlans: plans.length,
                totalTasks,
                completedTasks,
                pendingTasks: pending.length,
                overdueTasks,
                dueNext7Days,
                progressPercent: totalTasks
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0
            },
            nextTasks: pending.slice(0, 8),
            recentPlans: planSummaries.slice(0, 6)
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);

        return res.status(500).json({
            error: 'Unable to load your dashboard. Please try again.'
        });
    }
});

module.exports = router;