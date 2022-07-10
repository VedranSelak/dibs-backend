const { StatusCodes } = require("http-status-codes");
const { Sequelize } = require("../db/connection");
const db = require("../db/connection");
const { BadRequest, Unauthenticated } = require("../errors");

const Invite = db.invites;
const Room = db.rooms;
const User = db.users;

const getInvites = async (req, res) => {
  const { id } = req.user;

  const invites = await Room.findAll({
    order: [[{ model: Invite, as: "invites" }, "createdAt", "desc"]],
    include: [
      {
        model: Invite,
        as: "invites",
        where: {
          userId: id,
          isAccepted: false,
          isIgnored: false,
        },
        attributes: ["id"],
      },
      {
        model: User,
        as: "owner",
        attributes: ["firstName", "lastName", "imageUrl"],
      },
    ],
    raw: true,
    attributes: [
      ["id", "roomId"],
      "name",
      [Sequelize.col("invites.id"), "id"],
      [Sequelize.col("owner.firstName"), "firstName"],
      [Sequelize.col("owner.lastName"), "lastName"],
      [Sequelize.col("owner.imageUrl"), "imageUrl"],
    ],
  });

  console.log(invites);

  res.status(200).json(invites);
};

const respondToInvite = async (req, res) => {
  const { id: userId } = req.user;
  const { userResponse } = req.body;
  const { id } = req.params;

  if (typeof userResponse === "undefined" || userResponse === null) {
    throw new BadRequest("Please provide the required data", 400);
  }

  await Invite.update(
    {
      isAccepted: userResponse,
      isIgnored: !userResponse,
    },
    {
      where: {
        id: id,
        userId: userId,
      },
    }
  );

  res.status(200).json({ id: parseInt(id) });
};

const postInvites = async (req, res) => {
  const { id: userId } = req.user;
  const { invites } = req.body;
  const { id } = req.params;
  console.log(req.body);

  if (typeof invites === "undefined" || invites === null) {
    throw new BadRequest("Please provide the required data", 400);
  }

  const room = await Room.findOne({
    where: {
      ownerId: userId,
    },
  });

  if (!room) {
    throw new Unauthenticated("Not authorized for this room");
  }

  await Invite.bulkCreate(
    invites.map((invite) => {
      invite.ownerId = userId;
      return invite;
    })
  );

  res.status(StatusCodes.CREATED).json({ id: parseInt(id) });
};

module.exports = {
  getInvites,
  respondToInvite,
  postInvites,
};
