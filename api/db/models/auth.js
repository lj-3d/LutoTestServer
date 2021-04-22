const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phoneNumber: String,
  smsCodes: [
    {
      type: String,
    },
  ],
});

module.exports = {
  authDBModel: mongoose.model("Auth", authSchema),
};
