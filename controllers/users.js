const User = require("../models/users");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = (req, res) => {
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
  if (!req.body) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }

  const { email, first_name, last_name, password, status, type } = req.body;

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
      res.status(500).send({
        message: err.message || "Error occured during registration",
      });
    } else {
      res.status(201).json(data);
    }
  });
};

module.exports = {
  getAllUsers,
  registerUser,
};
