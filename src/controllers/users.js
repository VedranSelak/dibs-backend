const db = require("../db/connection");
const { Op } = require("sequelize");

const User = db.users;

const searchUsers = async (req, res) => {
  const { search } = req.params;

  const users = await User.findAll({
    attributes: ["id", "firstName", "lastName"],
  }).then((users) => {
    return users.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
  });

  res.status(200).json(users);
};

module.exports = {
  searchUsers,
};
