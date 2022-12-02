const jwt = require('jsonwebtoken');
const utils = require('../utils/utils')

module.exports = (request, response, next) => {
  try {
    const roleId = request.roleId
      if (roleId === 1 ) {
        next()
      } else {
        response.send(utils.createResult("you don't have access to this api"));
      }
      //carry this reuest object to next calls
     
    } catch (ex) {
    response.send(utils.createResult("invalid token"))
  }
}