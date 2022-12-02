const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require('../../middleware/checkAuth')
const checkAdmin = require('../../middleware/checkAdmin')
const adminController = require('../../controllers/admin/adminDashboard')

const router = express.Router();



//update profile
router.post("/updateProfile", checkAuth, checkAdmin, adminController.updateProfile);

// update password
router.post("/updatePassword",  checkAuth, checkAdmin, adminController.updatePassword);

//count of trainers
router.get("/countOfTrainers", checkAuth, checkAdmin, adminController.countOfTrainers);

//count of members
router.get("/countOfMembers",  checkAuth, checkAdmin, adminController.countOfMembers);

//count of male and female members
router.get("/countOfMaleFemaleMembers", checkAuth, checkAdmin, adminController.countOfMaleFemaleMembers);

//count of male and female trainers
router.get("/countOfMaleFemaleTrainers",  checkAuth, checkAdmin, adminController.countOfMaleFemaleTrainers);

//total revenue
router.get("/totalRevenue",  checkAuth, checkAdmin, adminController.totalRevenue);

//get all equipments details
router.get("/getEquipmentDetails",  checkAuth, checkAdmin, adminController.getEquipmentDetails);

//search member by  email id
router.post("/getMemberByEmailId", checkAuth, checkAdmin, adminController.getMemberByEmailId);

//search trainer by  email id
router.post("/getTrainerByEmailId", checkAuth, checkAdmin, adminController.getTrainerByEmailId);

//getMessages
router.get("/getMessages",  checkAuth, checkAdmin, adminController.getMessages);

//getfeedback
router.get("/getFeedback",  checkAuth, checkAdmin, adminController.getFeedback);

//getfeedback
router.get("/getFeedbackT",  checkAuth, checkAdmin, adminController.getFeedbackT);



/* //assign shift to specific trainer
router.post('/allotShift', (request, response) => {
    const { token } = request.headers;
    const { user_id, shift_id } = request.body
    const decodedToken = jwt.verify(token, config.secret);
    const id = decodedToken.userID;
  
    const statement1 = ` select case when exists
    ( select * from users where user_id = ?)
    then 'true'
    else 'false'
    end
    as bool`;
    let isExist
    db.pool.query(
      statement1,
      [user_id],
      (error, data) => {
        isExist = data[0].bool
        if (error) {
          response.send(utility.createError(error))
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong user_id"))
        } else {
          const statement2 = ` select case when exists
    ( select * from shifts where shift_id = ?)
    then 'true'
    else 'false'
    end
    as bool`;
          let isExist
          db.pool.query(
            statement2,
            [shift_id],
            (error, data) => {
              isExist = data[0].bool
              if (error) {
                response.send(utility.createError(error))
              } else if (isExist == "false") {
                response.send(utility.createError("You have entered wrong shift_id"))
              } else {
                let isValid_memeber;
                const statement = `
      INSERT INTO user_shift (user_id, shift_id)
      VALUES (?, ?)
    `
                db.pool.query(statement, [user_id, shift_id], (error, result) => {
                  response.send(utility.createResult(error, result))
                })
              }
            }
          )
        }
      }
    )
  })
  */
  
  
  

  

module.exports = router