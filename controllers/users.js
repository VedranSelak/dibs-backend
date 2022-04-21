const User = require("../models/users");

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

module.exports = {
  getAllUsers,
};
