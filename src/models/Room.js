module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("room", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
		imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
		},
    capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  });

  return Room;
};
