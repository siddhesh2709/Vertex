const express = require('express');
const mongoose = require('mongoose');
const { verifyToken } = require('../middleware/auth');
const Crop = require('../models/mongo/Crop');
const Cultivation = require('../models/mongo/Cultivation');

const router = express.Router();

// Initial schedules adapted from the project's existing templates.
// Each entry contains [week number, task title].
const schedules = {
    'Rice (Paddy)': [
        [1, 'Land preparation'],
        [2, 'Seed selection and preparation'],
        [3, 'Sowing or transplanting'],
        [5, 'Check irrigation requirements'],
        [7, 'Review fertilizer requirements'],
        [10, 'Inspect for pests'],
        [14, 'Review crop nutrition'],
        [17, 'Prepare for harvest'],
        [18, 'Harvest readiness assessment']
    ],
    Wheat: [
        [1, 'Land preparation'],
        [2, 'Seed preparation'],
        [3, 'Sowing'],
        [4, 'Check irrigation requirements'],
        [6, 'Weed management'],
        [8, 'Review fertilizer requirements'],
        [12, 'Inspect for diseases'],
        [16, 'Review pre-harvest irrigation'],
        [19, 'Harvest readiness assessment']
    ],
    Tomato: [
        [1, 'Nursery preparation'],
        [3, 'Land preparation'],
        [4, 'Transplanting'],
        [5, 'Provide plant supports'],
        [6, 'Review fertilizer requirements'],
        [8, 'Pruning and plant maintenance'],
        [10, 'Inspect for diseases'],
        [11, 'Monitor flowering and fruit setting'],
        [13, 'First harvest readiness assessment']
    ],
    Cotton: [
        [1, 'Land preparation'],
        [2, 'Seed preparation'],
        [3, 'Sowing'],
        [5, 'Check plant spacing'],
        [7, 'Review fertilizer requirements'],
        [10, 'Inspect for pests'],
        [14, 'Monitor flowering'],
        [20, 'Monitor boll formation'],
        [26, 'Harvest readiness assessment']
    ]
};

// POST /api/cultivations
router.post('/', verifyToken, async (req, res) => {
    try {
        const { cropId, areaAcres, startDate } = req.body || {};

        if (!mongoose.isObjectIdOrHexString(cropId)) {
            return res.status(400).json({
                error: 'Select a valid crop.'
            });
        }

        if (
            typeof areaAcres !== 'number' ||
            !Number.isFinite(areaAcres) ||
            areaAcres < 0.01
        ) {
            return res.status(400).json({
                error: 'Land area must be at least 0.01 acres.'
            });
        }

        if (
            typeof startDate !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(startDate)
        ) {
            return res.status(400).json({
                error: 'Start date must use YYYY-MM-DD format.'
            });
        }

        const start = new Date(`${startDate}T00:00:00.000Z`);

        if (
            Number.isNaN(start.getTime()) ||
            start.toISOString().slice(0, 10) !== startDate
        ) {
            return res.status(400).json({
                error: 'Enter a valid start date.'
            });
        }

        const crop = await Crop.findById(cropId);

        if (!crop) {
            return res.status(404).json({
                error: 'Crop not found.'
            });
        }

        const schedule = schedules[crop.name];

        if (!schedule) {
            return res.status(422).json({
                error: 'A roadmap template is not available for this crop.'
            });
        }

        const tasks = schedule.map(([week, title]) => {
            const dueDate = new Date(start);
            dueDate.setUTCDate(dueDate.getUTCDate() + (week - 1) * 7);

            return {
                title,
                description: `Week ${week} of the ${crop.name} cultivation plan.`,
                dueDate,
                status: 'pending'
            };
        });

        const cultivation = await Cultivation.create({
            userId: req.user.uid,
            crop: crop._id,
            areaAcres,
            startDate: start,
            status: 'active',
            tasks
        });

        await cultivation.populate('crop', 'name harvestTime imageURL');

        return res.status(201).json({ cultivation });
    } catch (error) {
        console.error('Create cultivation error:', error);

        return res.status(500).json({
            error: 'Unable to save the cultivation plan. Please try again.'
        });
    }
});
// GET /api/cultivations/latest
router.get('/latest', verifyToken, async (req, res) => {
    try {
        const cultivation = await Cultivation.findOne({
            userId: req.user.uid
        })
            .sort({ createdAt: -1, _id: -1 })
            .populate('crop', 'name harvestTime imageURL');

        return res.json({ cultivation });
    } catch (error) {
        console.error('Load cultivation error:', error);

        return res.status(500).json({
            error: 'Unable to load your saved roadmap.'
        });
    }
});

// PATCH /api/cultivations/:id/tasks/:taskId
router.patch('/:id/tasks/:taskId', verifyToken, async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const { status } = req.body || {};

        if (
            !mongoose.isObjectIdOrHexString(id) ||
            !mongoose.isObjectIdOrHexString(taskId)
        ) {
            return res.status(400).json({ error: 'Invalid plan or task ID.' });
        }

        if (!['pending', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid task status.' });
        }

        const cultivation = await Cultivation.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.uid,
                'tasks._id': taskId
            },
            {
                $set: {
                    'tasks.$.status': status,
                    'tasks.$.completedAt':
                        status === 'completed' ? new Date() : null
                }
            },
            { new: true, runValidators: true }
        );

        if (!cultivation) {
            return res.status(404).json({ error: 'Plan or task not found.' });
        }

        return res.json({
            task: cultivation.tasks.id(taskId)
        });
    } catch (error) {
        console.error('Update task error:', error);
        return res.status(500).json({ error: 'Unable to update task.' });
    }
});

module.exports = router;