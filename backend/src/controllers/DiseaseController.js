const diseaseModel = require('../services/diseaseModel');
const { DISEASE_INFO, SUPPORTED_CROPS } = require('../data/diseaseInfo');

const detectDisease = async (req, res) => {
    try {
        const { cropType } = req.body;

        if (!cropType) {
            return res.status(400).json({ error: 'cropType is required' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'An image file is required' });
        }
        if (!SUPPORTED_CROPS.includes(cropType)) {
            return res.status(422).json({
                error: 'unsupported_crop',
                message: `The model was not trained on ${cropType}.`,
                supportedCrops: SUPPORTED_CROPS
            });
        }
        if (!diseaseModel.isAvailable()) {
            return res.status(503).json({ error: 'Disease model is not loaded on the server.' });
        }

        const { top, ranked, energy, energyThreshold, looksLikeLeaf } = await diseaseModel.predict(req.file.buffer);

        // The classifier has no "not a leaf" class, so softmax stays confident on
        // anything at all. Reject low-energy input before reporting a diagnosis.
        if (looksLikeLeaf === false) {
            return res.json({
                notALeaf: true,
                cropType,
                energy,
                energyThreshold,
                message: 'This does not look like a leaf photo the model can read.'
            });
        }

        // Keep only predictions for the crop the farmer selected, so a tomato
        // model class can't be returned for a potato photo.
        const cropMatches = ranked.filter((r) => DISEASE_INFO[r.className]?.crop === cropType);
        const best = DISEASE_INFO[top.className]?.crop === cropType ? top : cropMatches[0];

        // Below this the model is effectively saying "this isn't that crop".
        // Reporting a near-zero-confidence class as a diagnosis would be misleading.
        const MIN_CONFIDENCE = 0.2;

        if (!best || best.probability < MIN_CONFIDENCE) {
            return res.json({
                mismatch: true,
                message: `This doesn't look like a ${cropType} leaf the model recognises. Check that the crop selection matches the photo, and that the leaf is clearly visible.`,
                cropType,
                bestGuess: top
                    ? { name: DISEASE_INFO[top.className]?.label || top.className,
                        crop: DISEASE_INFO[top.className]?.crop,
                        confidence: Number(top.probability.toFixed(4)) }
                    : null
            });
        }

        const info = DISEASE_INFO[best.className];
        const meta = diseaseModel.getMeta();

        res.json({
            detection: {
                className: best.className,
                name: info.label,
                crop: info.crop,
                healthy: info.healthy,
                confidence: Number(best.probability.toFixed(4)),
                description: info.description,
                treatment: info.treatment,
                prevention: info.prevention
            },
            // Alternatives must stay within the selected crop - offering a maize
            // disease as a runner-up for a tomato photo is just noise.
            alternatives: ranked
                .filter((r) => r.className !== best.className
                    && DISEASE_INFO[r.className]?.crop === cropType)
                .slice(0, 2)
                .map((r) => ({
                    name: DISEASE_INFO[r.className]?.label || r.className,
                    crop: DISEASE_INFO[r.className]?.crop,
                    confidence: Number(r.probability.toFixed(4))
                })),
            model: {
                architecture: meta.metrics.architecture,
                testAccuracy: meta.metrics.testAccuracy,
                classes: meta.classes.length,
                energy,
                // The model only ever saw single leaves on plain backgrounds.
                trainedOn: 'single-leaf images (PlantVillage)'
            }
        });
    } catch (error) {
        console.error('Disease detection error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getModelInfo = (req, res) => {
    if (!diseaseModel.isAvailable()) {
        return res.status(503).json({ available: false, supportedCrops: SUPPORTED_CROPS });
    }
    const meta = diseaseModel.getMeta();
    res.json({
        available: true,
        supportedCrops: SUPPORTED_CROPS,
        classes: meta.classes,
        metrics: meta.metrics
    });
};

module.exports = { detectDisease, getModelInfo };
