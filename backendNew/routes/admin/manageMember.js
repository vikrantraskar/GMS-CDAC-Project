const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require("../../middleware/checkAuth");
const checkAdmin = require("../../middleware/checkAdmin");
const adminController = require('../../controllers/admin/manageMember')

const router = express.Router();


//assign trainer to member having PT 
router.post('/assignTrainer', checkAuth, checkAdmin, adminController.assignPersonalTrainer)

//get all members
router.get('/getAllMembers', checkAuth, checkAdmin, adminController.getAllMember)

//get all inactive members
router.get('/getAllInactiveMembers', checkAuth, checkAdmin, adminController.getAllInactiveMember)

// update shift of specific member
router.put('/updateMemberShift/:user_id', checkAuth, checkAdmin, adminController.updateShiftOfMember)


// remove specific member
router.delete('/deleteSpecificMember/:user_id', checkAuth, checkAdmin, adminController.removeSpecificMember)

// deactivate user
router.post('/deactivateUser/:id', checkAuth, checkAdmin, adminController.deactivateUser)

// activate user
router.post('/activateMember/:id', checkAuth, checkAdmin, adminController.activateMember)
  
//new api to get non-selected shifts by members
router.post("/nonSelectedShifts", checkAuth, checkAdmin, adminController.nonSelectedShifts);

module.exports = router