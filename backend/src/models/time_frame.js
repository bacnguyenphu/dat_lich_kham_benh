'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Time_frame extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Time_frame.init({
        // - id
        // - time_frame
        // - id_schedule(fk)

        time_frame: DataTypes.STRING,
        id_schedule: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Time_frame',
    });
    return Time_frame;
};