const ErrorResponse = require("../response/models/default").ErrorResponse;
const httpCodes = require("../http_codes");

function validateAndGetFormattedPhoneNumber(req, res) {
    const phoneNumberParam = req.body.phoneNumber;
    if (phoneNumberParam === null || phoneNumberParam === undefined) {
        const response = new ErrorResponse('PhoneNumber is missing!!!');
        return res.status(httpCodes.Unauthorized).json(response);
    }
    const phoneNumber = formatPhoneNumber(phoneNumberParam);
    if (!validatePhoneNumber(phoneNumber)) {
        const response = new ErrorResponse('Invalid phoneNumber!!!');
        return res.status(httpCodes.BadRequest).json(response);
    }
    return phoneNumber;
}


function validatePhoneNumber(phoneNumber) {
    const operatorsRegex = "39|67|96|97|98|50|66|95|99|63|93|91|92|94";
    const regex = `^\\+?380\\d*(${operatorsRegex})\\d{7}`;
    return phoneNumber.match(regex);
}

function formatPhoneNumber(phoneNumber) {
    const spaces = new RegExp(" ", "g");
    const plus = new RegExp("^\\+", "g");
    return phoneNumber.replace(spaces, '').replace(plus, '');
}

module.exports = {
    validateAndGetFormattedPhoneNumber: validateAndGetFormattedPhoneNumber,
    validatePhoneNumber: validatePhoneNumber,
    formatPhoneNumber: formatPhoneNumber
};