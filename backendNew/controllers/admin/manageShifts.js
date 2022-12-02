const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();


// add new shifts 
exports.addNewShifts = (request, response) => {
    const { time_slot, vacancy } = request.body
    const statement = `
                      INSERT INTO shifts (time_slot, vacancy)
                      VALUES (?, ?)
                      `
    db.pool.query(statement, [time_slot, vacancy], (error, note) => {
      if (error) {
        response.send(utility.createError("Shift already exist"))
      } else {
        response.send(utility.createSuccess(note))
      }
    })
  }

// update specific shifts
exports.updateSpecificShifts = (request, response) => {
    const { shift_id } = request.params
    const { time_slot, vacancy } = request.body
  
    const statement1 = ` select case when exists
                          ( select * from shifts where shift_id = ? )
                          then 'true'
                          else 'false'
                          end
                          as bool`;
  
    let isExist
    db.pool.query(
      statement1,
      [shift_id],
      (error, data) => {
        isExist = data[0].bool
        if (error) {
          response.send(utility.createError(error))
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong id"))
        } else {
          const statement = `
                            UPDATE shifts
                            SET time_slot = ?, vacancy = ?
                            WHERE shift_id = ?;
                            `
          db.pool.query(statement, [time_slot, vacancy, shift_id], (error, result) => {
            response.send(utility.createResult(error, result))
          })
        }
      })
  }
  
  // remove specific shifts
  exports.removeSpecificShifts = (request, response) => {
    const { shift_id } = request.params
  
    const statement1 = ` select case when exists
                        ( select * from shifts where shift_id = ?)
                        then 'true'
                        else 'false'
                        end
                        as bool`;
    let isExist
    db.pool.query(
      statement1,
      [shift_id],
      (error, data) => {
        isExist = data[0].bool
        if (error) {
          response.send(utility.createError(error))
        } else if (isExist == "false") {
          response.send(utility.createError("You have entered wrong id"))
        } else {
          const statement = `
      DELETE from shifts WHERE shift_id = ?
      `
          db.pool.query(statement, [shift_id], (error, result) => {
            response.send(utility.createResult(error, result))
          })
        }
      }
    )
  }