module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define(
    "spot",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      listingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      availableSpots: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Spot;
};
