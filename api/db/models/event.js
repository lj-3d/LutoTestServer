const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  link: String,
  name: Number,
  description: String,
  date: Number,
  image: String
});

module.exports = {
  eventDBModel: mongoose.model("event", eventSchema),
};
