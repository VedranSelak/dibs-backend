module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("image", {
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
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return Image;
};
