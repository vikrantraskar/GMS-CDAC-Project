const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require("../../middleware/checkAuth");
const checkAdmin = require("../../middleware/checkAdmin");
const adminController = require('../../controllers/admin/manageShifts')

const router = express.Router();

// add new shifts
router.post(`/addShift`, checkAuth, checkAdmin, adminController.addNewShifts);

// update specific shifts
router.put("/updateSpecificShift/:shift_id", checkAuth, checkAdmin, adminController.updateSpecificShifts);

// remove specific shifts
router.delete("/deleteSpecificShift/:shift_id", checkAuth, checkAdmin, adminController.removeSpecificShifts);

module.exports = router;
