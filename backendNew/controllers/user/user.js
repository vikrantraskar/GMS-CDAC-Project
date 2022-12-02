const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");

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


//signin api
exports.signin = (request, response) => {
    const { email, password } = request.body;

    const encryptedPasswrd = String(cryptoJs.MD5(password));

    console.log(encryptedPasswrd);

    const statmente = `
                          select user_id, firstname, lastname, email, role_id, status from users where email = ? and password = ?
                      `;
    db.pool.query(statmente, [email, encryptedPasswrd], (error, users) => {
        const result = {};
        if (error) {
            result["status"] = "error";
            result["error"] = error;
        } else 
            {
                    if (users.length === 0) {
                        result["status"] = "error";
                        result["error"] = "user does not exist";
                    } else {
                        const user = users[0];

                        result["status"] = "success";
                const payload = { userID: user['user_id'],
                                  roleID: user['role_id'],    
                                }
                const token = jwt.sign(payload, config.secret)

        
                result["data"] = {
                    firstname: user['firstname'],
                    lastname: user['lastname'],
                    email: user['email'],
                    roleId: user['role_id'],
                    status: user['status'],
                    token,
                };
            }

            response.send(result);
        }
    });
};


// Get all package
exports.getAllPackages = (request, response)=> {
    const statement = ` select * from package `
  
    db.pool.query(
        statement,
        (error, result) => {
            if ( error ){
                response.send(utility.createError(error))
            }
            else{
                response.send(utility.createSuccess(result))
            }
        }
    )
  }

    // Get all shifts
exports.getAllShifts = (request, response)=> {
    const statement = ` select * from shifts `
  
    db.pool.query(
        statement,
        (error, result) => {
            if ( error ){
                response.send(utility.createError(error))
            }
            else{
                response.send(utility.createSuccess(result))
            }
        }
    )
  }

  //Contact us api
exports.contactus = (request, response) => {
    const { fullname, email,message } = request.body;
  
    //const encryptedPasswrd = String(cryptoJs.MD5(password));
  
    const statmente = `
                            Insert into contactus ( fullname, email, message) values(?,?,?)
                        `;
    db.pool.query(
      statmente,
      [fullname, email, message],
      (error, result) => {
        if (error) {
            response.send(utility.createError(error))
        } else {
          response.send(utility.createSuccess(result));
        }
      }
    );
  };

  
  