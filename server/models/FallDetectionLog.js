const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FallDetectionLogSchema = new Schema({
    firebaseId: { type: String, required: true, unique: true },
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    fall_time: { type: Date,required:true },
    message: { type: String, required: true },
    severity: { type: String, required: true }
}, {
    collection: 'fallDatazz'
});

module.exports = mongoose.model('FallDetectionLog', FallDetectionLogSchema);
