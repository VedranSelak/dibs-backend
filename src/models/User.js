module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  });

  return User;
};
