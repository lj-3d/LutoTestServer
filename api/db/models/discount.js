const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    image: String,
    link: String,
    discount: String,
    lat: Number,
    lon: Number
});

module.exports = {
    discountDBModel: mongoose.model("discount", discountSchema),
};
