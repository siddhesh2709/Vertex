const User = require('../models/postgres/User');

const syncUser = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        let [user, created] = await User.findOrCreate({
            where: { firebaseUid: uid },
            defaults: {
                email,
                name,
                photoURL: picture
            }
        });

        if (!created) {
            // Update info if it changed
            user.name = name || user.name;
            user.photoURL = picture || user.photoURL;
            await user.save();
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { location, soilType, farmSize } = req.body;
        const { uid } = req.user;

        const user = await User.findOne({ where: { firebaseUid: uid } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.location = location || user.location;
        user.soilType = soilType || user.soilType;
        user.farmSize = farmSize || user.farmSize;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ where: { firebaseUid: req.user.uid } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    syncUser,
    updateProfile,
    getProfile
};
