const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();

//update profile
exports.updateProfile = (request, response) => {
  const { token } = request.headers;

  //console.log(token);

  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  const { firstname, lastname, mobile, age, gender } = request.body;

  const statement0 = ` select * from users where user_id = ? `;

  let isExist;

  db.pool.query(statement0, [id], (error, data) => {
    isExist;
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("this user does not exist "));
    } else {
      const query = `update users set firstname=?, lastname=?, mobile=?, age=? ,gender=? where user_id=?`;
      db.pool.query(
        query,
        [firstname, lastname, mobile, age, gender, id],
        (error, data) => {
          if (error) {
            response.send(utility.createError(error));
          } else {
            response.send(utility.createSuccess(data));
          }
        }
      );
    }
  });
};

// update password
exports.updatePassword = (request, response) => {
  const { token } = request.headers;

  //console.log(token);

  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  const { password } = request.body;

  const encryptedPasswrd = String(cryptoJs.MD5(password));

  console.log(encryptedPasswrd);

  const statement0 = ` select * from users where user_id = ? `;

  let isExist;

  db.pool.query(statement0, [id], (error, data) => {
    isExist;
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("this user does not exist "));
    } else {
      const query = `update users set  password=? where user_id=?`;
      db.pool.query(query, [encryptedPasswrd, id], (error, data) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(data));
        }
      });
    }
  });
};

//get diet_Item list
exports.getDietItemList = (request, response) => {
  const statement1 = ` select * from diet_item `;

  db.pool.query(statement1, (error, result) => {
    count = result.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List is empty...add some item first"));
    } else {
      response.send(utility.createSuccess(result));
    }
  });
};

//add new diet item
exports.addDietItem = (request, response) => {
  const { item_name } = request.body;

  const statement1 = ` insert into diet_item (item_name) values( ? )`;

  db.pool.query(statement1, [item_name], (error, result) => {
    if (error) {
      response.send(utility.createError("item is already added"));
    } else {
      response.send(utility.createSuccess(result));
    }
  });
};

//update specific diet item
exports.updateDietItem = (request, response) => {
  const { diet_id, item_name } = request.body;

  const statement0 = ` select case when exists
                        ( select * from diet_item where diet_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement0, [diet_id], (error, status) => {
    let isExist = status[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isExist == "false") {
      response.send(
        utility.createError(" you cannot update ..this item does not exist")
      );
    } else {
      const statement1 = `update diet_item set item_name = ? where diet_id = ?`;

      db.pool.query(statement1, [item_name, diet_id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//remove diet item
exports.deleteDietItem = (request, response) => {
  const { diet_id } = request.body;

  const statement0 = ` select case when exists
                        ( select * from diet_item where diet_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement0, [diet_id], (error, status) => {
    let isExist = status[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isExist == "false") {
      response.send(
        utility.createError(" you cannot delete ..this item does not exist")
      );
    } else {
      const statement1 = `delete from diet_item where diet_id = ?`;

      db.pool.query(statement1, [diet_id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//add diet plan for specific member who chooses personal training
exports.addDietPlan = (request, response) => {
  const { user_id, diet_id, qty } = request.body;

  const statement1 = `select case when exists
                        ( select user_id from user_package where user_id = ? and package_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool  `;

  db.pool.query(statement1, [user_id, 1], (error, result) => {
    const isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError(
          `${user_id} haven't taken Personal Training Program`
        )
      );
    } else {
      const statement2 = ` insert into user_diet_plan values( ?, ?, ?  )`;

      db.pool.query(statement2, [user_id, diet_id, qty], (error, res) => {
        response.send(utility.createResult(error, res));
      });
    }
  });
};

//get specific workout type by wType_id
exports.getSpecificWorkoutType = (request, response) => {
  const { id } = request.params;

  const query = `select type from workouttype where wType_id=?`;
  db.pool.query(query, [id], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("workout type does not exist "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};

//get all workout type
exports.getAllWorkoutType = (request, response) => {
  const statement0 = ` select case when exists
    ( select * from workouttype )
    then 'true'
    else 'false'
    end
    as bool`;

  db.pool.query(statement0, [], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("workout type does not exist"));
    } else {
      const query = `select * from workouttype`;
      db.pool.query(query, (error, data) => {
        response.send(utility.createResult(error, data));
      });
    }
  });
};

//update specific workout type  by wType_id
exports.updateSpecificWorkoutType = (request, response) => {
  const { wType_id } = request.params;
  const { type } = request.body;

  if(type !== '')
  {
    const statement0 = ` select * from workouttype where wType_id = ? `;
    let isExist;
    db.pool.query(statement0, [wType_id], (error, data) => {
      isExist;
      if (error) {
        response.send(utility.createError(error));
      } else if (data.length == 0) {
        response.send(utility.createError("workout type does not exist "));
      } else {
        const query = `update workouttype set type=? where wType_id=?`;
        db.pool.query(query, [type, wType_id], (error, data) => {
          if (error) {
            response.send(utility.createError(error));
          } else {
            response.send(utility.createSuccess(data));
          }
        });
      }
    });
  }
  else{
    response.send(utility.createError("workout type is empty"));
  }
};

//add specific workout type
exports.addSpecificWorkoutType = (request, response) => {
  const { type } = request.body;

 if(type !== '')
 {
  const query = `insert into workouttype(type) values (?)`;

  db.pool.query(query, [type], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    }else {
      response.send(utility.createSuccess(data));
    }
  });
 }else{
  response.send(utility.createError("workout type is empty"));
}
};

//delete workout type by wType_id

exports.deleteSpecificWorkoutType = (request, response) => {
  const { id } = request.params;

  const statement0 = ` select case when exists
   ( select * from workouttype where wType_id = ? )
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
        utility.createError("you have entered wrong  workout type id")
      );
    } else {
      const query = `delete from workouttype where wType_id=?`;
      db.pool.query(query, [id], (error, data) => {
        response.send(utility.createResult(error, data));
      });
    }
  });
};

//getAll shift of specific trainer
exports.getMyAllShifts = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  const statement1 = ` select * from user_shift u join shifts s on u.shift_id=s.shift_id  where u.user_id=?`;
  db.pool.query(statement1, [id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("You don't have any shifts"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};

//get all members of a specific trainer
exports.getMyStudents = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  const statement1 = ` select user_id,firstname,lastname,age,mobile,email,gender,status from users where trainer_id=?`;
  db.pool.query(statement1, [id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of members is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};

//add work plan for specific member who chooses personal training
exports.addWorkoutPlan = (request, response) => {
  const { user_id, Day, wType_id, set, reps } = request.body;

  const statement1 = `select case when exists
                        ( select user_id from user_package where user_id = ? and package_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool  `;

  db.pool.query(statement1, [user_id, 1], (error, result) => {
    const isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError(
          `${user_id} haven't taken Personal Training Program`
        )
      );
    } else {
      const statement2 = ` insert into workoutplan values( ?, ?, ?, ?, ?  )`;

      db.pool.query(
        statement2,
        [user_id, Day, wType_id, set, reps],
        (error, res) => {
          if (error) {
            response.send(utility.createError("Already exist"));
          } else {
            response.send(utility.createSuccess(res));
          }
        }
      );
    }
  });
};

//addbmireport
exports.addBmiReport = (request, response) => {
  const { user_id, height, weight } = request.body;
  const statement1 = ` select case when exists
                          ( select * from users where user_id = ? and status = ?)
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [user_id, 1], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError("Member don't have any active plan")
      );
    } else {
      let score;
      score = (weight / (height * height)) * 10000;
      let status;
      if (score < 18.5) {
        status = "Underweight";
      } else if (18.5 <= score && score < 25) {
        status = "Normal";
      } else if (25 <= score && score < 30) {
        status = "Overweight";
      } else {
        status = "Obesity";
      }

      const statement = `insert into bmi_report (user_id,height,weight,score,status) values (?,?,?,?,?)`;
      db.pool.query(
        statement,
        [user_id, height, weight, score, status],
        (error, result) => {
          if (error) {
            response.send(utility.createError("Bmi report for this user is already added"));
          } else {
            response.send(utility.createSuccess(result));
          }
        }
      );
    }
  });
};

//updatebmireport
exports.updateBmiReport = (request, response) => {
  const { user_id, height, weight } = request.body;
  const statement1 = ` select case when exists
                          ( select * from bmi_report where user_id = ? )
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [user_id], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError("This user dose not exist.... first add bmi_report")
      );
    } else {
      let score;
      score = (weight / (height * height)) * 10000;
      let status;
      if (score < 18.5) {
        status = "Underweight";
      } else if (18.5 <= score && score < 25) {
        status = "Normal";
      } else if (25 <= score && score < 30) {
        status = "Overweight";
      } else {
        status = "Obesity";
      }

      const statement = `update bmi_report set height=?, weight=?, score=?, status=? where user_id=?`;
      db.pool.query(
        statement,
        [height, weight, score, status, user_id],
        (error, result) => {
          if (error) {
            response.send(utility.createError(error));
          } else {
            response.send(utility.createSuccess(result));
          }
        }
      );
    }
  });
};

//delete day workoutplan of specific user  by user_id
exports.deleteDayWorkoutplanofSpecificMember = (request, response) => {
  const { user_id } = request.params;
  const { Day, wType_id } = request.body;

  const statement0 = ` select * from users where user_id = ? `;

  let isExist;

  db.pool.query(statement0, [user_id], (error, data) => {
    isExist;
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("User does not exist "));
    } else {
      // user_id ,Day,wType_id,sets, reps
      const query = `delete from workoutplan where user_id=? and Day = ? and wType_id = ?`;
      db.pool.query(query, [user_id, Day, wType_id], (error, data) => {
        console.log("deleted........!! "+user_id+" "+Day+" "+wType_id)
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(data));
        }
      });
    }
  });
};

//update dietplan of specific member  by user_id
exports.updatedietplanofSpecificMember = (request, response) => {
  const { user_id } = request.body;
  const { qty, diet_id } = request.body;

  const statement0 = ` select * from users where user_id = ? `;

  let isExist;

  db.pool.query(statement0, [user_id], (error, data) => {
    isExist;
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("User does not exist "));
    } else if (qty <= 0) {
      response.send(utility.createError("Quantity can't be negative "));
    } else {
      //  user_id,diet_id ,qty
      const query = `update user_diet_plan set qty=? where user_id=? and diet_id = ?`;
      db.pool.query(query, [qty, user_id, diet_id], (error, data) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(data));
        }
      });
    }
  });
};


// getDietPlan of specifc member api
exports.getDietPlan = (request, response) => {
  // const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  const { user_id } = request.params;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from user_diet_plan where user_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [user_id], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError(
          "diet plan is not added for you till now.. or you have not not taken PT program"
        )
      );
    } else {
      const statement2 = ` select d.diet_id,d.item_name, u.qty from diet_item d join user_diet_plan u on d.diet_id = u.diet_id where u.user_id = ? `;

      db.pool.query(statement2, [user_id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//getmemberspecificworkoutPlan api
exports.getWorkoutPlan = (request, response) => {
  const { token } = request.headers;
  const { user_id } = request.params;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from workoutplan where user_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [user_id], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError(
          "workout plan is not added for you till now.. or you have not taken PT program"
        )
      );
    } else {
      const statement2 = ` select w1.user_id,w1.Day,w1.wType_id, w2.type, w1.sets, w1.reps from workoutplan w1 
                                     join workouttype w2 on w1.wType_id=w2.wType_id  where w1.user_id = ? `;

      db.pool.query(statement2, [user_id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//get unused Diet Item of specific user
exports.getUnusedDietItemList = (request, response) => {
  const { user_id } = request.body;
 // const { token } = request.headers;
  // const decodedToken = jwt.verify(token, config.secret);
  // const id = decodedToken.userID;

  const statement1 = ` SELECT d.diet_id, d.item_name FROM diet_item d WHERE d.diet_id NOT IN (SELECT udp.diet_id FROM user_diet_plan udp where udp.user_id = ?)`;
  db.pool.query(statement1, [user_id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of unused diet item is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};


//new api to get non-selected workouttypes who has taken Presonal Training package
exports.nonSelectedWorkoutTypes = (request, response) => {
  const { user_id } = request.body
  //SELECT w.wType_id, w.type FROM workouttype w WHERE w.wType_id NOT IN (SELECT wp.wType_id FROM workoutplan wp where wp.user_id = 101);
  const statement1 = ` SELECT w.wType_id, w.type FROM workouttype w WHERE w.wType_id NOT IN (SELECT wp.wType_id FROM workoutplan wp where wp.user_id = ?)`;
  db.pool.query(statement1, [user_id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of workouttype is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};


//search particular student of a specific trainer
exports.searchStudent = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  const { email } = request.body
  const statement1 = ` select firstname,lastname,age,mobile,email,gender,status from users where trainer_id=? and email=?`;
  db.pool.query(statement1, [id,email], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of members is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};


//get MemberBmiReport
exports.getMemberBmiReport = (request, response) => {

  const {id} = request.body
  
  const statement1 = ` select case when exists
                          ( select * from bmi_report where user_id = ? )
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [id], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(
        utility.createError(`No bmi_report is created for this user_id...${id}`)
      );
    } else {
      const stetament = `
          SELECT height,weight,score,status FROM bmi_report where user_id=?  `;
      db.pool.query(stetament, [id], (error, result) => {
        response.send(utility.createResult(error, result));
      });
    }
  });
};

//Feedback Api
exports.giveFeedback = (request, response) => {
  const {f_text } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from users where user_id = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    }else {
      const statement2 = ` insert into feedback (user_id, f_text) values(?,?) `;

      db.pool.query(statement2, [id,f_text], (error, data) => {
        const result = {};
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(data));
        }
      });
    }
  });
};