const express = require("express");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const db = require("../../db");
const utility = require("../../utils/utils");
const config = require("../../config");
const moment = require("moment");

const router = express.Router();


//admin signup api
exports.adminSignUp = (request, response) => {
    const { firstname, lastname, mobile, age, gender, email, password, role_id } =
      request.body;
  
    const encryptedPasswrd = String(cryptoJs.MD5(password));
  
    const statmente = `
                          Insert into users ( firstname, lastname, mobile, age, gender, email, password, role_id ) values( ?, ?, ?, ?, ?, ?, ?, ?)
                      `;
    db.pool.query(
      statmente,
      [firstname, lastname, mobile, age, gender, email, encryptedPasswrd, role_id],
      (error, result) => {
        response.send(utility.createResult(error, result));
      }
    );
  }