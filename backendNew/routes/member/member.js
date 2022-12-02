const express = require("express");
const checkAuth = require('../../middleware/checkAuth')
const checkMember = require('../../middleware/checkMember')
const memberController = require('../../controllers/member/members')
const router = express.Router();





//update profile
router.post("/updateProfile", checkAuth, checkMember, memberController.updateProfile);

// update password
router.post("/updatePassword",  checkAuth, checkMember, memberController.updatePassword);

//apply for membership-payment api
router.post("/membership", checkAuth, checkMember, memberController.applyMembershipPayment);


//add package api
router.post("/addPackage", checkAuth, checkMember, memberController.addPackage);


//getMemberTransactions api
router.get("/transactions", checkAuth, checkMember, memberController.getMemberTransactions)


//getMemberBillingstatus api
router.get("/getBillStatus", checkAuth, checkMember, memberController.getMemberBillingsStatus)


//getMemberPackages api
router.get("/memberPackages", checkAuth, checkMember, memberController.getMemberPackages)


//pay dues api
router.post("/payDue", checkAuth, checkMember, memberController.payDues)


//getDietPlan api
router.get("/dietPlan", checkAuth, checkMember, memberController.getDietPlan)

//get my trainer if PT porgram taken
router.get('/getMyTrainer', checkAuth, checkMember, memberController.getMyTrainer)


// Select shift api
router.post('/selectShift', checkAuth, checkMember, memberController.selectShift)


//getmemberspecificworkoutPlan api
router.get("/specificWorkoutPlan", checkAuth, checkMember, memberController.getMyWorkoutPlan);


//get bmireport
router.get('/getBmiReport', checkAuth, checkMember, memberController.getMyBmiReport);

//get my shift
router.get('/getMyShift', checkAuth, checkMember, memberController.getMyShift);

//giveFeedback
router.post('/giveFeedback', checkAuth, checkMember, memberController.giveFeedback);

// renewal
// router.post('/renewP/:id', checkAuth, checkMember, memberController)

module.exports = router;
