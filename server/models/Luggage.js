const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LuggageSchema = new Schema({
    luggage_tag_number: { type: String },
    luggage_custom_name: { type: String, default: null },
    latitude: { type: Number },
    longitude: { type: Number },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['In Range', 'Out of Range', 'At Destination', 'Lost'], default: 'In Range' },
    user_id: { type: ObjectId, ref: 'User' }, // changed to ObjectId and referenced to the User model
    stationary_since: { type: Date, default: Date.now },
    destination: { type: String }
}, {
    collection: 'luggage'
});

module.exports = mongoose.model('Luggage', LuggageSchema);
