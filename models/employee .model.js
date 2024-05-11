require('dotenv')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const constants = require('../helpers/constants');

const {
    INACTIVE,
    ACTIVE,
    VERIFICATION_PENDING,
    VERIFICATION_FAILED,
} = constants.userStatus
let Employee = new Schema({
    firstName: {
        type: String,
        index: true,
        default: null
    },
    lastName: {
        type: String,
        index: true,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    pin: {
        type: String,
        default: null
    },
    dob:{
        type: String,
        default: null
    },
    countryCode: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: [true, 'Phone number must be unique'],
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordAt: {
        type: Date,
        default: new Date().toISOString()
    },
    resetPasswordTokenVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String,
        default: null
    },
    emailOtpGeneratedAt: {
        type: Date,
        default: new Date().toISOString()
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpGeneratedAt: {
        type: Date,
        default: new Date().toISOString()
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    documents:[{
        type: String,
        default: null
    }],

    status: {
        type: Number,
        enum: [
            INACTIVE,
            ACTIVE,
            VERIFICATION_PENDING,
            VERIFICATION_FAILED
        ],
        default: INACTIVE,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],

    salaryDetails: {
        salary: Number,
        deductions: [
            {
                name: String,  // Deduction name (e.g., "Tax", "Insurance", etc.)
                amount: Number // Deduction amount
            }
            // More deduction objects if needed
        ]
    }

}, {
    timestamps: true
});

const secret = process.env.JWT_SECRET;

// Define the generateToken method in UserModel schema
Employee.methods.generateToken = async function () {
    const employee = this;
    const access = "auth";
    const token = jwt.sign({
        _id: employee._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 Days
    }, secret);

    employee.tokens.push({
        access,
        token
    });

    await employee.save();
    return employee;
};


Employee.statics.refreshToken = function (user) {
    const access = "auth";
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), /// 30 Days
    }, secret).toString();

    user.tokens = [{
        access,
        token
    }];

    return this.findByIdAndUpdate(user._id, user);
};

Employee.statics.findByToken = function (token) {
    const employee = this;
    // try {
    const decoded = jwt.verify(token, secret);
    return employee.findOne({
        "_id": decoded._id,
        "tokens.token": token,
    });

};

// Employee.statics.list = listAccordingToEmployeeWithPopulate

module.exports = mongoose.model("Employee", Employee);