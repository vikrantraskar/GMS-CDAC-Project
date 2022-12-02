const express = require("express");
const checkAuth = require('../../middleware/checkAuth')
const checkTrainer = require('../../middleware/checkTrainer')
const trainerController = require('../../controllers/trainer/trainer')

const router = express.Router();

//update profile
router.post("/updateProfile", checkAuth, checkTrainer, trainerController.updateProfile);

// update password
router.post("/updatePassword",  checkAuth, checkTrainer, trainerController.updatePassword);

//get diet_Item list
router.get('/getItemList', checkAuth, checkTrainer, trainerController.getDietItemList)

//add new diet item
router.post('/addItem', checkAuth, checkTrainer, trainerController.addDietItem)

//update specific diet item
router.post('/updateItem', checkAuth, checkTrainer, trainerController.updateDietItem)

//remove diet item
router.delete('/deleteItem', checkAuth, checkTrainer, trainerController.deleteDietItem)

//add diet plan for specific member who chooses personal training
router.post('/dietPlan', checkAuth, checkTrainer, trainerController.addDietPlan)

//get specific workout type by wType_id
router.get('/getwtype/:id', checkAuth, checkTrainer, trainerController.getSpecificWorkoutType)

//get all workout type 
router.get('/getAllwtype', checkAuth, checkTrainer, trainerController.getAllWorkoutType)

//update specific workout type  by wType_id         
router.put('/updatewtype/:wType_id', checkAuth, checkTrainer, trainerController.updateSpecificWorkoutType)

//add specific workout type 
router.post('/addwtype', checkAuth, checkTrainer, trainerController.addSpecificWorkoutType)

//delete workout type by wType_id
router.delete('/deletewtype/:id', checkAuth, checkTrainer, trainerController.deleteSpecificWorkoutType)

//getAll shift of specific trainer
router.get('/getmyshifts', checkAuth, checkTrainer, trainerController.getMyAllShifts);

//get all members of a specific trainer
router.get('/getmystudents', checkAuth, checkTrainer, trainerController.getMyStudents);

//add work plan for specific member who chooses personal training
router.post('/workoutPlan', checkAuth, checkTrainer, trainerController.addWorkoutPlan)
  
//addbmireport
router.post("/addBmiReport", checkAuth, checkTrainer, trainerController.addBmiReport);
  
//updatebmireport
router.post("/updateBmiReport", checkAuth, checkTrainer, trainerController.updateBmiReport)

//delete day workoutplan of specific user  by user_id 
router.post("/deleteDayWorkoutplanofSpecificMember/:user_id", checkAuth, checkTrainer, trainerController.deleteDayWorkoutplanofSpecificMember)

//update dietplan of specific member  by user_id 
router.put("/updatedietplanofSpecificMember", checkAuth, checkTrainer, trainerController.updatedietplanofSpecificMember)

//get dietplan
router.get("/getDietPlan/:user_id", checkAuth, checkTrainer, trainerController.getDietPlan)

//get my shift
router.get("/getWorkoutPlan/:user_id", checkAuth, checkTrainer, trainerController.getWorkoutPlan)

//get unused Diet Item of specific user
router.post('/getUnusedDietItemOfSpecificMember', checkAuth, checkTrainer, trainerController.getUnusedDietItemList);

//new api to get non-selected workouttypes who has taken Presonal Training package
router.post("/nonSelectedWorkoutTypes", checkAuth, checkTrainer, trainerController.nonSelectedWorkoutTypes);

//search perticular student  of a specific trainer
router.post("/searchStudent", checkAuth, checkTrainer, trainerController.searchStudent);

//get bmireport
router.post('/getMemberBmiReport', checkAuth, checkTrainer, trainerController.getMemberBmiReport);

//giveFeedback
router.post('/giveFeedback',checkAuth, checkTrainer, trainerController.giveFeedback);

module.exports = router