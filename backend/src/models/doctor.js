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

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    description: DataTypes.STRING,
    id_specialty: DataTypes.STRING,
    id_description_detail: DataTypes.STRING,
    id_position: DataTypes.STRING,
    gender: DataTypes.STRING,
    price: DataTypes.FLOAT,
    avatar: DataTypes.BLOB,
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};