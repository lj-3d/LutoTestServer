const jwt = require("jsonwebtoken");
const fs = require('fs');
require("dotenv").config();

function getRandom6Digits() {
    return Math.floor(100000 + Math.random() * 900000);
}

function getRandom4Digits() {
    return Math.floor(1000 + Math.random() * 9000);
}

function generateToken(phoneNumber) {
    return jwt.sign(
        {
            phoneNumber: phoneNumber,
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1h",
        }
    );
}

function generateRefreshToken(phoneNumber) {
    return jwt.sign(
        {
            phoneNumber: phoneNumber,
        },
        process.env.JWRT_KEY,
        {
            expiresIn: "1w",
        }
    );
}

function hasObjectAllRequiredFields(dbModel, fieldsArray) {
    const object = dbModel._doc;
    const fields = Object.keys(object);
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const requiredField = fieldsArray.find(element => element === field) || null;
        if (requiredField === null) {
            continue;
        }
        if (!object.hasOwnProperty(requiredField)) {
            return false;
        }
    }
    return true;
}

function transformObjects(objectFrom, excludeFields = []) {
    const mappedObject = new Map(Object.entries({}));
    const objectFromEntities = Object.entries(objectFrom);
    console.log(`size ${excludeFields.length}`);
    objectFromEntities.forEach(entity => {
        if (excludeFields.length > 0) {
            const excludedField = excludeFields.find(element => element === entity[0]);
            if (!(excludedField in objectFrom)) {
                mappedObject.set(entity[0], entity[1]);
            }
        } else {
            mappedObject.set(entity[0], entity[1]);
        }
    });
    return Object.fromEntries(mappedObject);
}

function transformToDBModel(req, extraOptions = null) {
    const body = req.body;
    const mappedObject = new Map(Object.entries({}));
    const objectFromRequest = Object.entries(body);
    objectFromRequest.forEach(entity => {
        if (entity[0] !== undefined) {
            mappedObject.set(entity[0], entity[1]);
        }
    });
    if (extraOptions !== null) {
        extraOptions(mappedObject);
        console.log(mappedObject);
    }
    return Object.fromEntries(mappedObject);
}

function getPaginationOptions(req) {
    let paginationOptions;
    if (typeof req.query.page !== 'undefined' && typeof req.query.limit !== 'undefined') {
        let page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        if (page <= 1) {
            paginationOptions = {
                limit: limit
            }
        } else {
            paginationOptions = {
                skip: limit * page,
                limit: limit
            }
        }
    } else {
        paginationOptions = null;
    }
    return paginationOptions;
}

module.exports = {
    generateSmsCode: getRandom6Digits,
    generateUserCode: getRandom4Digits,
    generateToken: generateToken,
    generateRefreshToken: generateRefreshToken,
    hasObjectAllRequiredFields: hasObjectAllRequiredFields,
    transformObjects: transformObjects,
    transformToDBModel: transformToDBModel,
    getPaginationOptions: getPaginationOptions
};
