const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    secret: { type: String, required: true }
});

module.exports = mongoose.model('Secret', secretSchema);
