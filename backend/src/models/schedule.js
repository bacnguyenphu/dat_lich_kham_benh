'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule.init({
    //     - id
    // - id_doctor (fk)
    // - appointment_date
    id_doctor: DataTypes.STRING,
    appointment_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};