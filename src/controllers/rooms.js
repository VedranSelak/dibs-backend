const db = require("../db/connection");
const { BadRequest } = require("../errors");
const { Op } = require("sequelize");

const Room = db.rooms;
const Invite = db.invites;
const User = db.users;
const Reservation = db.reservations;

const createRoom = async (req, res) => {
  const { id } = req.user;
  const { name, description, capacity, imageUrl, invites } = req.body;

  if (!name || !description || !capacity || !imageUrl || !invites) {
    throw new BadRequest("Please provide all the required data.", 400);
  }

  const roomData = {
    ownerId: id,
    name,
    description,
    capacity,
    imageUrl,
  };

  const room = await Room.create(roomData);

  const inviteObjects = invites.map((participantId) => {
    return {
      roomId: room.id,
      ownerId: id,
      userId: participantId,
    };
  });

  await Invite.bulkCreate(inviteObjects);

  res.status(201).json({ id: room.id });
};

const getRooms = async (req, res) => {
  const { id } = req.user;

  const rooms = await Invite.findAll({
    where: {
      userId: id,
      isAccepted: true,
    },
    attributes: [],
    include: [
      {
        model: Room,
        as: "room",
        include: {
          model: Invite,
          as: "invites",
          attributes: ["userId"],
          include: {
            model: User,
            as: "user",
            attributes: ["firstName", "lastName"],
          },
        },
      },
    ],
  });

  res.status(200).json(rooms);
};

const getYourRooms = async (req, res) => {
  const { id } = req.user;

  const rooms = await Room.findAll({
    where: {
      ownerId: id,
    },
    order: [["createdAt", "desc"]],
  });

  res.status(200).json(rooms);
};

const leaveRoom = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  await Invite.update(
    {
      isIgnored: true,
      isAccepted: false,
    },
    {
      where: {
        roomId: id,
        userId: userId,
      },
    }
  );

  res.status(200).json({ id: parseInt(id) });
};

const getRoomDetails = async (req, res) => {
  const { id } = req.params;

  const room = await Room.findOne({
    where: {
      id: id,
    },
    include: {
      model: User,
      as: "owner",
      attributes: ["firstName", "lastName", "imageUrl"],
    },
  });

  res.status(200).json(room);
};

const getYourRoom = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const millisecondsInMonth = 2629800000;

  const room = await Room.findOne({
    where: {
      id: id,
      ownerId: userId,
    },
    include: {
      model: Reservation,
      as: "reservations",
      seperate: true,
      where: {
        arrivalTimestamp: {
          [Op.gt]: Date.now(),
        },
      },
      order: [["arrivalTimestamp", "asc"]],
      limit: 1000,
      include: {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "imageUrl"],
      },
    },
  }).then(async (data) => {
    const recent = await Reservation.findAll({
      where: {
        isPrivate: true,
        roomId: id,
        arrivalTimestamp: {
          [Op.gt]: Date.now() - millisecondsInMonth,
          [Op.lt]: Date.now(),
        },
      },
      order: [["arrivalTimestamp", "desc"]],
      limit: 1000,
      include: {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "imageUrl"],
      },
    });
    data.setDataValue("recent", recent);
    return data;
  });

  res.status(200).json(room);
};

module.exports = {
  createRoom,
  getRooms,
  getYourRooms,
  leaveRoom,
  getRoomDetails,
  getYourRoom,
};
