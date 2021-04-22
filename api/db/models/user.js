const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phoneNumber: String,
  card: Number,
  lastName: String,
  name: String,
  dateOfBirth: Number,
  dateOfStart: Number,
  position: String,
  refreshToken : String,
  teamLead : Boolean,
  fcmToken : String,
  platform : String,
  avatar: String
});

module.exports = {
  userDBModel: mongoose.model("User", userSchema),
};
