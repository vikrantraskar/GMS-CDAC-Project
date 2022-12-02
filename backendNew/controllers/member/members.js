const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

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

//sign up for member
exports.signupMember = (request, response) => {
  const { firstname, lastname, mobile, age, gender, email, password } =
    request.body;

  const encryptedPasswrd = String(cryptoJs.MD5(password));

  const statmente = `
                          Insert into users ( firstname, lastname, mobile, age, gender, email, password) values(?,?,?, ?, ?, ?, ?)
                      `;
  db.pool.query(
    statmente,
    [firstname, lastname, mobile, age, gender, email, encryptedPasswrd],
    (error, result) => {
      if (error) {
        response.send(utility.createError("member already exist"));
      } else {
        response.send(utility.createSuccess(result));
      }
    }
  );
};

//apply for membership-payment api

exports.applyMembershipPayment = (request, response) => {
  const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  let amt = parseFloat(amount);
  //console.log(token);

  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  let minAmount;
  let maxAmount;
  const statement = ` select (0.25 * package_amount ) as min_amount, package_amount from package where package_id = ? `;

  db.pool.query(statement, [package_id], (error, transactions) => {
    const result = {};
    minAmount = parseFloat(transactions[0].min_amount);
    maxAmount = parseFloat(transactions[0].package_amount);
    if (error) {
      response.send(utility.createError(error));
    }else if (amt <= 0 ) {
      response.send(
        utility.createError(
          `Zero or Negative amount cannot be procced`
        )
      );
    }  
    else if (amt < minAmount || amt > maxAmount) {
      console.log("inside elseif")
      response.send(
        utility.createError(
          `please pay above or equal to min. amount ${minAmount} and less than equal to ${maxAmount}`
        )
      );
    } else {
      let value;
      const statement0 = ` select case when exists
                              ( select user_id from user_package where user_id = ? )
                              then 'true'
                              else 'false'
                              end
                              as bool`;

      db.pool.query(statement0, [id], (error, exists) => {
        value = exists[0].bool;
        console.log("exist = ", value);
        const res = {};
        if (error) {
          res["status"] = "error";
          res["error"] = error;
          response.send(utility.createError(error));
        }
        else if (value == "true") {
          response.send(
            utility.createError(
              `you already took a membership`
            )
          );
        } else {
          const statmente1 = `
                  Insert into membership_transactions ( user_id, t_date, t_amount, package_id, payment_method ) values(?, ?, ?, ?, ?)
              `;
          db.pool.query(
            statmente1,
            [id, new Date(), amt, package_id, payment_method],
            (error, result) => {
              //   response.send(utility.createResult(error, result));
              let packageData;

              const statmente2 = `
                    select package_amount, duration from package where package_id = ?
                `;
              db.pool.query(statmente2, [package_id], (error, result) => {
                // response.send(utility.createResult(error, result));
                packageData = result[0];
                console.log(
                  "packageData = ",
                  packageData.package_amount,
                  packageData.duration
                );

                let start_date = new Date();

                let x = moment(start_date, "YYYY-MM-DD").add(
                  packageData.duration,
                  "M"
                );
                let end_date = new Date(moment(x).utc());
                //console.log("start date = ", start_date);
                // console.log(" end date = ", end_date);

                const statmente3 = `
                    insert into user_package ( user_id, package_id, start_date, end_date) values( ?, ?, ?, ?) 
                `;
                db.pool.query(
                  statmente3,
                  [id, package_id, start_date, end_date],
                  (error, result) => {
                    let paid_amount;
                    // response.send(utility.createResult(error, result));
                    const statmente4 = `
                select  sum(t_amount) as amount from membership_transactions where user_id = ?; 
                `;
                    db.pool.query(statmente4, [id], (error, result) => {
                      // response.send(utility.createResult(error, result));
                      paid_amount = result[0].amount;
                      console.log("paid_amount = ", paid_amount);

                      let total_amt;
                      const statmente5 = `
                select sum(p.package_amount) as total from package p join user_package up on p.package_id = up.package_id where up.user_id = ?; 
                `;
                      db.pool.query(statmente5, [id], (error, result) => {
                        // response.send(utility.createResult(error, result));
                        total_amt = result[0].total;
                        console.log("total_amount = ", total_amt);

                        let due = total_amt - paid_amount;
                        const statmente6 = `
                insert into member_billing values( ? , ? , ? , ?) 
                `;
                        db.pool.query(
                          statmente6,
                          [id, total_amt, paid_amount, due],
                          (error, result) => {
                            if (error) {
                              response.send(utility.createError(error));
                            } else {
                              const statement7 = ` update users set status = 1 where user_id = ? `;

                              db.pool.query(
                                statement7,
                                [id],
                                (error, result) => {
                                  if (error) {
                                    response.send(utility.createError(error));
                                  } else {
                                    response.send(
                                      utility.createSuccess(result)
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      });
                    });
                  }
                );
              });
            }
          );
        }
      });
    }
  });
};

//add package api
exports.addPackage = (request, response) => {
  const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  let amt = parseFloat(amount);
  console.log(token);

  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let minAmount;
  let maxAmount;

  const statement0 = `select * from users where user_id  = ? and status = ?`
  let count;
  db.pool.query(statement0, [id, 1], (error, data) => {
    count = data.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("You have not taken any membership yet"));
    }
    else {
      const statement = ` select (0.25 * package_amount ) as min_amount, package_amount from package where package_id = ? `;

      db.pool.query(statement, [package_id], (error, transactions) => {
        const result = {};
        minAmount = transactions[0].min_amount;
        maxAmount = transactions[0].package_amount;
        if (error) {
          response.send(utility.createError(error));
        }else if (amt <= 0 ) {
          response.send(
            utility.createError(
              `Zero or Negative amount cannot be procced`
            )
          );
        }  
        else if (amt < minAmount || amt > maxAmount) {
          response.send(
            utility.createError(
              `please pay above or equal to min. amount ${minAmount} and less than equal to ${maxAmount}`
            )
          );
        } else {
          let value;
          const statement0 = ` select case when exists
                              ( select user_id from user_package where user_id = ? and package_id = ? )
                              then 'true'
                              else 'false'
                              end
                              as bool`;

          db.pool.query(statement0, [id, package_id], (error, exists) => {
            value = exists[0].bool;
            console.log("result = ", value);
            const res = {};
            if (error) {
              response.send(utility.createError(error));
            } else if (value == "true") {
              response.send(
                utility.createError(
                  "you have already enrolled this package ... try to add amother Package"
                )
              );
            } else {
              const statmente1 = `
                  Insert into membership_transactions ( user_id, t_date, t_amount, package_id, payment_method ) values(?, ?, ?, ?, ?)
              `;
              db.pool.query(
                statmente1,
                [id, new Date(), amt, package_id, payment_method],
                (error, result) => {
                  //   response.send(utility.createResult(error, result));
                  let packageData;

                  const statmente2 = `
                    select package_amount, duration from package where package_id = ?
                `;
                  db.pool.query(statmente2, [package_id], (error, result) => {
                    // response.send(utility.createResult(error, result));
                    packageData = result[0];
                    console.log(
                      "packageData = ",
                      packageData.package_amount,
                      packageData.duration
                    );

                    let start_date = new Date()

                    let x = moment(start_date, "YYYY-MM-DD").add(
                      packageData.duration,
                      "M"
                    );
                    let end_date = new Date(moment(x).utc());
                    console.log("start date = ", start_date);
                    console.log(" end date = ", end_date);

                    const statmente3 = `
                    insert into user_package ( user_id, package_id, start_date, end_date) values( ?, ?, ?, ?) 
                `;
                    db.pool.query(
                      statmente3,
                      [id, package_id, start_date, end_date],
                      (error, result) => {
                        let paid_amount;
                        // response.send(utility.createResult(error, result));
                        const statmente4 = `
                select  sum(t_amount) as amount from membership_transactions where user_id = ?; 
                `;
                        db.pool.query(statmente4, [id], (error, result) => {
                          // response.send(utility.createResult(error, result));
                          paid_amount = result[0].amount;
                          console.log("paid_amount = ", paid_amount);

                          let total_amt;
                          const statmente5 = `
                select sum(p.package_amount) as total from package p join user_package up on p.package_id = up.package_id where up.user_id = ?; 
                `;
                          db.pool.query(statmente5, [id], (error, result) => {
                            // response.send(utility.createResult(error, result));
                            total_amt = result[0].total;
                            console.log("total_amount = ", total_amt);

                            let due = total_amt - paid_amount;
                            const statmente6 = `
                update member_billing set total_amount = ?, paid_amount = ?, due = ? where user_id = ?
                `;
                            db.pool.query(
                              statmente6,
                              [total_amt, paid_amount, due, id],
                              (error, result) => {
                                response.send(utility.createResult(error, result));
                              }
                            );
                          });
                        });
                      }
                    );
                  });
                }
              );
            }
          });
        }
      });
    }
  })

};

//getMemberTransactions api

exports.getMemberTransactions = (request, response) => {
  // const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from users where user_id = ? and status = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id, 1], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError("you have not taken any membership yet...")
      );
    } else {
      const statement2 = ` select p.package_name, mt.t_date, mt.t_amount, mt.payment_method from membership_transactions mt join package p on mt.package_id = p.package_id where user_id = ? `;

      db.pool.query(statement2, [id], (error, transactions) => {
        const result = {};
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(transactions));
        }
      });
    }
  });
};

//getMemberBillingstatus api
exports.getMemberBillingsStatus = (request, response) => {
  // const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select status from users where user_id = ? and status = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id, 1], (error, status) => {
    isValid_memeber = status[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError(" you have not taken any membership yet... ")
      );
    } else {
      const statement2 = ` select total_amount, paid_amount, due from member_billing where user_id = ? `;

      db.pool.query(statement2, [id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//getMemberPackages api
exports.getMemberPackages = (request, response) => {
  // const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from users where user_id = ? and status = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id, 1], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError("you have not taken any membership yet...")
      );
    } else {
      const statement2 = ` select p.package_id, p.package_name, p.duration, up.start_date, up.end_date from user_package up join package p on up.package_id = p.package_id where up.user_id = ? `;

      db.pool.query(statement2, [id], (error, transactions) => {
        const result = {};
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(transactions));
        }
      });
    }
  });
};

// pay dues api
exports.payDues = (request, response) => {
  const { amount } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  let amt = parseFloat(amount);
  const statement1 = ` select case when exists
                        ( select status from users where user_id = ? and status = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id, 1], (error, status) => {
    isValid_memeber = status[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError(" you have not taken any membership yet... ")
      );
    } else {
      const statement2 = ` select total_amount, paid_amount, due from member_billing where user_id = ? `;

      db.pool.query(statement2, [id], (error, result) => {
        let dueAmount = parseFloat(result[0].due);
        let paidAmount = parseFloat(result[0].paid_amount);
        if (error) {
          response.send(utility.createError(error));
        }else if (amt <= 0 ) {
          response.send(
            utility.createError(
              `Zero or Negative amount cannot be procced`
            )
          );
        }  
        else if (dueAmount == 0) {
          response.send(utility.createError("no dues are pending"));
        } else {
          const statement3 = ` update member_billing set paid_amount = ?, due = ? where user_id = ?`;
          let finalPaid = parseFloat(paidAmount + amt);
          let finalDue = parseFloat(dueAmount - amt);
          db.pool.query(statement3, [finalPaid, finalDue, id], (error, res) => {
            response.send(utility.createResult(error, res));
          });
        }
      });
    }
  });
};

// getDietPlan api
exports.getDietPlan = (request, response) => {
  // const { package_id, amount, payment_method } = request.body;
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from user_diet_plan where user_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id], (error, status) => {
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
      const statement2 = ` select d.item_name, u.qty from diet_item d join user_diet_plan u on d.diet_id = u.diet_id where u.user_id = ? `;

      db.pool.query(statement2, [id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//get my trainer if PT porgram taken
exports.getMyTrainer = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;

  const statement1 = ` select u1.firstname, u1.mobile, u1.email from users u1 join users u2 on u1.user_id = u2.trainer_id where u2.user_id = ?; `;

  db.pool.query(statement1, [id], (error, result) => {
    count = result.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(
        utility.createError(
          "You may have not taken PT program or trainer yet to be assigned"
        )
      );
    } else {
      response.send(utility.createSuccess(result));
    }
  });
};

// Select shift api
exports.selectShift = (request, response) => {
  const { token } = request.headers;
  const { shift_id } = request.body;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;

  const statement = `select * from users where user_id = ? and status = ?`
  let count
  db.pool.query(statement, [id, 1], (error, data) => {
    count = data.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("You have not taken any membership yet"));
    }
    else {
      const statement1 = ` select * from user_shift where user_id = ? `;

      db.pool.query(statement1, [id], (error, result) => {
        count = result.length;
        if (error) {
          response.send(utility.createError(error));
        } else if (count == 1) {
          response.send(
            utility.createError("You can't have more than one shift!!!")
          );
        } else {
          const statement2 = `
                INSERT INTO user_shift (user_id, shift_id)
                VALUES (?, ?)
              `;
          db.pool.query(statement2, [id, shift_id], (error, result) => {
            if (error) {
              response.send(utility.createError(error));
            } else {
              const statement3 = `select vacancy from shifts where shift_id = ?`;
              let count;
              db.pool.query(statement3, [shift_id], (error, result) => {
                count = result[0].vacancy;
                if (error) {
                  response.send(utility.createError(error));
                } else {
                  count = count - 1;
                  const statement4 = `update shifts set vacancy = ? where shift_id = ?`;
                  db.pool.query(statement4, [count, shift_id], (error, result) => {
                    if (error) {
                      response.send(utility.createError(error));
                    } else {
                      response.send(utility.createSuccess(result));
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  })
};

// update shift of specific member
exports.updateShiftOfMember = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  const { old_shift_id, new_shift_id } = request.body;

  const statement1 = ` 
                  select * from users where user_id = ? and status = ?
                  `;
  let count;
  db.pool.query(statement1, [id, 1], (error, data) => {
    count = data.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("You have not taken any membership yet"));
    } else {
      const statement2 = ` 
                          select * from shifts where shift_id = ?
                          `;
      db.pool.query(statement2, [new_shift_id], (error, data) => {
        count = data.length;
        if (error) {
          response.send(utility.createError(error));
        } else if (count == 0) {
          response.send(utility.createError("You have entered wrong shift_id"));
        } else {
          const statement = `
                                UPDATE user_shift 
                                SET shift_id = ? 
                                WHERE user_id = ? and shift_id = ?
                                `;
          db.pool.query(
            statement,
            [new_shift_id, id, old_shift_id],
            (error, result) => {
              if (error) {
                response.send(utility.createError(error));
              } else {
                const statement3 = `select vacancy from shifts where shift_id = ? `;
                let oldShiftCount;
                db.pool.query(statement3, [old_shift_id], (error, result) => {
                  oldShiftCount = result[0].vacancy;
                  if (error) {
                    response.send(utility.createError(error));
                  } else {
                    oldShiftCount = oldShiftCount + 1;
                    const statement4 = `update shifts set vacancy = ? where shift_id = ? `;
                    db.pool.query(
                      statement4,
                      [oldShiftCount, old_shift_id],
                      (error, result) => {
                        if (error) {
                          response.send(utility.createError(error));
                        } else {
                          const statement5 = `select vacancy from shifts where shift_id = ? `;
                          let newShiftCount;
                          db.pool.query(
                            statement5,
                            [new_shift_id],
                            (error, result) => {
                              newShiftCount = result[0].vacancy;
                              if (error) {
                                response.send(utility.createError(error));
                              } else {
                                newShiftCount = newShiftCount - 1;
                                const statement6 = `update shifts set vacancy = ? where shift_id = ? `;
                                db.pool.query(
                                  statement6,
                                  [newShiftCount, new_shift_id],
                                  (error, result) => {
                                    if (error) {
                                      response.send(utility.createError(error));
                                    } else {
                                      response.send(
                                        utility.createSuccess(result)
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};


//getmemberspecificworkoutPlan api
exports.getMyWorkoutPlan = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from workoutplan where user_id = ? )
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id], (error, status) => {
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
      const statement2 = ` select w1.Day,w1.wType_id, w2.type, w1.sets, w1.reps from workoutplan w1 
                                     join workouttype w2 on w1.wType_id=w2.wType_id  where w1.user_id = ? `;

      db.pool.query(statement2, [id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
          response.send(utility.createSuccess(result));
        }
      });
    }
  });
};

//get bmireport
exports.getMyBmiReport = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
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


//get my shift
exports.getMyShift = (request, response) => {
  const { token } = request.headers;
  const decodedToken = jwt.verify(token, config.secret);
  const id = decodedToken.userID;
  const statement1 = ` select case when exists
                          ( select * from user_shift where user_id = ? )
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
        utility.createError(`No shift alloted for you!`)
      );
    } else {
      const stetament2 = `
      select * from user_shift u join shifts s on u.shift_id=s.shift_id  where u.user_id=?  `;
      db.pool.query(stetament2, [id], (error, result) => {
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
  console.log("userID :::"+id)
  let isValid_memeber;
  const statement1 = ` select case when exists
                        ( select * from users where user_id = ? and status = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;

  db.pool.query(statement1, [id, 1], (error, status) => {
    isValid_memeber = status[0].bool;
    console.log("valid = ", isValid_memeber);
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid_memeber == "false") {
      response.send(
        utility.createError("you have not taken any membership yet...")
      );
    } else {
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

