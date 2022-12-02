const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require("../../middleware/checkAdmin")
const checkAdmin = require("../../middleware/checkAdmin")
const adminController = require("../../controllers/admin/manageAdmin")
const router = express.Router();

//admin signup api
router.post("/signup", checkAuth, checkAdmin, adminController.adminSignUp);

  module.exports = router

