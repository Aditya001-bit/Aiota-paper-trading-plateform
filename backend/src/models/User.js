const mongoose = require("mongoose");
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 }, email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, passwordHash: { type: String, required: true, select: false } }, { timestamps: true });
schema.methods.toPublic = function toPublic() { return { id: this.id, name: this.name, email: this.email, createdAt: this.createdAt }; };
module.exports = mongoose.model("User", schema);
