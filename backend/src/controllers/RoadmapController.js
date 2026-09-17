// Ported from the former Supabase edge function (frontend/src/supabase/functions/server/index.tsx)
// so the roadmap works with the same Firebase auth the rest of the app already uses.
const ROADMAP_TEMPLATES = {
    'Rice': [
        { week: 1, task: 'Land Preparation', description: 'Plough the field 2-3 times, level the land', status: 'pending' },
        { week: 2, task: 'Seed Selection & Treatment', description: 'Select healthy seeds, treat with fungicide', status: 'pending' },
        { week: 3, task: 'Sowing/Transplanting', description: 'Transplant 20-25 day old seedlings', status: 'pending' },
        { week: 5, task: 'First Irrigation', description: 'Maintain 5cm water level', status: 'pending' },
        { week: 7, task: 'Fertilizer Application', description: 'Apply urea 25kg/acre', status: 'pending' },
        { week: 10, task: 'Pest Control', description: 'Monitor for stem borers, apply pesticide if needed', status: 'pending' },
        { week: 14, task: 'Second Fertilizer Dose', description: 'Apply DAP 20kg/acre', status: 'pending' },
        { week: 17, task: 'Harvest Preparation', description: 'Stop irrigation 10 days before harvest', status: 'pending' },
        { week: 18, task: 'Harvesting', description: 'Harvest when grains are golden yellow', status: 'pending' }
    ],
    'Wheat': [
        { week: 1, task: 'Land Preparation', description: 'Deep ploughing, add organic manure', status: 'pending' },
        { week: 2, task: 'Seed Treatment', description: 'Treat seeds with Trichoderma', status: 'pending' },
        { week: 3, task: 'Sowing', description: 'Line sowing at 20cm spacing', status: 'pending' },
        { week: 4, task: 'First Irrigation', description: 'Light irrigation after germination', status: 'pending' },
        { week: 6, task: 'Weed Control', description: 'Manual weeding or herbicide application', status: 'pending' },
        { week: 8, task: 'Fertilizer Application', description: 'Top dressing with urea', status: 'pending' },
        { week: 12, task: 'Disease Monitoring', description: 'Check for rust, apply fungicide if needed', status: 'pending' },
        { week: 16, task: 'Stop Irrigation', description: 'Last irrigation before harvest', status: 'pending' },
        { week: 19, task: 'Harvesting', description: 'Harvest when ears turn golden', status: 'pending' }
    ],
    'Tomato': [
        { week: 1, task: 'Nursery Preparation', description: 'Prepare nursery beds, sow seeds', status: 'pending' },
        { week: 3, task: 'Land Preparation', description: 'Plough field, make raised beds', status: 'pending' },
        { week: 4, task: 'Transplanting', description: 'Transplant 25-30 day seedlings', status: 'pending' },
        { week: 5, task: 'Staking', description: 'Provide bamboo/wooden stakes for support', status: 'pending' },
        { week: 6, task: 'First Fertilizer', description: 'Apply NPK 19:19:19', status: 'pending' },
        { week: 8, task: 'Pruning', description: 'Remove side shoots, maintain 1-2 stems', status: 'pending' },
        { week: 10, task: 'Disease Control', description: 'Spray for early blight prevention', status: 'pending' },
        { week: 11, task: 'Fruit Setting', description: 'Monitor flowering, ensure proper pollination', status: 'pending' },
        { week: 13, task: 'First Harvest', description: 'Pick fruits when fully red', status: 'pending' }
    ],
    'Cotton': [
        { week: 1, task: 'Land Preparation', description: 'Deep summer ploughing', status: 'pending' },
        { week: 2, task: 'Seed Treatment', description: 'Treat with fungicide and insecticide', status: 'pending' },
        { week: 3, task: 'Sowing', description: 'Sow seeds at 60x30cm spacing', status: 'pending' },
        { week: 5, task: 'Thinning', description: 'Maintain 1-2 plants per hill', status: 'pending' },
        { week: 7, task: 'First Fertilizer', description: 'Apply urea and DAP', status: 'pending' },
        { week: 10, task: 'Pest Control', description: 'Monitor for bollworms, apply IPM', status: 'pending' },
        { week: 14, task: 'Flowering Stage', description: 'Ensure adequate moisture', status: 'pending' },
        { week: 20, task: 'Boll Formation', description: 'Monitor boll development', status: 'pending' },
        { week: 26, task: 'Harvesting', description: 'Pick cotton when bolls open', status: 'pending' }
    ],
    'Potato': [
        { week: 1, task: 'Land Preparation', description: 'Deep ploughing, form ridges and furrows', status: 'pending' },
        { week: 1, task: 'Seed Tuber Treatment', description: 'Treat seed tubers with fungicide before planting', status: 'pending' },
        { week: 2, task: 'Planting', description: 'Plant tubers at 20cm spacing on ridges', status: 'pending' },
        { week: 4, task: 'Earthing Up', description: 'Mound soil around plants to protect developing tubers', status: 'pending' },
        { week: 5, task: 'First Fertilizer', description: 'Apply NPK as top dressing', status: 'pending' },
        { week: 7, task: 'Irrigation Management', description: 'Maintain consistent soil moisture during tuber bulking', status: 'pending' },
        { week: 9, task: 'Late Blight Watch', description: 'Monitor for late blight, spray fungicide if humid conditions persist', status: 'pending' },
        { week: 12, task: 'Haulm Cutting', description: 'Cut and remove foliage 10 days before harvest to firm up skins', status: 'pending' },
        { week: 13, task: 'Harvesting', description: 'Lift tubers once skins have set', status: 'pending' }
    ],
    'Maize': [
        { week: 1, task: 'Land Preparation', description: 'Plough and harrow to a fine tilth', status: 'pending' },
        { week: 1, task: 'Sowing', description: 'Sow seeds at 60x20cm spacing, 3-4cm depth', status: 'pending' },
        { week: 3, task: 'Thinning', description: 'Remove weak seedlings, retain one plant per hill', status: 'pending' },
        { week: 4, task: 'First Fertilizer', description: 'Apply urea as first top dressing', status: 'pending' },
        { week: 5, task: 'Weed Control', description: 'Inter-cultivate or apply herbicide to control weeds', status: 'pending' },
        { week: 7, task: 'Second Fertilizer', description: 'Apply second urea dose at knee-high stage', status: 'pending' },
        { week: 8, task: 'Tasseling Watch', description: 'Ensure adequate moisture during tasseling and silking', status: 'pending' },
        { week: 10, task: 'Pest Control', description: 'Monitor for fall armyworm, treat if damage is seen', status: 'pending' },
        { week: 14, task: 'Harvesting', description: 'Harvest when husks turn brown and kernels harden', status: 'pending' }
    ],
    'Sugarcane': [
        { week: 1, task: 'Land Preparation', description: 'Deep ploughing followed by furrow formation', status: 'pending' },
        { week: 1, task: 'Sett Treatment & Planting', description: 'Treat setts with fungicide, plant in furrows', status: 'pending' },
        { week: 4, task: 'First Irrigation', description: 'Light irrigation to aid germination', status: 'pending' },
        { week: 6, task: 'Gap Filling', description: 'Replace failed setts to maintain plant population', status: 'pending' },
        { week: 8, task: 'First Fertilizer', description: 'Apply nitrogen and potash as basal top dressing', status: 'pending' },
        { week: 12, task: 'Earthing Up', description: 'Mound soil at the base to support growing stalks', status: 'pending' },
        { week: 16, task: 'Second Fertilizer', description: 'Apply remaining nitrogen dose', status: 'pending' },
        { week: 24, task: 'Pest & Lodging Watch', description: 'Monitor for borers, tie canes to prevent lodging', status: 'pending' },
        { week: 52, task: 'Harvesting', description: 'Harvest at 11-12 months when sucrose content peaks', status: 'pending' }
    ]
};

const generateRoadmap = (req, res) => {
    const { cropName, landArea, startDate } = req.body;

    if (!cropName || !landArea || !startDate) {
        return res.status(400).json({ error: 'cropName, landArea and startDate are required' });
    }

    const template = ROADMAP_TEMPLATES[cropName];
    const usedFallback = !template;
    const tasks = template || ROADMAP_TEMPLATES['Tomato'];

    const roadmap = {
        cropName,
        landArea,
        startDate,
        totalWeeks: tasks[tasks.length - 1].week,
        tasks,
        usedFallbackTemplate: usedFallback
    };

    res.json({ roadmap });
};

module.exports = { generateRoadmap };
