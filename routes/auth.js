const express = require("express");
const Route = express.Router();


/* Controllers */
const ApiAuth = require("../controllers/api/auth");
/* End Controllers */
/* Api Auth User Route*/
Route.post("/api/employee/login",ApiAuth.validateEmployeeLogin(), ApiAuth.postLogin);
Route.post("/api/employee/sign-up",ApiAuth.validateEmployeeSignUp(), ApiAuth.postEmployeeSignUp)

Route.post("/api/admin/login", ApiAuth.validateAdminLogin(),  ApiAuth.postAdminLogin);
Route.post("/api/admin/register",ApiAuth.validateAdminRegister(), ApiAuth.postAdminRegister)
/* End Admin Auth Routes */
module.exports = Route;
