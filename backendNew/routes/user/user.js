const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const userController = require("../../controllers/user/user");
const router = express.Router();

//member signup api
router.post("/signup", userController.signupMember);

//signin api
router.post("/signin", userController.signin);

// Get all package
router.get("/getAllPackages", userController.getAllPackages);

// Get all shifts
router.get("/getAllShifts", userController.getAllShifts);

//contactus api
router.post("/contactus", userController.contactus);

module.exports = router;
