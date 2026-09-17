const mongoose = require('mongoose');

// A daily record of what we fetched from Agmarknet, so price trends can be
// computed from real observed change instead of being invented.
const PriceSnapshotSchema = new mongoose.Schema({
    commodity: { type: String, required: true, index: true },
    state: { type: String, default: null },
    arrivalDate: { type: String, required: true }, // dd/mm/yyyy as returned by the API
    avgModalPrice: Number,
    minPrice: Number,
    maxPrice: Number,
    marketCount: Number
}, { timestamps: true });

PriceSnapshotSchema.index({ commodity: 1, state: 1, arrivalDate: 1 }, { unique: true });

module.exports = mongoose.model('PriceSnapshot', PriceSnapshotSchema);
