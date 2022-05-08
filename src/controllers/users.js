const db = require("../db/connection");

const User = db.users;
const PublicListing = db.publicListings;

const getAllUsers = async (req, res) => {
  const users = await User.findAll({});
  res.status(200).json({ users });
};

module.exports = {
  getAllUsers,
};
