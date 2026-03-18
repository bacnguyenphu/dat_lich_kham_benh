"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Doctor, {
        foreignKey: "targetId",
        constraints: false,
      });
      Comment.belongsTo(models.Medical_package, {
        foreignKey: "targetId",
        constraints: false,
      });
      Comment.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        constraints: false,
      });
      Comment.belongsToMany(models.User, {
        through: models.User_Comment,
        foreignKey: "commentId",
        as: "users",
      });
    }
  }
  Comment.init(
    {
      content: DataTypes.TEXT("medium"),
      userId: DataTypes.STRING,
      appointmentId: DataTypes.STRING,
      targetId: DataTypes.STRING,
      targetType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
