module.exports = (sequelize, DataTypes) => {
  const PublicListing = sequelize.define("public_listing", {
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
    shortDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    detailedDescription: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  });

  return PublicListing;
};
