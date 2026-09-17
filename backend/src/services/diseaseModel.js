const path = require('path');
const fs = require('fs');
const axios = require('axios');

const MODEL_DIR = path.join(__dirname, '../../model');
const META_PATH = path.join(MODEL_DIR, 'model_meta.json');
const WORKER_URL = process.env.DISEASE_MODEL_URL || 'http://127.0.0.1:5001';

let meta = null;
let ready = false;
let loadError = null;

const isAvailable = () => ready;
const getMeta = () => meta;

/**
 * The model runs in a local Python worker (backend/ml/serve.py) because the
 * ONNX toolchain can't be installed on this machine. The worker binds to
 * localhost only - Express remains the sole authenticated entry point.
 */
const load = async () => {
    if (!fs.existsSync(META_PATH)) {
        loadError = 'model_meta.json not found. Train the model and copy it into backend/model/.';
        console.warn(`⚠️  Disease model unavailable: ${loadError}`);
        return false;
    }
    meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));

    try {
        const { data } = await axios.get(`${WORKER_URL}/health`, { timeout: 5000 });
        ready = data.status === 'ok';
        console.log(`✅ Disease model worker reachable (${data.classes} classes, test acc ${data.testAccuracy}).`);
        return ready;
    } catch (err) {
        loadError = `Inference worker not reachable at ${WORKER_URL}. Start it with: npm run model`;
        console.warn(`⚠️  Disease model unavailable: ${loadError}`);
        return false;
    }
};

const predict = async (imageBuffer) => {
    if (!ready) {
        // The worker may have started after the API; retry once before failing.
        const recovered = await load();
        if (!recovered) throw new Error(loadError || 'Disease model is not available');
    }

    const { data } = await axios.post(`${WORKER_URL}/predict`, imageBuffer, {
        headers: { 'Content-Type': 'application/octet-stream' },
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
    });
    return data;
};

module.exports = { load, predict, isAvailable, getMeta };
