const jwt = require('jsonwebtoken');
const utils = require('../utils/utils')
const config = require('../config')

module.exports = (request, response, next) => {

  try {
    //extract token fro request headers
    const token = request.headers['token'];
    console.log("check token : "+token)
    //check for token
    if (token.length === 0 || !token) {
      utils.createResult("missing token")
    }
    else {
      //authenticate token
      const payload = jwt.verify(token, config.secret)

      //assign token userID to request object
      request.userID = payload.userID
      request.roleId = payload.roleID
      //carry this reuest object to next calls
      next()
    }
  } catch (ex) {
    response.send(utils.createResult("invalid token check auth"))
  }
}