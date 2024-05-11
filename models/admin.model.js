require('dotenv')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const constants = require('../helpers/constants');
const { v4: uuidv4 } = require('uuid');
// const { listAccordingToUserWithPopulate } = require('../helpers/modelHelper');
// const {customAlphabet} = require('nanoid')
// const {versoCardColors, kycStatus, language} = require("../helpers/constants")
const {
    SUPERADMIN,
    ADMIN,
} = constants.adminRole

const {
    INACTIVE,
    ACTIVE,
    VERIFICATION_PENDING,
    VERIFICATION_FAILED,
} = constants.userStatus


let Admin = new Schema({
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
    identityProof: {
        front: {
            type: String,
            default: null
        },
        back: {
            type: String,
            default: null
        }
    },
    identityType:{
        type: Number,
        enum: Object.keys(constants.identityTypes),
        default: null
    },
    documents:[{
        type: String,
        default: null
    }],
    location: {
        street: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        zipCode: {
            type: String,
            default: null
        },
    },

    status: {
        type: Number,
        enum: [
            INACTIVE,
            ACTIVE,
            VERIFICATION_PENDING,
            VERIFICATION_FAILED
        ],
        default: ACTIVE,
    },
    role: {
        type: Number,
        enum: [
            ADMIN,
            SUPERADMIN
        ],
        default: ADMIN,
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

    ssn:{
        type: String,
        default: null
    },

}, {
    timestamps: true
});

const secret = process.env.JWT_SECRET;

// Define the generateToken method in UserModel schema
Admin.methods.generateToken = async function () {
    const admin = this;
    const access = "auth";
    const token = jwt.sign({
        _id: admin._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 Days
    }, secret);

    admin.tokens.push({
        access,
        token
    });

    await admin.save();
    return admin;
};


Admin.statics.refreshToken = function (admin) {
    const access = "auth";
    const token = jwt.sign({
        _id: admin._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), /// 30 Days
    }, secret).toString();

    admin.tokens = [{
        access,
        token
    }];

    return this.findByIdAndUpdate(admin._id, admin);
};

Admin.statics.findByToken = function (token) {
    const admin = this;
    // try {
    const decoded = jwt.verify(token, secret);
    return admin.findOne({
        "_id": decoded._id,
        "tokens.token": token,
    });
    // } catch (e) {
    //     console.log(e)
    //     throw new Error(e);
    //     // return Promise.reject(e);
    // }

};

// admin.statics.list = listAccordingToUserWithPopulate

module.exports = mongoose.model("Admin", Admin);