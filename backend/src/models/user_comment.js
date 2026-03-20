"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Comment.init(
    {
      userId: DataTypes.STRING,
      commentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Comment",
      tableName: "user_comment",
      freezeTableName: true,
    },
  );
  return User_Comment;
};
