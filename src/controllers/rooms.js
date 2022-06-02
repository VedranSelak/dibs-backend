const db = require("../db/connection");
const { BadRequest } = require("../errors");

const Room = db.rooms;
const Invite = db.invites;

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

module.exports = {
  createRoom,
};
