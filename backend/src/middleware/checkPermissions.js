import {
  CHANGE_PASSWORD_DOCTOR,
  CREATE_APPOINTMENT,
  CREATE_OR_UPDATE_SCHEDULE,
  GET_APPOINTMENTS,
  GET_APPOINTMENT_OF_USER,
  GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR,
  GET_CATEGORY_PACKAGE,
  GET_CATEGORY_PACKAGE_BY_ID,
  GET_DOCTOR_FOLLOW_SPECIALTY,
  GET_DOCTORS,
  GET_DOCTORS_BY_ID,
  GET_INFOR_MAKE_APPOINTMENT,
  GET_MEDICAL_PACKAGE,
  GET_MEDICAL_PACKAGE_BY_ID,
  GET_MEDICAL_PACKAGE_FOLLOW_CATEGORY,
  GET_PATIENT_OF_DOCTOR,
  GET_POSITION_BY_ID,
  GET_POSITIONS,
  GET_SCHEDULE_FOLLOW_DATE,
  GET_SCHEDULE_OF_DOCTOR,
  GET_SPECIALTIES,
  GET_SPECIALTY_BY_ID,
  GET_TIMEFRAMES,
  GET_USER_BY_ID,
  LOGIN,
  LOGIN_DOCTOR,
  LOGIN_RECEPTIONIST,
  LOGOUT,
  REFRESH_TOKEN,
  REGISTER,
  SEARCH,
  UPDATE_DOCTOR,
  UPDATE_STATUS_APPOINTMENT,
  CREATE_COMMENT,
  GET_COMMENTS,
  GET_COMMENTS_BY_APPOINTMENT_ID,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  STATISTICAL,
  GET_APPOINTMENT_BY_ID,
  PAYMENT_CONFIRMATION,
  UPDATE_USER,
  GET_PATIENTS_BY_ID_USER,
  CHECK_IN_CONFIRMATION,
  GET_PATIENTS,
  GET_APPOINTMENT_OF_PATIENT,
  GET_MEDICAL_PACKAGE_FOLLOW_ID_DOCTOR,
  GET_ALL_PATIENT,
  GET_HISTORY_CHAT_BY_CUSTOMER,
  GET_HISTORY_CHAT_BY_RECEPTIONIST,
} from "../utils/routeUrlApi";
import { checkUserJWT, verifyJWT } from "./JWTaction";

// R1:admin, R2:doctor, R3:user, R4:staff
const ROLE_PERMISSIONS = {
  //admin: full quyền nên mặc định được next()
  R2: [
    GET_APPOINTMENTS,
    UPDATE_STATUS_APPOINTMENT,
    GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR,
    GET_PATIENT_OF_DOCTOR,
    CREATE_OR_UPDATE_SCHEDULE,
    CHANGE_PASSWORD_DOCTOR,
    UPDATE_DOCTOR,
    CREATE_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT,
    GET_APPOINTMENT_BY_ID,
  ], // bác sĩ
  R4: [
    GET_APPOINTMENTS,
    UPDATE_STATUS_APPOINTMENT,
    GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR,
    CREATE_OR_UPDATE_SCHEDULE,
    CREATE_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT,
    STATISTICAL,
    GET_APPOINTMENT_BY_ID,
    PAYMENT_CONFIRMATION,
    GET_PATIENTS_BY_ID_USER,
    CHECK_IN_CONFIRMATION,
    GET_HISTORY_CHAT_BY_CUSTOMER,
    GET_HISTORY_CHAT_BY_RECEPTIONIST,
  ], // nhân viên
  R3: [
    CREATE_APPOINTMENT,
    GET_APPOINTMENT_OF_USER,
    CREATE_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT,
    PAYMENT_CONFIRMATION,
    GET_PATIENTS_BY_ID_USER,
    GET_HISTORY_CHAT_BY_CUSTOMER,
  ], // User thường không có quyền quản trị
};

const BLACKIST = [
  GET_INFOR_MAKE_APPOINTMENT,
  CREATE_APPOINTMENT,
  GET_CATEGORY_PACKAGE,
  GET_CATEGORY_PACKAGE_BY_ID,
  GET_DOCTORS,
  GET_DOCTORS_BY_ID,
  GET_DOCTOR_FOLLOW_SPECIALTY,
  GET_MEDICAL_PACKAGE,
  GET_MEDICAL_PACKAGE_BY_ID,
  GET_MEDICAL_PACKAGE_FOLLOW_CATEGORY,
  GET_POSITIONS,
  GET_POSITION_BY_ID,
  GET_SCHEDULE_FOLLOW_DATE,
  GET_SCHEDULE_OF_DOCTOR,
  SEARCH,
  REGISTER,
  LOGIN,
  LOGIN_RECEPTIONIST,
  REFRESH_TOKEN,
  LOGOUT,
  LOGIN_DOCTOR,
  GET_SPECIALTIES,
  GET_SPECIALTY_BY_ID,
  GET_TIMEFRAMES,
  GET_USER_BY_ID,
  GET_COMMENTS,
  GET_COMMENTS_BY_APPOINTMENT_ID,
  UPDATE_USER,
  GET_PATIENTS,
  GET_APPOINTMENT_OF_PATIENT,
  GET_MEDICAL_PACKAGE_FOLLOW_ID_DOCTOR,
  GET_ALL_PATIENT,
]; // những route nào có trong đây không cần đăng nhập vẫn truy cập được

export const checkUserPermission = async (req, res, next) => {
  const apiRequest = req.path.replace(/^\/api/, "");

  // 1. Kiểm tra Blacklist
  if (BLACKIST.includes(apiRequest)) {
    return next();
  }

  // 2. Kiểm tra JWT
  // LƯU Ý: Nếu checkUserJWT bị lỗi và đã gửi response (res.json),
  // code bên dưới vẫn có thể chạy. Nên cần kiểm tra headersSent.
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const decode = verifyJWT(authHeader.split(" ")[1]);
    if (decode) {
      req.user = decode;
      const role = decode?.role;

      // 3. Kiểm tra Role
      if (role === "R1") {
        return next(); // <--- QUAN TRỌNG: Phải có return
      }

      if (role === "R2") {
        if (ROLE_PERMISSIONS.R2.includes(apiRequest)) {
          return next();
        }
      } else if (role === "R4") {
        if (ROLE_PERMISSIONS.R4.includes(apiRequest)) {
          return next();
        }
      } else if (role === "R3") {
        if (ROLE_PERMISSIONS.R3.includes(apiRequest)) {
          return next();
        }
      }

      // 4. Nếu không lọt vào các case trên thì chặn
      return res.status(403).json({
        err: 403,
        message: "You don't have permission to access!",
      });
    } else {
      return res.status(401).json({
        err: 401,
        message: "Token is not valid",
      });
    }
  } else {
    return res.status(401).json({
      err: 401,
      message: "Not authenticated the user",
    });
  }
};
