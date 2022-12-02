const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();

//add new Trainer api
exports.addTrainer = (request, response) => {
  const { firstname, lastname, mobile, age, gender, email, password, role_id, salary} =
    request.body;

  const encryptedPasswrd = String(cryptoJs.MD5(password));

  const statmente = `
                          Insert into users ( firstname, lastname, mobile, age, gender, email, password, role_id ) values( ?, ?, ?, ?, ?, ?, ?, ?)
                      `;
  db.pool.query(
    statmente,
    [
      firstname,
      lastname,
      mobile,
      age,
      gender,
      email,
      encryptedPasswrd,
      role_id,
      salary
    ],
    (error, result) => {
      if (error) {
        response.send(utility.createError(error));
      }
      else{
        const statement1 = `select user_id from users where email = ?`
        let userID;
        db.pool.query(
          statement1,[email],
          (error, data) => {
            userID = data[0].user_id
            if (error) {
              response.send(utility.createError(error));
            }
            else{
              const statement2 = `insert into trainer_salary values(?, ?)`
              db.pool.query(
                statement2,[userID, salary],
                (error, result) => {
                  if (error) {
                    response.send(utility.createError(error));
                  }
                  else{
                    response.send(utility.createSuccess(result));
                  }
                })
            }
          }
        )
      }
    }
  );
};

// allot shift to specific trainer
exports.assginShiftToTrainer = (request, response) => {
  const { token } = request.headers;
  const { user_id, shift_id } = request.body;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  const statement1 = ` select case when exists
  ( select * from users where user_id = ?)
  then 'true'
  else 'false'
  end
  as bool`;
  let isExist;
  db.pool.query(statement1, [user_id], (error, data) => {
    isExist = data[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isExist == "false") {
      response.send(utility.createError("You have entered wrong user_id"));
    } else {
      const statement2 = ` select case when exists
  ( select * from shifts where shift_id = ?)
  then 'true'
  else 'false'
  end
  as bool`;
      let isExist;
      db.pool.query(statement2, [shift_id], (error, data) => {
        isExist = data[0].bool;
        if (error) {
          response.send(utility.createError(error));
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong shift_id"));
        } else {
          let isValid_memeber;
          const statement = `
    INSERT INTO user_shift (user_id, shift_id)
    VALUES (?, ?)
  `;
          db.pool.query(statement, [user_id, shift_id], (error, result) => {
            response.send(utility.createResult(error, result));
          });
        }
      });
    }
  });
};

// update shift of specific trainer
exports.updateShiftOfTrainer = (request, response) => {
  const { user_id } = request.params;
  const { old_shift_id, new_shift_id } = request.body;

  const statement1 = ` select case when exists
    ( select * from users where user_id = ? and role_id = ?)
    then 'true'
    else 'false'
    end
    as bool`;
  let isExist;
  db.pool.query(statement1, [user_id, 2], (error, data) => {
    isExist = data[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isExist == "false") {
      response.send(utility.createError("You have entered wrong user_id"));
    } else {
      const statement2 = ` select case when exists
    ( select * from shifts where shift_id = ?)
    then 'true'
    else 'false'
    end
    as bool`;
      let isExist;
      db.pool.query(statement2, [new_shift_id], (error, data) => {
        isExist = data[0].bool;
        if (error) {
          response.send(utility.createError(error));
        } else if (isExist == "false") {
          response.send(
            utility.createError("You have entered wrong new shift id")
          );
        } else {
          const statement = `
    UPDATE user_shift 
    SET shift_id = ? 
    WHERE user_id = ? and shift_id = ?
    `;
          db.pool.query(
            statement,
            [new_shift_id, user_id, old_shift_id],
            (error, result) => {
              response.send(utility.createResult(error, result));
            }
          );
        }
      });
    }
  });
};

//update specific trainer salary by percentage%  using trainer's user_id
exports.updateTrainerSalaryByPercent = (request, response) => {
  const { id } = request.params;
  const { percentage } = request.body;

  const statement0 = ` select case when exists
 ( select user_id from trainer_salary where user_id = ? )
 then 'true'
 else 'false'
 end
 as bool`;

  db.pool.query(statement0, [id], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError(
          "salary is not alloted to this trainer....first allot him salary"
        )
      );
    } else {
      let percent = (parseInt(percentage) + 100) / 100;

      // const encryptedPasswrd = String(cryptoJs.MD5(password));

      const query = `update trainer_salary set salary=(? * salary) where user_id=?`;

      db.pool.query(query, [percent, id], (error, data) => {
        response.send(utility.createResult(error, data));
      });
    }
  });
};

//get all trainers
exports.getAllTrainers = (request, response) => {
  const statement0 = ` select case when exists
 ( select * from users where role_id = ? )
 then 'true'
 else 'false'
 end
 as bool`;

  db.pool.query(statement0, [2], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("trainer does not exist"));
    } else {
      const query = `select u.user_id, u.firstname, u.lastname, u.email, t.salary from users u join trainer_salary t on u.user_id = t.user_id where role_id = 2 `;
      db.pool.query(query, (error, data) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(data));
        }
      });
    }
  });
};

//get trainer by uer_id
exports.getTrainerByID = (request, response) => {
  const { id } = request.params;
  const { user_id, firstName, lastName, mobile, email } = request.body;
  const query = `select user_id,firstName,lastName,mobile,email from users where user_id=?`;
  db.pool.query(query, [id], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("trainer does not exist "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};

//delete trainer by user_id
exports.deleteTrainerByID = (request, response) => {
  const { id } = request.params;

  const statement1 = ` select case when exists
   ( select * from users where user_id = ? )
   then 'true'
   else 'false'
   end
   as bool`;

  db.pool.query(statement1, [id], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("you have entered wrong id"));
    } else {
      const statement2 = `DELETE from trainer_salary where user_id = ?`;
      db.pool.query(statement2, [id], (error, data) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          const statement3 = `DELETE from user_shift where user_id = ?`;
          db.pool.query(statement3, [id], (error, data) => {
            if (error) {
              response.send(utility.createError(error));
            } else {
              const statement4 = `UPDATE users SET trainer_id = NULL WHERE trainer_id = ?`;
              db.pool.query(statement4, [id], (error, data) => {
                if (error) {
                  response.send(utility.createError(error));
                } else {
                  const statement5 = `DELETE from users WHERE user_id=?`;
                  db.pool.query(statement5, [id], (error, data) => {
                    response.send(utility.createResult(error, data));
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

//add specific trainers salary
exports.addSpecificTrainerSalary = (request, response) => {
  const { user_id, salary } = request.body;

  const query = `insert into trainer_salary(user_id,salary) values (?,?)`;

  db.pool.query(query, [user_id, salary], (error, data) => {
    if (error) {
      response.send(
        utility.createError(
          `salary is already alloted to this trainer ${user_id}`
        )
      );
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};

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
exports.getAllTrainerSalary = (request, response) => {
  const query = `select u.user_id,u.firstName,u.lastName,u.mobile,u.email,t.salary from users u inner join trainer_salary t on u.user_id=t.user_id`;
  db.pool.query(query, (error, data) => {
    response.send(utility.createResult(error, data));
  });
};

//get specific trainers salary
exports.getSpecificTrainerSalary = (request, response) => {
  const { id } = request.params;

  const query = `select u.user_id,u.firstName,u.lastName,u.mobile,u.email,t.salary from users u inner join trainer_salary t on u.user_id=t.user_id where t.user_id=?`;
  db.pool.query(query, [id], (error, data) => {
    response.send(utility.createResult(error, data));
  });
};

//get All shifts of all trainers
exports.getAllShiftsOfAllTrainer = (request, response) => {
  const {user_id} = request.params
  const statement1 = ` select u.user_id, u.trainer_id, u.firstname, u.lastname,us.shift_id, s.time_slot from users u
     join user_shift us on u.user_id=us.user_id
     join shifts s on us.shift_id=s.shift_id
     where u.role_id=? and u.user_id = ? ;`;
  db.pool.query(statement1, [2, user_id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of shift is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};
