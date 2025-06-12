'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule_timeFrame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule_timeFrame.init({
    //     - id
    // - id_doctor (fk)
    // - appointment_date
    id_timeFrame: DataTypes.STRING,
    id_schedule: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Schedule_timeFrame',
    freezeTableName: true
  });
  return Schedule_timeFrame;
};