const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const NotificationSchema = new Schema ({
  luggage_tag_number: {
    type: String,
    required: true,
    unique: true,
  },
  
})