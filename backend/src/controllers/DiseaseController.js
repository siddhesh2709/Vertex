// Ported from the former Supabase edge function. This is a prototype: it does not analyze the
// uploaded image. It randomly selects from a short sample list, matching the previous behavior.
const SAMPLE_DISEASES = [
    {
        name: 'Early Blight',
        confidence: 0.87,
        description: 'Fungal disease causing dark brown spots with concentric rings on leaves',
        treatment: [
            'Remove and destroy infected leaves',
            'Apply Mancozeb fungicide (2g/liter)',
            'Maintain proper spacing for air circulation',
            'Avoid overhead irrigation'
        ],
        prevention: [
            'Use disease-free seeds',
            'Crop rotation with non-host crops',
            'Apply mulch to prevent soil splash',
            'Maintain balanced fertilization'
        ]
    },
    {
        name: 'Bacterial Leaf Spot',
        confidence: 0.72,
        description: 'Bacterial infection causing small water-soaked spots on leaves',
        treatment: [
            'Apply copper-based bactericide',
            'Remove severely infected plants',
            'Avoid working in wet fields',
            'Use drip irrigation instead of sprinkler'
        ],
        prevention: [
            'Use certified disease-free seeds',
            'Practice crop rotation',
            'Avoid excessive nitrogen fertilization',
            'Maintain field sanitation'
        ]
    },
    {
        name: 'Powdery Mildew',
        confidence: 0.65,
        description: 'Fungal disease showing white powdery coating on leaves',
        treatment: [
            'Spray sulfur-based fungicide',
            'Apply neem oil spray (5ml/liter)',
            'Remove severely affected leaves',
            'Improve air circulation'
        ],
        prevention: [
            'Avoid overhead watering',
            'Plant resistant varieties',
            'Maintain proper plant spacing',
            'Apply preventive sulfur dust'
        ]
    }
];

const detectDisease = (req, res) => {
    const { cropType } = req.body;

    if (!cropType) {
        return res.status(400).json({ error: 'cropType is required' });
    }

    // No image analysis is performed; this is a prototype placeholder.
    const detection = SAMPLE_DISEASES[Math.floor(Math.random() * SAMPLE_DISEASES.length)];

    res.json({ detection, isMockResult: true });
};

module.exports = { detectDisease };
