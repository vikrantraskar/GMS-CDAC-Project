const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();

//activate member
exports.activateMember = (request, response) => {
  const { id } = request.params;

  const statement = ` UPDATE users SET status = ? WHERE user_id = ? 
           `;
      db.pool.query(statement, [1, id], (error, result) => {
        if (error) {
          response.send(utility.createError(error));
        } else {
        response.send(utility.createSuccess(result));
    }
  });
};

//assign trainer to member having PT
exports.assignPersonalTrainer = (request, response) => {
  const { trainer_id, member_id } = request.body;

  const statement0 = ` select case when exists
                            ( select * from user_package where user_id = ? and package_id = ? )
                            then 'true'
                            else 'false'
                            end
                            as bool`;
  let isMemberValid;
  db.pool.query(statement0, [member_id, 1], (error, exists) => {
    isMemberValid = exists[0].bool;

    if (error) {
      response.send(utility.createError(error));
    } else if (isMemberValid == "false") {
      response.send(
        utility.createError("this member haven't taken PT program")
      );
    } else {
      const statement1 = `update users set trainer_id = ? where user_id = ? `;

      db.pool.query(statement1, [trainer_id, member_id], (error, data) => {
        response.send(utility.createResult(error, data));
      });
    }
  });
};

//get all members
exports.getAllMember = (request, response) => {
  const statement1 = ` select case when exists
                          ( select * from users where role_id = ?)
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [3], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("List of members is empty"));
    } else {
      const stetament = `
      SELECT u.user_id, u.firstname, u.lastname, u.mobile, u.email, u.age, u.gender, u.status, u.role_id, u.trainer_id, us.shift_id, s.time_slot FROM users u join user_shift us join shifts s  on u.user_id = us.user_id and us.shift_id = s.shift_id  where u.role_id = ?`;
      db.pool.query(stetament, [3], (error, result) => {
        response.send(utility.createResult(error, result));
      });
    }
  });
};

//get all inactive members
exports.getAllInactiveMember = (request, response) => {
  const statement1 = ` select case when exists
                          ( select * from users where role_id = ?)
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [3], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("List of members is empty"));
    } else {
      const stetament = `
          SELECT user_id, firstname, lastname, mobile, email, age, gender, status, role_id FROM users where role_id = ? and status = ?`;
      db.pool.query(stetament, [3,0], (error, result) => {
        response.send(utility.createResult(error, result));
      });
    }
  });
};


// update shift of specific member
exports.updateShiftOfMember = (request, response) => {
  const { user_id } = request.params;
  const { old_shift_id, new_shift_id } = request.body;

  const statement1 = ` 
                  select * from users where user_id = ?
                  `;
  let count;
  db.pool.query(statement1, [user_id], (error, data) => {
    count = data.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("You have entered wrong user_id"));
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
            [new_shift_id, user_id, old_shift_id],
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

// remove specific member
exports.removeSpecificMember = (request, response) => {
  const { user_id } = request.params;

  const statement1 = ` 
                        select * from users where user_id = ?
                       `;
  let count;
  db.pool.query(statement1, [user_id], (error, data) => {
    console.log("statement1");
    count = data.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(
        utility.createError(
          "You have entered wrong user id or user doesnot exist"
        )
      );
    } else {
      const statement2 = `
          DELETE from bmi_report WHERE user_id = ?
          `;
      db.pool.query(statement2, [user_id], (error, data) => {
        console.log("statement 2");
        if (error) {
          response.send(utility.createError(error));
        } else {
          const statement3 = `
          DELETE from member_billing WHERE user_id = ?
          `;
          db.pool.query(statement3, [user_id], (error, data) => {
            console.log("statement 3");
            if (error) {
              response.send(utility.createError(error));
            } else {
              const statement4 = `
            DELETE from membership_transactions WHERE user_id = ?
            `;
              db.pool.query(statement4, [user_id], (error, data) => {
                console.log("statement 4");
                if (error) {
                  response.send(utility.createError(error));
                } else {
                  console.log("statement 5");
                  const statement5 = `
              DELETE from user_shift WHERE user_id = ?
              `;
                  db.pool.query(statement5, [user_id], (error, data) => {
                    if (error) {
                      response.send(utility.createError(error));
                    } else {
                      console.log("statement 6");
                      const statement6 = `
                DELETE from user_package WHERE user_id = ?
                `;
                      db.pool.query(statement6, [user_id], (error, data) => {
                        if (error) {
                          response.send(utility.createError(error));
                        } else {
                          console.log("statement 7");
                          const statement7 = `
                  DELETE from workoutplan WHERE user_id = ?
                  `;
                          db.pool.query(
                            statement7,
                            [user_id],
                            (error, data) => {
                              if (error) {
                                response.send(utility.createError(error));
                              } else {
                                console.log("statement 8");
                                const statement8 = `
                    DELETE from user_diet_plan WHERE user_id = ?
                    `;
                                db.pool.query(
                                  statement8,
                                  [user_id],
                                  (error, data) => {
                                    if (error) {
                                      response.send(utility.createError(error));
                                    } else {
                                      console.log("statement 9");
                                      const statement9 = `
                      DELETE from users WHERE user_id = ?
                      `;
                                      db.pool.query(
                                        statement9,
                                        [user_id],
                                        (error, result) => {
                                          response.send(
                                            utility.createResult(error, result)
                                          );
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

//de-activate user
exports.deactivateUser = (request, response) => {
  const { id } = request.params;

  const statement1 = ` select case when exists
                          ( select * from users where role_id = ? and status=?)
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  db.pool.query(statement1, [3, 1], (error, res) => {
    let isValid = res[0].bool;
    if (error) {
      response.send(utility.createError(error));
    } else if (isValid == "false") {
      response.send(utility.createError("List of active members is empty"));
    } else {
      const statement2 = ` UPDATE users SET status = ? and trainer_id = ? WHERE user_id = ? 
           `;
      db.pool.query(statement2, [0, 0, id], (error, result) => {
        let shiftId;
        if (error) {
          response.send(utility.createError(error));
        } else {
          const statement3 = ` SELECT shift_id from user_shift where user_id = ? 
               `;
          db.pool.query(statement3, [id], (error, result) => {
            shiftId = result[0].shift_id;
            if (error) {
              response.send(utility.createError(error));
            } else {
              const statement4 = `SELECT vacancy from shifts where shift_id = ?`;
              let count;
              db.pool.query(statement4, [shiftId], (error, result) => {
                count = parseInt(result[0].vacancy);
                if (error) {
                  response.send(utility.createError(error));
                } else {
                  const statement5 = `update shifts set vacancy = ? where shift_id = ? `;
                  count = count + 1
                  db.pool.query(
                    statement5,
                    [count , shiftId],
                    (error, result) => {
                      if (error) {
                        response.send(utility.createError(error));
                      } else {
                        const statement6 = `delete from user_shift where user_id = ? `;
                        db.pool.query(statement6, [id], (error, result) => {
                          if (error) {
                            response.send(utility.createError(error));
                          } else {
                            response.send(utility.createResult(error, result));
                          }
                        });
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
};


//new api to get non-selected shifts by members
exports.nonSelectedShifts = (request, response) => {
  const { user_id } = request.body
 // SELECT s.shift_id, s.time_slot, s.vacancy FROM shifts s WHERE s.shift_id NOT IN (SELECT us.shift_id FROM user_shift us where us.user_id = 101);
  const statement1 = `SELECT s.shift_id, s.time_slot, s.vacancy FROM shifts s WHERE s.shift_id NOT IN (SELECT us.shift_id FROM user_shift us where us.user_id = ?)`
  db.pool.query(statement1, [user_id], (error, res) => {
    let count = res.length;
    if (error) {
      response.send(utility.createError(error));
    } else if (count == 0) {
      response.send(utility.createError("List of shifts is empty"));
    } else {
      response.send(utility.createResult(error, res));
    }
  });
};