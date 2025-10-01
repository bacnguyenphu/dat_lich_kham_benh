'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User,{foreignKey:'id_user', as:'user'})
      Doctor.belongsTo(models.Description_detail,{foreignKey:'id_description_detail', as:'description_detail'})
      Doctor.belongsToMany(models.Position,{through:'Position_doctor', as:'position',foreignKey:'id_doctor'})
      Doctor.belongsToMany(models.Specialty,{through:'Specialty_doctor', as:'specialty',foreignKey:'id_doctor'})
      Doctor.hasMany(models.Schedule,{foreignKey:'id_doctor',as:'doctor'})
      Doctor.hasMany(models.Appointment,{foreignKey:'id_doctor',as:'appointment'})
    }
  }
  Doctor.init({
//     - id
// - firstname
// - fullname
// - phone
// - description
// - avatar
// - specialty_id (fk)
// - id_description_detail (fk)
// - id_position
// - price

    description: DataTypes.STRING,
    id_description_detail: DataTypes.STRING,
    id_user: DataTypes.STRING,
    price: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};