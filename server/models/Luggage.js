const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LuggageSchema = new Schema({
    luggage_tag_number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    luggage_custom_name: { 
        type: String, 
        default: null 
    },
    latitude: { 
        type: Number, 
        //required: true, 
        default: null,
        //hme default: 14.473052991282165,
        //default: 14.5268427
    },
    longitude: { 
        type: Number, 
        //required: true, 
        default: null,
        // hme default: 121.02543655162846,
        //default: 121.0235876
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['In Range', 'Out of Range', 'Out of Coverage'], 
        default: 'In Range' 
    },
    user_id: { 
        type: ObjectId, 
        ref: 'User', 
        required: true 
    },
    stationary_since: { 
        type: Date, 
        default: Date.now 
    },
    currentLocation: { 
        type: String, 
    },
    updatedAt: {  
        type: Date,
        default: null,
        required: true, // 
    }
}, {
    collection: 'luggage',
    timestamps: true 
});


LuggageSchema.index({ luggage_tag_number: 1 });
LuggageSchema.index({ user_id: 1 });

module.exports = mongoose.model('Luggage', LuggageSchema);
