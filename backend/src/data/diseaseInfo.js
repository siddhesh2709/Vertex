// Guidance for each PlantVillage class the model can predict.
// Keys match the ONNX model's class labels exactly.
const DISEASE_INFO = {
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        label: 'Gray Leaf Spot',
        crop: 'Maize',
        healthy: false,
        description: 'Fungal disease producing long, narrow, rectangular grey-brown lesions running parallel to the leaf veins.',
        treatment: [
            'Apply a strobilurin or triazole fungicide at early lesion stage',
            'Remove and destroy heavily infected lower leaves',
            'Avoid overhead irrigation late in the day'
        ],
        prevention: [
            'Rotate away from maize for at least one season',
            'Plough in or remove infected crop residue after harvest',
            'Choose resistant hybrids where available',
            'Avoid dense planting so the canopy dries quickly'
        ]
    },
    'Corn_(maize)___Common_rust_': {
        label: 'Common Rust',
        crop: 'Maize',
        healthy: false,
        description: 'Small cinnamon-brown powdery pustules scattered on both leaf surfaces, rupturing the leaf skin.',
        treatment: [
            'Apply a triazole or strobilurin fungicide if pustules appear before tasselling',
            'Monitor weekly — rust spreads fast in cool, humid weather',
            'Maintain balanced nitrogen to help the crop outgrow early infection'
        ],
        prevention: [
            'Plant rust-resistant hybrids',
            'Sow early to escape peak rust season',
            'Avoid excessive nitrogen, which encourages soft susceptible growth'
        ]
    },
    'Corn_(maize)___Northern_Leaf_Blight': {
        label: 'Northern Leaf Blight',
        crop: 'Maize',
        healthy: false,
        description: 'Long cigar-shaped grey-green lesions that later turn tan, starting on the lower leaves.',
        treatment: [
            'Apply fungicide if lesions reach the leaf below the ear before silking',
            'Remove severely infected lower leaves where practical',
            'Improve field drainage to reduce prolonged leaf wetness'
        ],
        prevention: [
            'Use resistant hybrids',
            'Rotate with a non-host crop such as pulses',
            'Bury crop residue by deep ploughing after harvest'
        ]
    },
    'Corn_(maize)___healthy': {
        label: 'Healthy',
        crop: 'Maize',
        healthy: true,
        description: 'No disease symptoms detected. The leaf appears healthy.',
        treatment: [],
        prevention: [
            'Continue regular field scouting, especially after humid spells',
            'Maintain balanced fertilisation and adequate spacing'
        ]
    },
    'Pepper,_bell___Bacterial_spot': {
        label: 'Bacterial Spot',
        crop: 'Pepper',
        healthy: false,
        description: 'Small water-soaked spots that turn dark brown with a yellow halo, often causing leaf drop.',
        treatment: [
            'Apply copper-based bactericide at first symptoms',
            'Remove and destroy badly infected plants',
            'Stop overhead watering — switch to drip if possible',
            'Avoid working the field while foliage is wet'
        ],
        prevention: [
            'Use certified disease-free seed and seedlings',
            'Rotate away from peppers and tomatoes for two seasons',
            'Disinfect tools and stakes between plantings'
        ]
    },
    'Pepper,_bell___healthy': {
        label: 'Healthy',
        crop: 'Pepper',
        healthy: true,
        description: 'No disease symptoms detected. The leaf appears healthy.',
        treatment: [],
        prevention: [
            'Keep scouting weekly, particularly after rain',
            'Maintain good airflow between plants'
        ]
    },
    'Potato___Early_blight': {
        label: 'Early Blight',
        crop: 'Potato',
        healthy: false,
        description: 'Dark brown spots with concentric rings forming a target pattern, starting on older lower leaves.',
        treatment: [
            'Apply a protectant fungicide such as mancozeb or chlorothalonil',
            'Remove and destroy infected lower foliage',
            'Keep the crop well watered and fertilised — stressed plants are hit hardest'
        ],
        prevention: [
            'Rotate with non-solanaceous crops for two years',
            'Destroy volunteer potato plants and crop debris',
            'Hill soil well to protect tubers from spores washing down'
        ]
    },
    'Potato___Late_blight': {
        label: 'Late Blight',
        crop: 'Potato',
        healthy: false,
        description: 'Rapidly spreading dark water-soaked patches, often with white fungal growth on the leaf underside in humid weather. This is a serious, fast-moving disease.',
        treatment: [
            'Act immediately — apply a systemic fungicide (metalaxyl or cymoxanil based)',
            'Remove and destroy infected plants; do not compost them',
            'Cut and remove haulm before harvest if infection is widespread',
            'Harvest only in dry conditions to limit tuber infection'
        ],
        prevention: [
            'Plant certified disease-free seed tubers',
            'Use resistant varieties in high-risk areas',
            'Avoid overhead irrigation and waterlogged fields',
            'Watch regional blight warnings during cool, wet spells'
        ]
    },
    'Potato___healthy': {
        label: 'Healthy',
        crop: 'Potato',
        healthy: true,
        description: 'No disease symptoms detected. The leaf appears healthy.',
        treatment: [],
        prevention: [
            'Scout regularly during cool, wet weather when blight risk is highest',
            'Maintain hilling and good drainage'
        ]
    },
    'Tomato___Bacterial_spot': {
        label: 'Bacterial Spot',
        crop: 'Tomato',
        healthy: false,
        description: 'Numerous small dark water-soaked spots on leaves and scabby raised spots on fruit.',
        treatment: [
            'Apply copper-based bactericide, ideally with mancozeb',
            'Remove severely infected plants to slow spread',
            'Switch to drip irrigation and avoid handling wet plants'
        ],
        prevention: [
            'Use certified disease-free seed; hot-water treat seed if saving your own',
            'Rotate for two years away from tomato and pepper',
            'Avoid excess nitrogen and overhead watering'
        ]
    },
    'Tomato___Early_blight': {
        label: 'Early Blight',
        crop: 'Tomato',
        healthy: false,
        description: 'Brown spots with concentric rings forming a target pattern, usually starting on older lower leaves with yellowing around them.',
        treatment: [
            'Apply mancozeb or chlorothalonil at first symptoms and repeat per label interval',
            'Remove and destroy affected lower leaves',
            'Mulch around the base to stop soil splash onto foliage'
        ],
        prevention: [
            'Stake plants and prune lower leaves for airflow',
            'Rotate crops for two years',
            'Water at the base, never over the canopy'
        ]
    },
    'Tomato___Late_blight': {
        label: 'Late Blight',
        crop: 'Tomato',
        healthy: false,
        description: 'Large greasy grey-green patches that brown rapidly, with white mould on leaf undersides in humid conditions. Spreads very quickly.',
        treatment: [
            'Act immediately — apply a systemic fungicide (metalaxyl or cymoxanil based)',
            'Remove and destroy infected plants; do not compost',
            'Increase spacing and airflow where possible'
        ],
        prevention: [
            'Grow resistant varieties in blight-prone regions',
            'Avoid overhead irrigation and evening watering',
            'Destroy volunteer tomato and potato plants nearby'
        ]
    },
    'Tomato___Leaf_Mold': {
        label: 'Leaf Mold',
        crop: 'Tomato',
        healthy: false,
        description: 'Pale yellow blotches on the upper leaf surface with olive-green to brown velvety mould underneath. Common in humid, poorly ventilated conditions.',
        treatment: [
            'Improve ventilation immediately — thin foliage and widen spacing',
            'Apply a labelled fungicide such as chlorothalonil',
            'Reduce humidity by watering early in the day'
        ],
        prevention: [
            'Avoid dense planting, especially under polyhouse conditions',
            'Prune lower leaves to open the canopy',
            'Use resistant varieties where leaf mould is recurrent'
        ]
    },
    'Tomato___Septoria_leaf_spot': {
        label: 'Septoria Leaf Spot',
        crop: 'Tomato',
        healthy: false,
        description: 'Many small circular spots with dark borders and pale grey centres, starting on lower leaves and moving upward.',
        treatment: [
            'Apply mancozeb or chlorothalonil promptly',
            'Strip and destroy the worst-affected lower leaves',
            'Mulch to prevent spores splashing up from the soil'
        ],
        prevention: [
            'Clear all crop debris at end of season',
            'Rotate for at least two years',
            'Keep foliage dry — water at soil level'
        ]
    },
    'Tomato___Spider_mites Two-spotted_spider_mite': {
        label: 'Two-Spotted Spider Mite',
        crop: 'Tomato',
        healthy: false,
        description: 'Fine yellow stippling on leaves with delicate webbing underneath. A sap-sucking pest, not a disease; worst in hot dry weather.',
        treatment: [
            'Spray neem oil (about 5 ml per litre), covering leaf undersides thoroughly',
            'Use a miticide if populations are heavy; rotate active ingredients',
            'Spray water on leaf undersides to knock mites back',
            'Remove and destroy the most heavily infested leaves'
        ],
        prevention: [
            'Avoid dusty field conditions, which favour mites',
            'Maintain adequate soil moisture — drought-stressed plants attract mites',
            'Encourage natural predators by avoiding broad-spectrum insecticides'
        ]
    },
    'Tomato___Target_Spot': {
        label: 'Target Spot',
        crop: 'Tomato',
        healthy: false,
        description: 'Brown lesions with concentric rings and a light centre, appearing on leaves, stems and fruit.',
        treatment: [
            'Apply a labelled fungicide such as chlorothalonil or azoxystrobin',
            'Remove infected leaves and fruit',
            'Improve airflow through pruning'
        ],
        prevention: [
            'Rotate crops and clear debris between seasons',
            'Avoid prolonged leaf wetness',
            'Space plants to promote quick drying'
        ]
    },
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
        label: 'Yellow Leaf Curl Virus',
        crop: 'Tomato',
        healthy: false,
        description: 'Upward curling leaves with yellow margins, stunted growth and heavy flower drop. Spread by whitefly — there is no cure once a plant is infected.',
        treatment: [
            'Remove and destroy infected plants promptly to protect the rest of the field',
            'Control whitefly with yellow sticky traps and appropriate insecticide',
            'Do not attempt to treat the virus itself — focus on the vector'
        ],
        prevention: [
            'Use virus-resistant varieties where available',
            'Protect nurseries with insect-proof netting',
            'Control weeds that host whitefly',
            'Avoid planting next to an older infected tomato crop'
        ]
    },
    'Tomato___Tomato_mosaic_virus': {
        label: 'Tomato Mosaic Virus',
        crop: 'Tomato',
        healthy: false,
        description: 'Mottled light and dark green patches on leaves, sometimes with distortion and stunting. Spreads readily by handling and on tools.',
        treatment: [
            'Remove and destroy infected plants — there is no chemical cure',
            'Wash hands and disinfect tools with a bleach or milk solution after handling',
            'Avoid using tobacco products near the crop, which can carry the virus'
        ],
        prevention: [
            'Use certified virus-free seed and resistant varieties',
            'Disinfect stakes, trays and tools between seasons',
            'Avoid unnecessary handling of plants when wet'
        ]
    },
    'Tomato___healthy': {
        label: 'Healthy',
        crop: 'Tomato',
        healthy: true,
        description: 'No disease symptoms detected. The leaf appears healthy.',
        treatment: [],
        prevention: [
            'Keep scouting weekly, checking leaf undersides',
            'Maintain staking, spacing and base watering'
        ]
    }
};

// Crops the model was actually trained on.
const SUPPORTED_CROPS = ['Tomato', 'Potato', 'Maize', 'Pepper'];

module.exports = { DISEASE_INFO, SUPPORTED_CROPS };
