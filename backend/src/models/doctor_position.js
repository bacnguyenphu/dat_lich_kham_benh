'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Position_doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Position_doctor.init({

        id_doctor: DataTypes.STRING,
        id_position: DataTypes.STRING,
        
    }, {
        sequelize,
        modelName: 'Position_doctor',
    });
    return Position_doctor;
};