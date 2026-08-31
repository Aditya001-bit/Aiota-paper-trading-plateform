const mongoose = require("mongoose");
const schema = new mongoose.Schema({ instrument: { type: mongoose.Schema.Types.ObjectId, ref: "Instrument", required: true, index: true }, pricePaise: { type: Number, required: true, min: 1 }, source: { type: String, required: true } }, { timestamps: true });
schema.index({ instrument: 1, createdAt: -1 });
module.exports = mongoose.model("PriceSnapshot", schema);
