const db = require("../db/connection");
const { BadRequest } = require("../errors");

const Room = db.rooms;

const createRoom = async (req, res) => {
  const { id } = req.user;
  const { name, description, capacity, imageUrl } = req.body;

  if (!name || !description || !capacity || !imageUrl) {
    throw new BadRequest("Please provide all the required fields.", 400);
  }

  const roomData = {
    ownerId: id,
    name,
    description,
    capacity,
    imageUrl,
  };

  const room = await Room.create(roomData);

  res.status(201).json({ id: room.id });
};

module.exports = {
  createRoom,
};
