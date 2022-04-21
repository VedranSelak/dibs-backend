const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { BadRequest } = require("../errors");

const getAllUsers = (req, res) => {
  console.log(req.user);
  User.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving",
      });
    } else {
      res.send(data);
    }
  });
};

const registerUser = (req, res) => {
  const { email, first_name, last_name, password, status, type } = req.body;

  if (!email || !first_name || !last_name || !password || !status || !type) {
    throw new BadRequest("Please provide all the required fields");
  }

  const user = new User({
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: password,
    status: status,
    type: type,
  });

  User.create(user, (err, data) => {
    if (err) {
      throw err;
    } else {
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      res.status(201).json({ accessToken });
    }
  });
};

module.exports = {
  getAllUsers,
  registerUser,
};
