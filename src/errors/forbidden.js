const CustomAPIError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class Forbidden extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Forbidden;
