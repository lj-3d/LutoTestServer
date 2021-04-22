const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
});

module.exports = {
    positionDBModel: mongoose.model("position", positionSchema),
};
