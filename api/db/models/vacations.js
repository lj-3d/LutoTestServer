const mongoose = require("mongoose");

const vacationsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: Object,
    vacation: {
        available: Number,
        used: Number
    },
    sickLeave: {
        available: Number,
        used: Number
    },
    remotes: {
        available: Number,
        used: Number
    }
});

module.exports = {
    vacationsDBModel: mongoose.model("Vacations", vacationsSchema)
};