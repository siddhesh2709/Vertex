// Generated for the v2 model (see backend/model/model_meta.json).
// Keys match the model's class labels exactly.
// Crops this app plans around carry crop-specific guidance; the remaining
// PlantVillage classes fall back to shared descriptions for the same disease,
// and anything without curated agronomy says so rather than inventing advice.
const DISEASE_INFO = {
    "apple apple scab": {
        "label": "Apple Scab",
        "crop": "Apple",
        "healthy": false,
        "description": "Olive-green to black velvety spots on leaves and fruit, often with puckering.",
        "treatment": [
            "Apply a scab fungicide on the local spray schedule",
            "Rake and destroy fallen leaves"
        ],
        "prevention": [
            "Plant resistant cultivars",
            "Prune for airflow",
            "Clear leaf litter over winter"
        ]
    },
    "apple black rot": {
        "label": "Black Rot",
        "crop": "Apple",
        "healthy": false,
        "description": "Brown leaf spots with darker margins; fruit shrivels and blackens.",
        "treatment": [
            "Prune out cankers and mummified fruit",
            "Apply a labelled fungicide from bud break"
        ],
        "prevention": [
            "Remove mummies and prunings from the orchard",
            "Improve airflow",
            "Avoid wounding"
        ]
    },
    "apple cedar apple rust": {
        "label": "Cedar Apple Rust",
        "crop": "Apple",
        "healthy": false,
        "description": "Bright orange-yellow spots on leaves, sometimes with tubular structures underneath.",
        "treatment": [
            "Apply a fungicide during the infection window in spring",
            "Remove nearby juniper galls where practical"
        ],
        "prevention": [
            "Plant resistant cultivars",
            "Separate apples from juniper hosts where possible"
        ]
    },
    "apple healthy": {
        "label": "Healthy",
        "crop": "Apple",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "blueberry healthy": {
        "label": "Healthy",
        "crop": "Blueberry",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "cherry healthy": {
        "label": "Healthy",
        "crop": "Cherry",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "cherry powdery mildew": {
        "label": "Powdery Mildew",
        "crop": "Cherry",
        "healthy": false,
        "description": "White powdery coating on leaf surfaces.",
        "treatment": [
            "Spray a sulfur-based fungicide or neem oil",
            "Remove badly affected leaves",
            "Improve air circulation"
        ],
        "prevention": [
            "Avoid overhead watering",
            "Plant resistant varieties",
            "Maintain spacing"
        ]
    },
    "corn cercospora leaf spot gray leaf spot": {
        "label": "Cercospora Leaf Spot Gray Leaf Spot",
        "crop": "Maize",
        "healthy": false,
        "description": "Narrow rectangular grey-brown lesions running parallel to the veins.",
        "treatment": [
            "Apply a strobilurin or triazole fungicide at early lesion stage",
            "Remove heavily infected lower leaves"
        ],
        "prevention": [
            "Rotate away for a season",
            "Remove or plough in residue",
            "Avoid dense planting"
        ]
    },
    "corn common rust": {
        "label": "Common Rust",
        "crop": "Maize",
        "healthy": false,
        "description": "Cinnamon-brown powdery pustules on both leaf surfaces.",
        "treatment": [
            "Apply a triazole or strobilurin fungicide if pustules appear early",
            "Scout weekly - rust spreads fast in cool humid weather"
        ],
        "prevention": [
            "Plant resistant hybrids",
            "Sow early to escape peak rust",
            "Avoid excess nitrogen"
        ]
    },
    "corn healthy": {
        "label": "Healthy",
        "crop": "Maize",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "corn northern leaf blight": {
        "label": "Northern Leaf Blight",
        "crop": "Maize",
        "healthy": false,
        "description": "Long cigar-shaped grey-green lesions turning tan, starting on lower leaves.",
        "treatment": [
            "Apply fungicide if lesions reach the ear leaf before silking",
            "Improve drainage to cut leaf wetness"
        ],
        "prevention": [
            "Use resistant hybrids",
            "Rotate with a non-host crop",
            "Bury residue by deep ploughing"
        ]
    },
    "cotton alternaria leaf": {
        "label": "Alternaria Leaf Spot",
        "crop": "Cotton",
        "healthy": false,
        "description": "Small brown spots with concentric rings that enlarge and cause early leaf fall.",
        "treatment": [
            "Apply mancozeb or a similar protectant fungicide",
            "Remove severely affected leaves",
            "Maintain balanced potassium nutrition"
        ],
        "prevention": [
            "Rotate crops",
            "Avoid water stress, which predisposes the crop",
            "Clear crop residue after harvest"
        ]
    },
    "cotton bacterial blight": {
        "label": "Bacterial Blight",
        "crop": "Cotton",
        "healthy": false,
        "description": "Angular water-soaked spots bounded by leaf veins, later turning brown; can spread to bolls.",
        "treatment": [
            "Remove and destroy infected crop debris",
            "Apply a copper-based spray where approved",
            "Avoid overhead irrigation and working the crop when wet"
        ],
        "prevention": [
            "Sow acid-delinted, certified seed",
            "Rotate away from cotton for a season",
            "Choose resistant varieties",
            "Destroy volunteer cotton plants"
        ]
    },
    "cotton fusarium wilt": {
        "label": "Fusarium Wilt",
        "crop": "Cotton",
        "healthy": false,
        "description": "Yellowing and wilting that often affects one side of the plant; browning is visible inside cut stems. Soil-borne.",
        "treatment": [
            "There is no effective in-season cure - remove affected plants",
            "Avoid moving soil or equipment from infected areas",
            "Keep the crop otherwise unstressed to limit losses"
        ],
        "prevention": [
            "Plant resistant varieties, which is the main control",
            "Use long rotations away from cotton",
            "Improve drainage",
            "Treat seed before sowing"
        ]
    },
    "cotton healthy leaf": {
        "label": "Healthy",
        "crop": "Cotton",
        "healthy": false,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain balanced nutrition and spacing"
        ]
    },
    "cotton verticillium wilt": {
        "label": "Verticillium Wilt",
        "crop": "Cotton",
        "healthy": false,
        "description": "Yellow wedges between leaf veins, progressive wilting and early defoliation. Soil-borne and persistent.",
        "treatment": [
            "No effective in-season chemical control; remove affected plants",
            "Avoid excess nitrogen, which worsens symptoms",
            "Irrigate carefully to limit plant stress"
        ],
        "prevention": [
            "Use tolerant varieties",
            "Rotate with cereals for several seasons",
            "Avoid fields with a known history",
            "Manage residue by deep ploughing"
        ]
    },
    "grape black rot": {
        "label": "Black Rot",
        "crop": "Grape",
        "healthy": false,
        "description": "Brown leaf spots with darker margins; fruit shrivels and blackens.",
        "treatment": [
            "Prune out cankers and mummified fruit",
            "Apply a labelled fungicide from bud break"
        ],
        "prevention": [
            "Remove mummies and prunings from the orchard",
            "Improve airflow",
            "Avoid wounding"
        ]
    },
    "grape esca": {
        "label": "Esca",
        "crop": "Grape",
        "healthy": false,
        "description": "Dark streaking in the wood with tiger-striped leaves; a chronic trunk disease.",
        "treatment": [
            "Remove and destroy affected wood",
            "There is no reliable chemical cure"
        ],
        "prevention": [
            "Avoid large pruning wounds",
            "Prune in dry weather",
            "Seal cuts on mature vines"
        ]
    },
    "grape healthy": {
        "label": "Healthy",
        "crop": "Grape",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "grape leaf blight": {
        "label": "Leaf Blight",
        "crop": "Grape",
        "healthy": false,
        "description": "Angular dark brown leaf spots that merge and cause early leaf fall.",
        "treatment": [
            "Apply a labelled fungicide",
            "Remove fallen leaves"
        ],
        "prevention": [
            "Improve canopy airflow",
            "Avoid overhead irrigation"
        ]
    },
    "orange haunglongbing": {
        "label": "Haunglongbing",
        "crop": "Orange",
        "healthy": false,
        "description": "Blotchy asymmetric leaf mottling, lopsided bitter fruit and dieback. Spread by psyllid; incurable.",
        "treatment": [
            "Remove infected trees to protect the rest of the block",
            "Control citrus psyllid rigorously",
            "There is no cure for an infected tree"
        ],
        "prevention": [
            "Plant certified disease-free nursery stock",
            "Monitor for psyllid year-round",
            "Coordinate area-wide control with neighbours"
        ]
    },
    "peach bacterial spot": {
        "label": "Bacterial Spot",
        "crop": "Peach",
        "healthy": false,
        "description": "Small dark water-soaked spots, often with a yellow halo, that can cause leaf drop.",
        "treatment": [
            "Apply a copper-based bactericide at first symptoms",
            "Remove badly infected plants",
            "Switch to drip irrigation"
        ],
        "prevention": [
            "Use certified disease-free seed",
            "Rotate for two seasons",
            "Avoid working the crop when wet"
        ]
    },
    "peach healthy": {
        "label": "Healthy",
        "crop": "Peach",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "pepper, bell bacterial spot": {
        "label": "Bacterial Spot",
        "crop": "Pepper",
        "healthy": false,
        "description": "Small dark water-soaked spots, often with a yellow halo, that can cause leaf drop.",
        "treatment": [
            "Apply a copper-based bactericide at first symptoms",
            "Remove badly infected plants",
            "Switch to drip irrigation"
        ],
        "prevention": [
            "Use certified disease-free seed",
            "Rotate for two seasons",
            "Avoid working the crop when wet"
        ]
    },
    "pepper, bell healthy": {
        "label": "Healthy",
        "crop": "Pepper",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "potato early blight": {
        "label": "Early Blight",
        "crop": "Potato",
        "healthy": false,
        "description": "Brown spots with concentric rings forming a target pattern, usually starting on older lower leaves.",
        "treatment": [
            "Apply a protectant fungicide such as mancozeb or chlorothalonil",
            "Remove and destroy affected lower leaves",
            "Mulch to stop soil splashing onto foliage"
        ],
        "prevention": [
            "Rotate crops for two years",
            "Stake and prune for airflow",
            "Water at the base, not over the canopy"
        ]
    },
    "potato healthy": {
        "label": "Healthy",
        "crop": "Potato",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "potato late blight": {
        "label": "Late Blight",
        "crop": "Potato",
        "healthy": false,
        "description": "Rapidly spreading dark water-soaked patches, often with white mould underneath in humid weather. Moves fast.",
        "treatment": [
            "Act immediately with a systemic fungicide (metalaxyl or cymoxanil based)",
            "Remove and destroy infected plants; do not compost",
            "Harvest only in dry conditions"
        ],
        "prevention": [
            "Use resistant varieties",
            "Avoid overhead irrigation",
            "Destroy volunteer plants nearby",
            "Watch regional blight warnings in cool, wet spells"
        ]
    },
    "raspberry healthy": {
        "label": "Healthy",
        "crop": "Raspberry",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "rice bacterialblight": {
        "label": "Bacterial Blight",
        "crop": "Rice",
        "healthy": false,
        "description": "Water-soaked yellow streaks along leaf margins that turn straw-coloured and dry; wilting in severe cases.",
        "treatment": [
            "Drain the field and avoid deep standing water",
            "Apply a copper-based bactericide where locally approved",
            "Stop top-dressing nitrogen until the outbreak slows"
        ],
        "prevention": [
            "Sow certified, treated seed",
            "Use resistant varieties where available",
            "Avoid injuring seedlings during transplanting",
            "Keep bunds free of host weeds"
        ]
    },
    "rice blast": {
        "label": "Rice Blast",
        "crop": "Rice",
        "healthy": false,
        "description": "Spindle-shaped lesions with grey centres and brown margins on leaves; can rot the neck of the panicle.",
        "treatment": [
            "Apply a tricyclazole or isoprothiolane fungicide at first sign",
            "Drain intermittently rather than keeping continuous flood",
            "Hold back further nitrogen, which worsens blast"
        ],
        "prevention": [
            "Grow blast-resistant varieties",
            "Split nitrogen doses instead of one heavy application",
            "Avoid very dense planting",
            "Destroy infected stubble after harvest"
        ]
    },
    "rice brownspot": {
        "label": "Brown Spot",
        "crop": "Rice",
        "healthy": false,
        "description": "Small oval brown lesions scattered across the leaf, often a sign of nutrient-poor or drought-stressed soil.",
        "treatment": [
            "Correct the underlying nutrient deficiency, especially potassium",
            "Apply a mancozeb-based fungicide if spread is rapid",
            "Maintain steady soil moisture"
        ],
        "prevention": [
            "Treat seed before sowing",
            "Fertilise according to a soil test",
            "Avoid prolonged water stress",
            "Incorporate organic matter to improve soil health"
        ]
    },
    "rice tungro": {
        "label": "Tungro Virus",
        "crop": "Rice",
        "healthy": false,
        "description": "Stunted plants with orange-yellow discolouration from the leaf tip down. Spread by green leafhopper; infected plants cannot be cured.",
        "treatment": [
            "Remove and destroy infected plants promptly",
            "Control green leafhopper populations",
            "Do not attempt to treat the virus itself - target the vector"
        ],
        "prevention": [
            "Plant tungro-resistant varieties",
            "Synchronise planting across neighbouring fields",
            "Keep a fallow break to interrupt the vector cycle",
            "Remove volunteer rice and grassy weeds"
        ]
    },
    "soybean healthy": {
        "label": "Healthy",
        "crop": "Soybean",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "squash powdery mildew": {
        "label": "Powdery Mildew",
        "crop": "Squash",
        "healthy": false,
        "description": "White powdery coating on leaf surfaces.",
        "treatment": [
            "Spray a sulfur-based fungicide or neem oil",
            "Remove badly affected leaves",
            "Improve air circulation"
        ],
        "prevention": [
            "Avoid overhead watering",
            "Plant resistant varieties",
            "Maintain spacing"
        ]
    },
    "strawberry healthy": {
        "label": "Healthy",
        "crop": "Strawberry",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "strawberry leaf scorch": {
        "label": "Leaf Scorch",
        "crop": "Strawberry",
        "healthy": false,
        "description": "Purple-bordered spots that enlarge and dry the leaf margins.",
        "treatment": [
            "Remove affected foliage after harvest",
            "Apply a labelled fungicide if severe"
        ],
        "prevention": [
            "Improve airflow and drainage",
            "Avoid overhead watering",
            "Renovate beds after fruiting"
        ]
    },
    "tomato bacterial spot": {
        "label": "Bacterial Spot",
        "crop": "Tomato",
        "healthy": false,
        "description": "Small dark water-soaked spots, often with a yellow halo, that can cause leaf drop.",
        "treatment": [
            "Apply a copper-based bactericide at first symptoms",
            "Remove badly infected plants",
            "Switch to drip irrigation"
        ],
        "prevention": [
            "Use certified disease-free seed",
            "Rotate for two seasons",
            "Avoid working the crop when wet"
        ]
    },
    "tomato early blight": {
        "label": "Early Blight",
        "crop": "Tomato",
        "healthy": false,
        "description": "Brown spots with concentric rings forming a target pattern, usually starting on older lower leaves.",
        "treatment": [
            "Apply a protectant fungicide such as mancozeb or chlorothalonil",
            "Remove and destroy affected lower leaves",
            "Mulch to stop soil splashing onto foliage"
        ],
        "prevention": [
            "Rotate crops for two years",
            "Stake and prune for airflow",
            "Water at the base, not over the canopy"
        ]
    },
    "tomato healthy": {
        "label": "Healthy",
        "crop": "Tomato",
        "healthy": true,
        "description": "No disease symptoms detected. The leaf appears healthy.",
        "treatment": [],
        "prevention": [
            "Keep scouting weekly, checking leaf undersides",
            "Maintain good spacing and balanced nutrition"
        ]
    },
    "tomato late blight": {
        "label": "Late Blight",
        "crop": "Tomato",
        "healthy": false,
        "description": "Rapidly spreading dark water-soaked patches, often with white mould underneath in humid weather. Moves fast.",
        "treatment": [
            "Act immediately with a systemic fungicide (metalaxyl or cymoxanil based)",
            "Remove and destroy infected plants; do not compost",
            "Harvest only in dry conditions"
        ],
        "prevention": [
            "Use resistant varieties",
            "Avoid overhead irrigation",
            "Destroy volunteer plants nearby",
            "Watch regional blight warnings in cool, wet spells"
        ]
    },
    "tomato leaf mold": {
        "label": "Leaf Mold",
        "crop": "Tomato",
        "healthy": false,
        "description": "Pale yellow blotches above with olive-green velvety mould underneath; thrives in humid, still air.",
        "treatment": [
            "Improve ventilation immediately",
            "Apply a labelled fungicide",
            "Water early in the day to cut humidity"
        ],
        "prevention": [
            "Avoid dense planting",
            "Prune lower leaves",
            "Use resistant varieties where recurrent"
        ]
    },
    "tomato septoria leaf spot": {
        "label": "Septoria Leaf Spot",
        "crop": "Tomato",
        "healthy": false,
        "description": "Many small circular spots with dark borders and pale centres, spreading upward from lower leaves.",
        "treatment": [
            "Apply mancozeb or chlorothalonil promptly",
            "Strip the worst-affected lower leaves",
            "Mulch to block soil splash"
        ],
        "prevention": [
            "Clear all debris at season end",
            "Rotate for two years",
            "Keep foliage dry"
        ]
    },
    "tomato spider mites two-spotted spider mite": {
        "label": "Spider Mites Two-Spotted Spider Mite",
        "crop": "Tomato",
        "healthy": false,
        "description": "Fine yellow stippling with delicate webbing underneath. A sap-sucking pest, worst in hot dry weather.",
        "treatment": [
            "Spray neem oil, covering leaf undersides",
            "Use a miticide if heavy, rotating actives",
            "Hose leaf undersides to knock mites back"
        ],
        "prevention": [
            "Avoid dusty conditions",
            "Keep soil moisture adequate",
            "Protect natural predators"
        ]
    },
    "tomato target spot": {
        "label": "Target Spot",
        "crop": "Tomato",
        "healthy": false,
        "description": "Brown lesions with concentric rings and a lighter centre on leaves, stems and fruit.",
        "treatment": [
            "Apply a labelled fungicide",
            "Remove infected leaves and fruit",
            "Prune for airflow"
        ],
        "prevention": [
            "Rotate crops and clear debris",
            "Avoid prolonged leaf wetness",
            "Space plants to dry quickly"
        ]
    },
    "tomato tomato mosaic virus": {
        "label": "Tomato Mosaic Virus",
        "crop": "Tomato",
        "healthy": false,
        "description": "Mottled light and dark green patches, sometimes with distortion. Spreads by handling and on tools.",
        "treatment": [
            "Remove and destroy infected plants - there is no chemical cure",
            "Disinfect hands and tools after handling",
            "Avoid tobacco use near the crop"
        ],
        "prevention": [
            "Use certified virus-free seed",
            "Disinfect stakes and trays between seasons",
            "Limit handling when wet"
        ]
    },
    "tomato tomato yellow leaf curl virus": {
        "label": "Tomato Yellow Leaf Curl Virus",
        "crop": "Tomato",
        "healthy": false,
        "description": "Upward-curling leaves with yellow margins, stunting and flower drop. Spread by whitefly; no cure once infected.",
        "treatment": [
            "Remove and destroy infected plants promptly",
            "Control whitefly with traps and appropriate insecticide",
            "Target the vector, not the virus"
        ],
        "prevention": [
            "Use resistant varieties",
            "Protect nurseries with insect-proof netting",
            "Control host weeds"
        ]
    }
};

// Crops the model was actually trained on.
const SUPPORTED_CROPS = ["Apple", "Blueberry", "Cherry", "Cotton", "Grape", "Maize", "Orange", "Peach", "Pepper", "Potato", "Raspberry", "Rice", "Soybean", "Squash", "Strawberry", "Tomato"];

module.exports = { DISEASE_INFO, SUPPORTED_CROPS };
