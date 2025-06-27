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
      Schedule.belongsTo(models.Doctor,{foreignKey:'id_doctor', as:'schedule'})
      Schedule.belongsToMany(models.Time_frame,{through:'Schedule_timeFrame', as:'time_frame',foreignKey:'id_schedule'})
    }
  }
  Schedule.init({
    //     - id
    // - id_doctor (fk)
    // - appointment_date
    id_doctor: DataTypes.STRING,
    appointment_date: DataTypes.DATE,
    id_medical_package: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};