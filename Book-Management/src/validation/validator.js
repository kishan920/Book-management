const mongoose = require("mongoose")
const moment = require('moment')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title.trim()) !== -1
}

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email.trim())
};
const validatePassword = function (password) {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    return re.test(password.trim())
};


const validateISBN = function (ISBN) {
   
    var re = /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;   
    return re.test(ISBN.trim())
};


const validatePhone = function (phone) {
    var re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (typeof (phone) == 'string') {
        return re.test(phone.trim())
    } else {
        return re.test(phone)
    }
};

const validateRating = function (rating) {
    var re = /^[1-5](\[1-5][1-5]?)?$/;
    if (typeof (rating) == 'string') {
        return re.test(rating.trim())
    } else {
        return re.test(rating)
    }
};

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const validString = function (value) {
    if (typeof value !== 'string') return false
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
}

const isValidDate = function (value) {
    const validFormats = [
        "DD/MM/YYYY",
        "MM/DD/YYYY",
        "YYYY/MM/DD",
        "DD-MM-YYYY",
        "MM-DD-YYYY",
        "YYYY-MM-DD",
    ]
    return moment(value, validFormats, true).isValid()
}


module.exports = {
    isValid, isValidRequestBody, validateEmail, isValidTitle, isValidObjectId,
    validatePassword, validatePhone, validateISBN, validateRating, isValidDate,validString
}
