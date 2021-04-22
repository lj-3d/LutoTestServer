const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    image: String,
    members: [
        {
            type: String,
        }
    ]
});

module.exports = {
    projectDBModel: mongoose.model("project", projectSchema),
};
