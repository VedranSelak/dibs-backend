module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "reservation",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      listingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      spotId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      arrivalTimestamp: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
      },
      stayApprox: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
      },
      numOfParticipants: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Reservation;
};
