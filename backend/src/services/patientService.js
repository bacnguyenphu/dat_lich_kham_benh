import db from "../models/index";

const getPatientsByIdUser = async (idUser) => {
  try {
    if (!idUser) {
      return {
        err: 1,
        message: "ID user is required",
        data: [],
      };
    }

    const patients = await db.Patient.findAll({
      where: { id_user: idUser },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      message: "Get patients by user success!",
      data: patients,
    };
  } catch (error) {
    console.log("Lỗi ở getPatientsByIdUser: ", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
      data: [],
    };
  }
};

export { getPatientsByIdUser };
