module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define("invite", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isIgnored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return Invite;
};
