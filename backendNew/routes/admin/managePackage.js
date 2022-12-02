const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require("../../middleware/checkAuth");
const checkAdmin = require("../../middleware/checkAdmin");
const adminController = require('../../controllers/admin/managePackage')

const router = express.Router();

// add new package
router.post(`/addPackage`, checkAuth, checkAdmin, adminController.addNewPackage);

// update specific package
router.put("/updateSpecificPackage/:package_id", checkAuth, checkAdmin, adminController.updateSpecificPackage);

// remove specific package
router.delete("/deleteSpecificPackage/:package_id", checkAuth, checkAdmin, adminController.removeSpecificPackage);

module.exports = router;
