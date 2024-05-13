require('dotenv')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const constants = require('../helpers/constants');
// const Employee = require('models/employee .model.js');

const {
    INACTIVE,
    ACTIVE,
    VERIFICATION_PENDING,
    VERIFICATION_FAILED,
} = constants.userStatus
let EmployeeSalary = new Schema({
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
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
    net_pay: {
        type: String,
        default: null
    },
    total_detuction: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },

    basic_salary: {
        type: String,
        default: null
    },


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

}, {
    timestamps: true
});

module.exports = mongoose.model("EmployeeSalary", EmployeeSalary);