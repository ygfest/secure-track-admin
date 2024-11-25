const mongoose = require("mongoose");
const fs = require("fs");
const { timeStamp } = require("console");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TempLogSchema = new Schema(
  {
    firebaseId: { type: String, required: true, unique: true },
    luggage_tag_number: { type: String, ref: "Luggage", required: true },
    temperature: { type: Number },
    timeStamp: { type: Date, required:true },
  },
  {
    collection: "tempLogzzz",
  }
);

module.exports = mongoose.model("TempLog", TempLogSchema);
