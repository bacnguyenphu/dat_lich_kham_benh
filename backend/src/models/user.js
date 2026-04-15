"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Doctor, { foreignKey: "id_user", as: "doctor" });
      User.hasMany(models.Appointment, {
        foreignKey: "id_user",
        as: "appointment",
      });
      User.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
      });
      User.hasMany(models.Patient, {
        foreignKey: "id_user",
        as: "patient",
      });
      User.hasMany(models.Chat_room, {
        foreignKey: "receptionist_id",
        as: "managedRooms",
      });
      User.hasMany(models.Chat_room, {
        foreignKey: "customer_id",
        as: "customerRooms",
      });
      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "messages",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      role: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      gender: DataTypes.STRING,
      address: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
