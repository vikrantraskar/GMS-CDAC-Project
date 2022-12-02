const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");
const checkAuth = require('../../middleware/checkAuth')
const checkAdmin = require('../../middleware/checkAdmin')
const adminController = require('../../controllers/admin/manageTrainer')

const router = express.Router();

//add new Trainer api
router.post("/addTrainer", checkAuth, checkAdmin, adminController.addTrainer );

// allot shift to specific trainer
router.post('/allotShift', checkAuth, checkAdmin, adminController.assginShiftToTrainer)

// update shift of specific trainer
router.post('/updateTrainerShift/:user_id',checkAuth, checkAdmin, adminController.updateShiftOfTrainer)

//update specific trainer salary by percentage%  using trainer's user_id
router.post('/hikeTsal/:id',checkAuth, checkAdmin, adminController.updateTrainerSalaryByPercent)


//get all trainers
router.get('/getTrainer',checkAuth, checkAdmin, adminController.getAllTrainers)

//get trainer by uer_id
router.get('/getTrainer/:id',checkAuth, checkAdmin, adminController.getTrainerByID)

//delete trainer by user_id
router.delete('/deleteTrainer/:id',checkAuth, checkAdmin, adminController.deleteTrainerByID)


//add specific trainers salary 
router.post('/addTsal',checkAuth, checkAdmin, adminController.addSpecificTrainerSalary)

/* //update specific trainer salary by trainer's user_id
// router.post('/updateTsal/:id',(request,response)=>{
//     const{id} = request.params
//     const {salary} = request.body

//     // const encryptedPasswrd = String(cryptoJs.MD5(password));

//     const query = `update trainer_salary set salary=? where user_id=?`

//     db.pool.query(
//         query,
//         [salary,id],
//         (error,data)=>{
//         response.send(utility.createResult(error,data));
//     })
 
// })
*/

//get all trainers salary 
router.get('/getAllTsal',checkAuth, checkAdmin, adminController.getAllTrainerSalary)

//get specific trainers salary 
router.get('/getTsal/:id',checkAuth, checkAdmin, adminController.getSpecificTrainerSalary)

//get All shifts of all trainers
router.get('/getAllShiftofAllTrainers/:user_id',checkAuth, checkAdmin, adminController.getAllShiftsOfAllTrainer);




module.exports = router