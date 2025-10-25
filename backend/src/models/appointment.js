'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Appointment.belongsTo(models.Doctor,{foreignKey:'id_doctor', as:'doctor'})
            Appointment.belongsTo(models.Medical_package,{foreignKey:'id_medical_package', as:'medical_package'})
        }
    }
    Appointment.init({
        // - id
        // - id_doctor (fk)
        // - id_patient (fk)
        // - id_medical_package (fk)
        // - appointment_date
        // - time
        // - status

        id_doctor: DataTypes.STRING,
        id_patient: DataTypes.STRING,
        id_medical_package: DataTypes.STRING,
        appointment_date: DataTypes.DATE,
        time: DataTypes.STRING,
        status: DataTypes.INTEGER,
        payment_status:DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Appointment',
    });
    return Appointment;
};