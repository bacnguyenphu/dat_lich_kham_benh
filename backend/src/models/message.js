"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Chat_room, {
        foreignKey: "chat_room_id",
        as: "chat_room",
      });
      // Assuming sender_id can be from User or Patient, but for now, associate with User
      Message.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
      });
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      chat_room_id: DataTypes.STRING,
      sender_id: DataTypes.STRING,
      content: DataTypes.TEXT,
      sender_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
    },
  );
  return Message;
};
