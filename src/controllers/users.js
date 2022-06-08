const db = require("../db/connection");
const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

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

const getAccountDetails = async (req, res) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: {
      id: id,
    },
    attributes: ["id", "firstName", "lastName", "imageUrl"],
  });

  res.status(200).json(user);
};

const patchUserDetails = async (req, res) => {
  const { id } = req.user;
  const { imageUrl } = req.body;

  await User.update(
    {
      imageUrl: imageUrl,
    },
    {
      where: {
        id: id,
      },
    }
  );

  res.status(StatusCodes.CREATED).json({ id: id });
};

module.exports = {
  searchUsers,
  getAccountDetails,
  patchUserDetails,
};
