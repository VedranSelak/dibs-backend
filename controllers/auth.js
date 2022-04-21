const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { BadRequest, CustomAPIError } = require("../errors");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { email, first_name, last_name, password, status, type } = req.body;

  if (!email || !first_name || !last_name || !password || !status || !type) {
    throw new BadRequest("Please provide all the required fields");
  }

  const hashedPassword = await User.hashPassword(password);

  const user = new User({
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: hashedPassword,
    status: status,
    type: type,
  });

  User.create(user, (err, data) => {
    if (err) {
      throw err;
    } else {
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });
      // const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
      res.status(201).json({ accessToken });
    }
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequest("Please provide all the required fields"));
    return;
  }

  User.login({ email, password }, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    res.status(StatusCodes.OK).json({ accessToken });
  });
};

module.exports = {
  register,
  login,
};
