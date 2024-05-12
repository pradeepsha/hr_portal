const _ = require("lodash");
const mongoose = require("mongoose");
const {
    check,
    validationResult,
    body,
} = require("express-validator");
const bodyValidator = require("express-validator").body;
const Helper = require("../../helpers/helper");
const { userStatus } = require('../../helpers/constants');
const bcrypt = require('bcrypt');

/* Models*/
const EmployeeModel = require('../../models/employee .model');
const AdminModel = require('../../models/admin.model')
/* End Models*/


class Auth {

    validateEmployeeLogin() {
        return [
            bodyValidator(["email"]).exists().custom(async (value, { req }) => {
                const employee = await EmployeeModel.findOne({
                    email: value
                });
                if (!employee) {
                    throw new Error("email_not_found")
                }

                if (!employee.password) {
                    throw new Error("password_is_not_set_yet");
                }
            }),
            bodyValidator(["password"]).exists(),
        ];
    }

    async postLogin(req,res){

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return Helper.getValidationErrorMessage([req, res], errors.array());
            }
            const body = _.pick(req.body, [ "email",  "password"]);

            const employee = await EmployeeModel.findOne({ email: body.email });

            const match = bcrypt.compareSync(body.password, employee.password);
            if (!match) {
                throw new Error("invalid_credentials")
            }
    
            return Helper.getSuccessMessage([req, res], employee);

        } catch (error) {
            console.log("error",error)
            return Helper.getErrorMessage([req, res], error.message);
       }
    }


    validateEmployeeSignUp() {
        return [
            bodyValidator(["phone"]).exists().isMobilePhone()
            .custom(async (value, { req }) => {
                const emploee = await EmployeeModel.findOne({
                    phone: value
                });

                if (emploee && emploee.password ) {
                    throw new Error(("phone_number_already_registered"))
                }
            }),
            bodyValidator(["email"]).exists().isEmail().
            custom(async (value, { req }) => {
                const employee = await EmployeeModel.findOne({
                    email: value
                });
                if (employee && employee.password) {
                    throw new Error(("email_already_registered"))
                }

            }).normalizeEmail(),
            bodyValidator(['firstName']).exists(),
            bodyValidator(['password']).exists()

        ];
    }
    async postEmployeeSignUp(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return Helper.getValidationErrorMessage([req, res], errors.array());
            }
    

            const body = _.pick(req.body, [
                "phone", "email", "avatar", "firstName", "lastName", "password",
                "documents", "salaryDetails",
            ]);
    
            body.password = Helper.hashString(body.password);
            body.status = userStatus.VERIFICATION_PENDING;
    
            const checkUser = await EmployeeModel.findOne({ email: body.email });
            const user = checkUser ?
                await EmployeeModel.findByIdAndUpdate(checkUser._id, body, { new: true }):
                await (await new EmployeeModel(body).save()).generateToken();
    
            return Helper.getSuccessMessage([req, res], user);
        } catch (error) {

            return Helper.getErrorMessage([req, res], error.message);
        }
    }
    

    validateAdminLogin() {
        return [
            bodyValidator(["email"]).exists().custom(async (value, { req }) => {
                const admin = await AdminModel.findOne({
                    email: value
                });
                if (!admin) {
                    throw new Error("email_not_found")
                }

                if (!admin.password) {
                    throw new Error("password_is_not_set_yet");
                }
            }),
            bodyValidator(["password"]).exists(),
        ];
    }

    async postAdminLogin(req, res) {


        // const session = req.dbSession;
        try {
            const body = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.getValidationErrorMessage([req, res], errors.array());
            }
            const admin = await AdminModel.findOne({
                email: body.email
            });
            const match = bcrypt.compareSync(body.password, admin.password);
            if (!match) {
                throw new Error("invalid_credentials")
            }
            try {
                await AdminModel.findByToken(admin.tokens[0].token);
            } catch (e) {
                if (e.message === 'jwt expired') {
                    await AdminModel.refreshToken(admin)
                }
            }

            const resultUser = admin.toObject()

            return Helper.getSuccessMessage([req, res], resultUser);
        } catch (e) {
            // console.log(e)
            return Helper.getValidationErrorMessage([req, res], e.message);
        }
    }

    validateAdminRegister() {
        return [
            bodyValidator(["phone"]).exists().isMobilePhone()
            .custom(async (value, { req }) => {
                // const user = await UserModel.findOne({
                //     phone: value
                // });
                // if (!user) {
                //     throw new Error(req.t("please_registered_mobile_first"));
                // }
                // if (!user.isOtpVerified) {
                //     throw new Error(req.t("otp_is_not_verified"));
                // }
                // if (user.password) {
                //     throw new Error(req.t("phone_number_already_registered"))
                // }
            }),
            bodyValidator(["email"]).exists().isEmail(),
            // custom(async (value, { req }) => {
            //     const user = await UserModel.findOne({
            //         email: value
            //     });
            //     if (user && user.password) {
            //         throw new Error(req.t("email_already_registered"))
            //     }
            //     return true;
            // }).normalizeEmail(),
            bodyValidator(['firstName']).exists(),
            bodyValidator(['lastName']).exists(),
            bodyValidator(['password']).exists().isLength({ min: 6 }),

        ];
    }
    async postAdminRegister(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                console.log("errors",errors.array())
                return Helper.getValidationErrorMessage([req, res], errors.array());

            }
    

            const body = _.pick(req.body, [
                "phone", "email", "avatar", "firstName", "lastName", "password", "location",
            ]);
    
            body.password = Helper.hashString(body.password);
            
    
            const checkUser = await AdminModel.findOne({ phone: body.phone });
            const user = checkUser ?
                await AdminModel.findByIdAndUpdate(checkUser._id, body, { new: true }):
                await (await new AdminModel(body).save()).generateToken();
    
            return Helper.getSuccessMessage([req, res], user);
        } catch (error) {

            return Helper.getErrorMessage([req, res], error);
        }
    }

}

module.exports = new Auth();