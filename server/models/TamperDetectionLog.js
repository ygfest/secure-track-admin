const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TamperDetectionLogSchema = new Schema({
    firebaseId: { type: String, required: true, unique: true },
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    impact: {type: String},
    impactTime: { type: Date, required:true, },
}, {
    collection: 'impactdatas'
});

module.exports = mongoose.model('TamperDetectionLog', TamperDetectionLogSchema);
