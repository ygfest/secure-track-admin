const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FallDetectionLogSchema = new Schema({
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    fall_time: { type: Date, default: Date.now },
    message: { type: String, required: true },
    severity: { type: String, required: true }
}, {
    collection: 'sensor_data'
});

module.exports = mongoose.model('FallDetectionLog', FallDetectionLogSchema);
