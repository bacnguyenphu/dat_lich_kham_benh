"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat_room.belongsTo(models.User, {
        foreignKey: "customer_id",
        as: "customer",
      });
      Chat_room.belongsTo(models.User, {
        foreignKey: "receptionist_id",
        as: "receptionist",
      });
      Chat_room.hasMany(models.Message, {
        foreignKey: "chat_room_id",
        as: "messages",
      });
    }
  }
  Chat_room.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      customer_id: DataTypes.STRING,
      receptionist_id: DataTypes.STRING,
      status: DataTypes.STRING,
      last_message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Chat_room",
      tableName: "chat_room",
      freezeTableName: true,
    },
  );
  return Chat_room;
};
