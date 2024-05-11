const express = require("express");
const Route = express.Router();


/* Controllers */
const UserController = require("../controllers/api/user/user");
/* End Controllers */
/* Api Auth User Route*/
Route.get("/users", UserController.getUserList);

Route.post("/add-user",UserController.validateAddUser(),  UserController.postAddUser);

/* End Admin Auth Routes */
module.exports = Route;