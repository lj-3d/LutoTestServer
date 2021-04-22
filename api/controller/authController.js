const mongoose = require("mongoose");
const bot = require("../utils/telegram-bot");
const tools = require("../utils/tools");
const httpCodes = require("../http_codes");
const phoneUtils = require("../utils/phoneFormatterUtil");

const AuthDBModel = require("../db/models/auth").authDBModel;
const AuthResponse = require("../response/models/auth").AuthResponse;
const ErrorResponse = require("../response/models/default").ErrorResponse;

module.exports = (req, res, next) => {
    const phoneNumber = phoneUtils.validateAndGetFormattedPhoneNumber(req, res);
    AuthDBModel.findOne()
        .where("phoneNumber")
        .equals(phoneNumber)
        .exec()
        .then((doc) => {
            if (doc === null) {
                const smsCode = tools.generateSmsCode();
                const smsCodesCreated = [smsCode];
                const authModel = new AuthDBModel({
                    _id: new mongoose.Types.ObjectId(),
                    phoneNumber: phoneNumber,
                    smsCodes: smsCodesCreated,
                });
                authModel
                    .save()
                    .then((result) => {
                        bot.sendMessage(phoneNumber, smsCode);
                        const response = new AuthResponse(
                            60,
                            `Message with code was sent to number ${phoneNumber}`
                        );
                        res.status(httpCodes.OK).json(response);
                    })
                    .catch((error) => {
                        const response = new ErrorResponse(error);
                        res.status(httpCodes.InternalServerError).json(response);
                    });
            } else {
                let smsCode;
                if (doc.smsCodes.length === 3) {
                    const response = new AuthResponse(
                        0,
                        `Use your last code you've receiver to number ${doc.phoneNumber}`
                    );
                    res.status(httpCodes.OK).json(response);
                } else {
                    smsCode = tools.generateSmsCode();
                    const smsCodesUpdated = Array.from(doc.smsCodes);
                    smsCodesUpdated.push(smsCode);
                    AuthDBModel.updateOne(
                        {phoneNumber: doc.phoneNumber},
                        {
                            $push: {
                                smsCodes: [smsCode],
                            },
                        }
                    )
                        .then((result) => {
                            bot.sendMessage(phoneNumber, smsCode);
                            console.log(`Update result ${result.smsCodes}`);
                            const response = new AuthResponse(
                                60,
                                `Message with code was sent to number ${doc.phoneNumber}`
                            );
                            res.status(httpCodes.OK).json(response);
                        })
                        .catch((error) => {
                            console.log(`Update error ${error}`);
                            res.status(httpCodes.Unauthorized).json({
                                message: error,
                            });
                        });
                }
            }
        })
        .catch((error) => {
            const response = new ErrorResponse(error);
            res.status(httpCodes.InternalServerError).json(response);
        });
}