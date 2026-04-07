import { col, fn, Op, Sequelize, where } from "sequelize";
import db from "../models/index";
import time_frame from "../models/time_frame";
import { v4 as uuidv4 } from "uuid";

const getInfoToMakeAppointment = async (data) => {
  try {
    if (!data?.idDoctor && !data?.idMedicalPackage) {
      return {
        err: 1,
        message: "ID doctor or medical package is required !",
      };
    }
    if (!data.appointment_date) {
      return {
        err: 2,
        message: "Appoinment date is required !",
      };
    }
    if (!time_frame) {
      return {
        err: 3,
        message: "time_frame is required !",
      };
    }
    const timeFrame = await db.Time_frame.findOne({
      where: { id: data?.time_frame },
    });

    if (data?.idDoctor) {
      const doctor = await db.Doctor.findOne({
        where: { id: data?.idDoctor },
        attributes: ["id", "description", "price"],
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "avatar"],
          },
          {
            model: db.Position,
            as: "position",
            attributes: ["name", "id"],
            through: { attributes: [] },
          },
        ],
      });

      return {
        err: 0,
        message: "Get success !",
        data: {
          doctor,
          time_frame: timeFrame.time_frame,
          appointment_date: data?.appointment_date,
        },
      };
    }

    if (data?.idMedicalPackage) {
      const Medical_package = await db.Medical_package.findOne({
        where: { id: data.idMedicalPackage },
        attributes: ["id", "image", "price", "name"],
      });

      return {
        err: 0,
        message: "Get success !",
        data: {
          Medical_package,
          time_frame: timeFrame.time_frame,
          appointment_date: data?.appointment_date,
        },
      };
    }
  } catch (error) {
    console.log("Lỗi ở getInfoToMakeAppointment :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const createAppointment = async (data) => {
  try {
    const t = await db.sequelize.transaction();
    if (!data.idDoctor && !data.idMedicalPackage) {
      return {
        err: 1,
        message: "ID doctor or medical package is required !",
      };
    }
    if (!data.appointment_date) {
      return {
        err: 2,
        message: "Appoinment is required !",
      };
    }
    if (!data.id_user) {
      return {
        err: 3,
        message: "ID user is required !",
      };
    }
    if (!data.time_frame) {
      return {
        err: 4,
        message: "Time is required !",
      };
    }

    if (data.patient?.id) {
      const duplicatePatient = await db.Appointment.findOne({
        where: {
          id_patient: data.patient.id,
          time: data.time_frame,
          [Op.and]: where(
            fn("DATE", col("appointment_date")),
            "=",
            data.appointment_date,
          ),
          status: { [Op.ne]: 0 },
        },
        transaction: t,
      });
      if (duplicatePatient)
        return {
          err: 5,
          message: "You already have an appointment at this time.",
        };
    }

    if (data.idDoctor) {
      const currentBookingsCount = await db.Appointment.count({
        where: {
          id_doctor: data.idDoctor,
          time: data.time_frame,
          [Op.and]: where(
            fn("DATE", col("appointment_date")),
            "=",
            data.appointment_date,
          ),
          status: { [Op.ne]: 0 }, // Không tính những lịch đã bị hủy
        },
        transaction: t,
      });

      const MAX_PATIENTS_PER_SLOT = 3;

      if (currentBookingsCount >= MAX_PATIENTS_PER_SLOT) {
        return {
          err: 6,
          message: `Khung giờ này đã kín chỗ (Tối đa ${MAX_PATIENTS_PER_SLOT} bệnh nhân). Vui lòng chọn giờ khác.`,
        };
      }
    }

    let idPatient = data?.patient?.id;

    if (!idPatient) {
      idPatient = uuidv4();
      await db.Patient.create(
        {
          id: idPatient,
          id_user: data?.id_user,
          fullName: data.patient?.fullName,
          phone: data.patient?.phone,
          email: data.patient?.email,
          dateOfBirth: data.patient?.dateOfBirth,
          gender: data.patient?.gender,
          address: data.patient?.address,
        },
        { transaction: t },
      );
    } else {
      if (idPatient !== data?.id_user && data?.patient) {
        await db.Patient.update(
          {
            fullName: data.patient?.fullName,
            phone: data.patient?.phone,
            address: data.patient?.address,
            email: data.patient?.email,
            dateOfBirth: data.patient?.dateOfBirth,
            gender: data.patient?.gender,
          },
          {
            where: { id: idPatient },
            transaction: t,
          },
        );
      }
    }

    await db.Appointment.create(
      {
        id: uuidv4(),
        id_doctor: data?.idDoctor,
        id_user: data?.id_user,
        id_patient: idPatient,
        id_medical_package: data?.idMedicalPackage,
        appointment_date: data?.appointment_date,
        time: data?.time_frame,
        status: data?.status,
        payment_status: data?.payment_status || false,
        isCheckIn: data?.isCheckIn || false,
        diseaseDescription: data?.diseaseDescription || "",
      },
      { transaction: t },
    );

    // LƯU TOÀN BỘ VÀO DB
    await t.commit();

    return {
      err: 0,
      message: "Create appointment success !",
    };
  } catch (error) {
    await t.rollback();
    console.log("Lỗi ở createAppointment:", error);
    return { err: -999, message: `Error server: ${error.message}` };
  }
};

const getAppointmentOfUser = async (idUser, limit, page) => {
  try {
    if (!idUser) {
      return {
        err: 1,
        message: "ID user required",
      };
    }

    const { count, rows } = await db.Appointment.findAndCountAll({
      where: { id_user: idUser },
      attributes: [
        "id",
        "appointment_date",
        "time",
        "status",
        "payment_status",
        "createdAt",
      ],
      include: [
        {
          model: db.Doctor,
          as: "doctor",
          attributes: ["id", "price"],
          include: [
            {
              model: db.Position,
              as: "position",
              attributes: ["name", "id"],
              through: { attributes: [] },
            },
            {
              model: db.User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "avatar"],
            },
          ],
        },
        {
          model: db.Medical_package,
          as: "medical_package",
          attributes: ["id", "image", "price", "name"],
        },
        {
          model: db.Patient,
          as: "patient",
          attributes: [
            "id",
            "fullName",
            "phone",
            "email",
            "dateOfBirth",
            "gender",
            "address",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: limit,
      distinct: true,
      // subQuery: false,
    });

    if (rows.length === 0) {
      return {
        err: 0,
        message: "Get appointment of user success !",
        data: [],
        page: 1,
        totalPage: 0,
      };
    }

    return {
      err: 0,
      message: "Get appointment of user success !",
      data: rows,
      page: page,
      totalPage: Math.ceil(count / limit),
      totalData: count,
    };
  } catch (error) {
    console.log("Lỗi ở getAppointmentOfUser :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const updateStatusAppointment = async (idAppointment, status) => {
  try {
    if (!idAppointment) {
      return {
        err: 1,
        message: "ID appointment required",
      };
    }

    const appointment = await db.Appointment.findOne({
      where: { id: idAppointment },
    });

    if (!appointment) {
      return {
        err: 2,
        message: "Appointment is not exist",
      };
    }

    await db.Appointment.update(
      {
        status: status,
      },
      {
        where: { id: idAppointment },
      },
    );

    return {
      err: 0,
      message: "Update status appointment success !",
    };
  } catch (error) {
    console.log("Lỗi ở deleteAppointment :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getAppointments = async (
  idDoctor,
  limit = 10,
  page = 1,
  value,
  filter,
  date,
  is_check_in,
) => {
  try {
    if (filter === undefined || filter === null || filter === "") {
      return { err: 1, message: "Filter is required" };
    }

    // Ép kiểu an toàn cho phân trang
    const limitData = parseInt(limit, 10);
    const pageData = parseInt(page, 10);

    let whereAppointment = {};
    let wherePatientSearch = {}; // Đổi tên biến cho rõ nghĩa

    if (idDoctor) {
      whereAppointment.id_doctor = idDoctor;
    }

    if (is_check_in !== "ALL") {
      whereAppointment.isCheckIn = is_check_in === "true" ? true : false;
    }

    if (+filter !== 99) {
      whereAppointment.status = +filter;
    }

    if (date) {
      whereAppointment[Op.and] = where(
        fn("DATE", col("appointment_date")),
        "=",
        date,
      );
    }

    if (value) {
      wherePatientSearch = {
        [Op.or]: [
          { fullName: { [Op.like]: `%${value}%` } },
          { phone: { [Op.like]: `%${value}%` } },
        ],
      };
    }

    const { count, rows } = await db.Appointment.findAndCountAll({
      where: whereAppointment,
      attributes: [
        "id",
        "appointment_date",
        "time",
        "status",
        "payment_status",
        "createdAt",
        "isCheckIn",
        "diseaseDescription",
      ],
      include: [
        {
          model: db.Doctor,
          as: "doctor",
          attributes: ["id", "price"],
          include: [
            {
              model: db.Position,
              as: "position",
              attributes: ["name", "id"],
              through: { attributes: [] },
            },
            {
              model: db.User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "avatar"],
            },
          ],
        },
        {
          // Vẫn include User để biết AI LÀ NGƯỜI ĐẶT
          model: db.User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "phone"],
        },
        {
          model: db.Patient,
          as: "patient",
          attributes: [
            "id",
            "fullName",
            "phone",
            "email",
            "dateOfBirth",
            "gender",
          ],
          where: value ? wherePatientSearch : undefined,
        },
      ],
      order: [
        ["appointment_date", "DESC"],
        ["time", "ASC"],
      ],
      offset: (pageData - 1) * limitData,
      limit: limitData,
      subQuery: false,
      distinct: true,
    });

    if (rows.length === 0) {
      return {
        err: 0,
        message: "No appointments found.",
        data: [],
        page: pageData,
        totalPage: 0,
      };
    }

    return {
      err: 0,
      message: "Get appointments success !",
      data: rows,
      page: pageData,
      totalPage: Math.ceil(count / limitData),
      totalData: count,
    };
  } catch (error) {
    console.log("Lỗi ở getAppointments :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getPatientOfDoctor = async (
  idDoctor,
  limit = 7,
  page = 1,
  value = null,
) => {
  try {
    if (!idDoctor) {
      return {
        err: 1,
        message: "ID doctor required",
      };
    }

    let whereUser = {};
    if (value) {
      whereUser = {
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

    const { count, rows } = await db.Appointment.findAndCountAll({
      where: {
        [Op.and]: [{ id_doctor: idDoctor }, { status: 3 }],
      },
      attributes: [
        "id_patient",
        [Sequelize.fn("COUNT", Sequelize.col("Appointment.id")), "visitCount"],
      ],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["firstName", "lastName", "address", "phone"],
        },
        {
          model: db.Patient,
          as: "patient",
          attributes: [
            "id",
            "fullName",
            "phone",
            "email",
            "dateOfBirth",
            "gender",
          ],
          where: whereUser,
        },
      ],
      group: ["id_patient"],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: limit,
      subQuery: false,
    });

    if (rows.length === 0) {
      return {
        err: 0,
        message: "No patients found for this doctor.",
        data: [],
        page: 1,
        totalPage: 0,
      };
    }

    return {
      err: 0,
      message: "Get patients of doctor success !",
      data: rows,
      page: page,
      totalPage: Math.ceil(count.length / limit),
      totalData: count.length,
    };
  } catch (error) {
    console.log("Lỗi ở getPatientOfDoctor :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getAppointmentById = async (idAppointment) => {
  try {
    if (!idAppointment) {
      return {
        err: 1,
        message: "ID appointment required",
      };
    }

    const appointment = await db.Appointment.findOne({
      where: { id: idAppointment },
      attributes: [
        "id",
        "appointment_date",
        "time",
        "status",
        "payment_status",
      ],
      include: [
        {
          model: db.Doctor,
          as: "doctor",
          attributes: ["id", "price"],
          include: [
            {
              model: db.Position,
              as: "position",
              attributes: ["name", "id"],
              through: { attributes: [] },
            },
            {
              model: db.User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "avatar"],
            },
          ],
        },
        {
          model: db.Medical_package,
          as: "medical_package",
          attributes: ["id", "image", "price", "name"],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "phone"],
        },
        {
          model: db.Patient,
          as: "patient",
          attributes: [
            "id",
            "fullName",
            "phone",
            "email",
            "dateOfBirth",
            "gender",
          ],
        },
      ],
    });

    if (!appointment) {
      return {
        err: 2,
        message: "Appointment is not exist",
      };
    }

    return {
      err: 0,
      message: "Get appointment by id success !",
      data: appointment,
    };
  } catch (error) {
    console.log("Lỗi ở getAppointmentById :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const paymentConfirmation = async (idAppointment) => {
  try {
    if (!idAppointment) {
      return {
        err: 1,
        message: "ID appointment required",
      };
    }

    const appointment = await db.Appointment.findOne({
      where: { id: idAppointment },
    });

    if (!appointment) {
      return {
        err: 2,
        message: "Appointment is not exist",
      };
    }

    appointment.payment_status = true;
    await appointment.save();

    return {
      err: 0,
      message: "Payment confirmed successfully !",
      data: appointment,
    };
  } catch (error) {
    console.log("Lỗi ở paymentConfirmation :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const chekInConfirmation = async (idAppointment, isCheckIn) => {
  try {
    if (!idAppointment) {
      return {
        err: 1,
        message: "ID appointment required",
      };
    }

    if (isCheckIn === undefined || isCheckIn === null) {
      return {
        err: 2,
        message: "isCheckIn is required",
      };
    }

    const appointment = await db.Appointment.findOne({
      where: { id: idAppointment },
    });

    if (!appointment) {
      return {
        err: 3,
        message: "Appointment is not exist",
      };
    }

    appointment.isCheckIn = isCheckIn;
    await appointment.save();

    return {
      err: 0,
      message: "Check-in status updated successfully !",
      data: appointment,
    };
  } catch (error) {
    console.log("Lỗi ở chekInConfirmation :", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

export {
  getInfoToMakeAppointment,
  createAppointment,
  getAppointmentOfUser,
  paymentConfirmation,
  updateStatusAppointment,
  getAppointments,
  getPatientOfDoctor,
  getAppointmentById,
  chekInConfirmation,
};
