const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./api/routes/auth");
const resendCodeRoutes = require("./api/routes/resendCode");
const refreshTokenRoutes = require("./api/routes/refreshToken");
const verifyRoutes = require("./api/routes/verify");
const userRoutes = require("./api/routes/user");
const vacationsRoutes = require("./api/routes/vacations");
const eventsRoutes = require("./api/routes/events");
const eventRoutes = require("./api/routes/event");
const projectsRoutes = require("./api/routes/projects");
const projectRoutes = require("./api/routes/project");
const positionsRoutes = require("./api/routes/positions");
const workersRoutes = require("./api/routes/workers");
const workerRoutes = require("./api/routes/worker");
const discountsRoutes = require("./api/routes/discounts");

const app = express();
require("dotenv").config();

mongoose.connect(
    "mongodb+srv://Liubomyr:" +
    process.env.MONGO_ATLAS_CLASTER_PASSWORD +
    "@cluster0.dl5pc.mongodb.net/LuboTestServerDB?retryWrites=true&w=majority"
);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept, Authorization"
    );
    next();
});

app.use("/auth", authRoutes);
app.use("/resendCode", resendCodeRoutes);
app.use("/refresh", refreshTokenRoutes);
app.use("/verifyCode", verifyRoutes);
app.use("/profile", userRoutes);
app.use("/vacations", vacationsRoutes);
app.use("/events", eventsRoutes);
app.use("/event", eventRoutes);
app.use("/projects", projectsRoutes);
app.use("/project", projectRoutes);
app.use("/positions", positionsRoutes);
app.use("/workers", workersRoutes);
app.use("/worker", workerRoutes);
app.use("/discounts", discountsRoutes);


module.exports = {
    application: app,
};
