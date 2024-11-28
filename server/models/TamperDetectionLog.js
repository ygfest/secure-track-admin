const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TamperDetectionLogSchema = new Schema({
    firebaseId: { type: String, required: true, unique: true },
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    alert: {type: String},
    tamperTime: { type: Date, required:true, },
}, {
    collection: 'tamperDatas'
});

module.exports = mongoose.model('TamperDetectionLog', TamperDetectionLogSchema);
