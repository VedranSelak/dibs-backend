const db = require("../db/connection");
const { StatusCodes } = require("http-status-codes");

const User = db.users;
const Reservation = db.reservations;
const Room = db.rooms;
const PublicListing = db.publicListings;

const searchUsers = async (req, res) => {
  const { search } = req.params;

  const users = await User.findAll({
    attributes: ["id", "firstName", "lastName", "imageUrl"],
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
    attributes: ["id", "firstName", "lastName", "imageUrl", "type"],
    include: [
      {
        model: Reservation,
        as: "reservations",
        attributes: ["id"],
      },
      {
        model: Room,
        as: "rooms",
        attributes: ["id"],
      },
    ],
  });

  user.setDataValue("roomsCount", user.rooms.length);
  user.setDataValue("reservationsCount", user.reservations.length);

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

const getHasListing = async (req, res) => {
  const { id } = req.user;

  const listing = await PublicListing.findOne({
    where: {
      ownerId: id,
    },
  });

  if (listing) {
    res.status(StatusCodes.OK).json({ hasListing: true });
  } else {
    res.status(StatusCodes.OK).json({ hasListing: false });
  }
};

module.exports = {
  searchUsers,
  getAccountDetails,
  patchUserDetails,
  getHasListing,
};
