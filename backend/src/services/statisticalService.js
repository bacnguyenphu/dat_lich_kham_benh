const db = require("../models");

const getDoctorCount = async () => {
  try {
    const count = await db.Doctor.count();
    return {
      err: 0,
      message: "Get doctor count success!",
      data: count,
    };
  } catch (error) {
    console.error("Error getting doctor count:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getAppointmentCount = async () => {
  try {
    const count = await db.Appointment.count();
    return {
      err: 0,
      message: "Get appointment count success!",
      data: count,
    };
  } catch (error) {
    console.error("Error getting appointment count:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getUserCount = async () => {
  try {
    const count = await db.User.count({
      where: { role: "R3" },
    });
    return {
      err: 0,
      message: "Get user count success!",
      data: count,
    };
  } catch (error) {
    console.error("Error getting user count:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getMedicalPackageCount = async () => {
  try {
    const count = await db.Medical_package.count();
    return {
      err: 0,
      message: "Get medical package count success!",
      data: count,
    };
  } catch (error) {
    console.error("Error getting medical package count:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getStatistics = async () => {
  try {
    const [doctorCount, appointmentCount, userCount, medicalPackageCount] =
      await Promise.all([
        getDoctorCount(),
        getAppointmentCount(),
        getUserCount(),
        getMedicalPackageCount(),
      ]);

    // Kiểm tra nếu có lỗi trong bất kỳ count nào
    if (
      doctorCount.err !== 0 ||
      appointmentCount.err !== 0 ||
      userCount.err !== 0 ||
      medicalPackageCount.err !== 0
    ) {
      return {
        err: -999,
        message: "Error getting some statistics",
      };
    }

    return {
      err: 0,
      message: "Get statistics success!",
      data: {
        doctors: doctorCount.data,
        appointments: appointmentCount.data,
        users: userCount.data,
        medicalPackages: medicalPackageCount.data,
      },
    };
  } catch (error) {
    console.error("Error getting statistics:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

module.exports = {
  getDoctorCount,
  getAppointmentCount,
  getUserCount,
  getMedicalPackageCount,
  getStatistics,
};
