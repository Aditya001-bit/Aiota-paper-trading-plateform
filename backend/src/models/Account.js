const mongoose = require("mongoose");
module.exports = mongoose.model("Account", new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true }, openingCashPaise: { type: Number, required: true, min: 0 }, availableCashPaise: { type: Number, required: true, min: 0 } }, { timestamps: true }));
