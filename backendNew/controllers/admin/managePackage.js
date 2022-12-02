const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();


// add new package
exports.addNewPackage = (request, response) => {
    const { package_name, package_amount, duration } = request.body
    const statement = `
      INSERT INTO package (package_name, package_amount, duration)
      VALUES (?, ?, ?)
      `
    db.pool.query(statement, [package_name, package_amount, duration], (error, note) => {
      if (error) {
        response.send(utility.createError("Package already exist"))
      } else {
        response.send(utility.createSuccess(note))
      }
    })
  }

  // update specific package 
exports.updateSpecificPackage = (request, response) => {
    const { package_id } = request.params
    const { package_name, package_amount, duration } = request.body
  
    const statement1 = ` select case when exists
                          ( select * from package where package_id = ?)
                          then 'true'
                          else 'false'
                          end
                          as bool`;
    let isExist
    db.pool.query(
      statement1,
      [package_id],
      (error, data) => {
        isExist = data[0].bool
        if (error) {
          response.send(utility.createError(error))
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong id"))
        } else {
          const statement = `
      UPDATE package
      SET package_name = ?, package_amount = ?, duration = ?
      WHERE package_id = ?;
      `
          db.pool.query(statement, [package_name, package_amount, duration, package_id], (error, result) => {
            response.send(utility.createResult(error, result))
          })
        }
      }
    )
  }

// remove specific package
exports.removeSpecificPackage = (request, response) => {
    const { package_id } = request.params
  
    const statement1 = ` select case when exists
                        ( select * from package where package_id = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;
    let isExist
    db.pool.query(
      statement1,
      [package_id],
      (error, data) => {
        isExist = data[0].bool
        if (error) {
          response.send(utility.createError(error))
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong package id"))
        } else {
          const statement = `
            DELETE from package WHERE package_id = ?
            `
          db.pool.query(statement, [package_id], (error, result) => {
            response.send(utility.createResult(error, result))
            console.log(data)
          })
        }
      }
    )
  }

