const _ = require("lodash");
const mongoose = require("mongoose");
const {
    check,
    validationResult,
    body,
} = require("express-validator");
const bodyValidator = require("express-validator").body;
const Helper = require("../../../helpers/helper");
const { userStatus } = require('../../../helpers/constants');
const bcrypt = require('bcrypt');

/* Models*/
const UserModel = require('../../../models/employee .model');
const AdminModel = require('../../../models/admin.model')
/* End Models*/


class User {

    async getUserList(req, res) {
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()){
            //     console.log("errors",errors.array())
            //     return Helper.getValidationErrorMessage([req, res], errors.array());

            // }
    
            const users = await UserModel.find({});
            console.log(users.length)
    
            return Helper.getSuccessMessage([req, res], users);
        } catch (error) {

            return Helper.getErrorMessage([req, res], error);
        }
    }


    validateAddUser() {
        return [
            bodyValidator(["phone"]).exists()
            .custom(async (value, { req }) => {
                const user = await UserModel.findOne({
                    phone: value
                });
                if (user) {
                    throw new Error("mobile_already_registered");
                }
            }),
            bodyValidator(["email"]).exists().isEmail().
            custom(async (value, { req }) => {
                const user = await UserModel.findOne({
                    email: value
                });
                if (user ) {
                    throw new Error("email_already_registered")
                }
            }),
            bodyValidator(['firstName']).exists(),
            bodyValidator(['lastName']).exists(),
            bodyValidator(['password']).exists().isLength({ min: 6 }),

        ];
    }
    async postAddUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                console.log("errors",errors.array())
                return Helper.getValidationErrorMessage([req, res], errors.array());

            }
    

            const body = _.pick(req.body, [
                "phone", "email", "avatar", "firstName", "lastName", "password", "location",
                "identityProof", "documents", "pin", "dob", "versoCardColor", "selfie"
            ]);
    
            body.password = Helper.hashString(body.password);
            body.status = userStatus.VERIFICATION_PENDING;
    
            // const checkUser = await UserModel.findOne({ phone: body.phone });
            const user = await (await new UserModel(body).save()).generateToken();
    
            return Helper.getSuccessMessage([req, res], user);
        } catch (error) {

            return Helper.getErrorMessage([req, res], error);
        }
    }
    

}

module.exports = new User();