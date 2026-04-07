import { Op, where } from "sequelize";
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

const getPatients = async (limit, page, value) => {
  try {
    if (!limit || !page) {
      return {
        err: 1,
        message: "Limit and page is required",
        data: [],
      };
    }

    let wherePatient = {};
    if (value) {
      wherePatient = {
        [Op.or]: [
          { fullName: { [Op.like]: `%${value}%` } },
          {
            phone: {
              [Op.like]: `%${value}%`,
            },
          },
        ],
      };
    }

    const { count, rows } = await db.Patient.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: wherePatient,
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: limit,
    });

    return {
      err: 0,
      message: "Get patients success!",
      data: rows,
      page: page,
      totalPage: Math.ceil(count / limit),
      totalData: count,
    };
  } catch (error) {
    console.log("Lỗi ở getPatients ", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
      data: [],
    };
  }
};

export { getPatientsByIdUser, getPatients };
