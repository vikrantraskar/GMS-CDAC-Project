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

//count of trainers
exports.countOfTrainers = (request, response) => {
  const statement0 = ` select case when exists
   ( select count(*) from users where role_id = ? )
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
      const query = `select count(*) as Count from users where role_id = 2 `;
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

//count of members
exports.countOfMembers = (request, response) => {
  const statement0 = ` select case when exists
   ( select count(*) from users where role_id =? )
   then 'true'
   else 'false'
   end
   as bool`;

  db.pool.query(statement0, [3], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("member does not exist"));
    } else {
      const query = `select count(*) as Count from users where role_id = 3 `;
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

//count of male and female members
exports.countOfMaleFemaleMembers = (request, response) => {
  const statement0 = ` select case when exists
     ( select count(*) from users where role_id =? )
     then 'true'
     else 'false'
     end
     as bool`;

  db.pool.query(statement0, [3], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("member does not exist"));
    } else {
      const query = `select gender,count(*) as Count from users where role_id = 3 group by gender; `;
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

//count of male and female trainers
exports.countOfMaleFemaleTrainers = (request, response) => {
  const statement0 = ` select case when exists
     ( select count(*) from users where role_id =? )
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
      const query = `select gender,count(*) as Count from users where role_id = 2 group by gender; `;
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

//total revenue
exports.totalRevenue = (request, response) => {
  const statement0 = ` select sum(t_amount) as Revenue from membership_transactions`;

  db.pool.query(statement0, [2], (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else {
      response.send(utility.createSuccess(result));
    }
  });
};

//get all equipments details
exports.getEquipmentDetails = (request, response) => {
  const statement0 = ` select case when exists
     ( select count(*) from equipments )
     then 'true'
     else 'false'
     end
     as bool`;

  db.pool.query(statement0, (error, result) => {
    let isValid = result[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("Equipment does not exist"));
    } else {
      const query = `select * from equipments `;
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


//get member by emailId
exports.getMemberByEmailId = (request, response) => {
  const { email } = request.body;

  const query = `select firstname,lastname,mobile,age,gender,status,trainer_id from users where email=? and role_id=?`;
  db.pool.query(query, [email,3], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError("this member does not exist "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};

//get trainer by emailId
exports.getTrainerByEmailId = (request, response) => {
  const { email } = request.body;

  const query = `select  firstname,lastname,mobile,age,gender from users where email=? and role_id=?`;
  db.pool.query(query, [email,2], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError(" this trainer does not exist "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};


//get Messages
exports.getMessages = (request, response) => {
  //const { email } = request.body;

  const query = `select  * from contactus`;
  db.pool.query(query, [2], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError(" Messages list is empty "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};

//get Feedback
exports.getFeedback = (request, response) => {
  //const { email } = request.body;

  const query = `select u.user_id, u.firstname,u.email,u.role_id, u.mobile, f.f_text,f.feedback_id from users u join feedback f on u.user_id=f.user_id `;
  db.pool.query(query, (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError(" Feedback list is empty "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};


//get FeedbackT
exports.getFeedbackT = (request, response) => {
  //const { email } = request.body;

  const query = `select u.user_id, u.firstname,u.email,u.role_id, u.mobile, f.f_text,f.feedback_id from users u join feedback f on u.user_id=f.user_id where u.role_id = ?`;
  db.pool.query(query,[2], (error, data) => {
    if (error) {
      response.send(utility.createError(error));
    } else if (data.length == 0) {
      response.send(utility.createError(" Feedback list is empty "));
    } else {
      response.send(utility.createSuccess(data));
    }
  });
};
