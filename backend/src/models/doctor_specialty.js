'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty_doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Specialty_doctor.init({
        id_doctor: DataTypes.STRING,
        id_specialty: DataTypes.STRING,
        
    }, {
        sequelize,
        modelName: 'Specialty_doctor',
    });
    return Specialty_doctor;
};