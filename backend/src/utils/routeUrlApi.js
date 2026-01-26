// Route api appoinment
export const GET_INFOR_MAKE_APPOINTMENT = "/get-info-make-appointment"
export const CREATE_APPOINTMENT = "/create-appointment"
export const GET_APPOINTMENT_OF_USER = "/get-appointment-of-user"
export const GET_APPOINTMENT_OF_DOCTOR = "/get-appointment-of-doctor"
export const UPDATE_STATUS_APPOINTMENT = "/update-status-appointment"

// Route api auth
export const REGISTER = "/register"
export const LOGIN = "/login"
export const REFRESH_TOKEN = "/refresh-token"
export const LOGOUT = "/logout"
export const NAVIGATE_ADMIN = "/navigate-admin"
export const LOGIN_DOCTOR = "/login-doctor"
export const CHANGE_PASSWORD_DOCTOR = "/change-password-doctor"

// Route api category package
export const GET_CATEGORY_PACKAGE = "/get-category-package"
export const GET_CATEGORY_PACKAGE_BY_ID = "/get-category-package-by-id"
export const CREATE_CATEGORY_PACKAGE = "/create-category-package"
export const UPDATE_CATEGORY_PACKAGE = "/update-category-package"
export const DELETE_CATEGORY_PACKAGE = "/delete-category-package"

// Route api doctor
export const CREATE_DOCTOR = "/create-doctor"
export const GET_DOCTORS = "/get-doctors"
export const GET_DOCTORS_BY_ID = "/get-doctors-by-id"
export const DELETE_DOCTORS_BY_ID = "/delete-doctor-by-id"
export const UPDATE_DOCTOR = "/update-doctor"
export const GET_DOCTOR_FOLLOW_SPECIALTY = "/get-doctor-follow-specialty"
export const GET_PATIENT_OF_DOCTOR = "/get-patient-of-doctor"
export const GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR = "/get-appointment-of-user-follow-doctor"

// Route api medicalPackage
export const CREATE_MEDICAL_PACKAGE = "/create-medical-package"
export const UPDATE_MEDICAL_PACKAGE = "/update-medical-package"
export const GET_MEDICAL_PACKAGE = "/get-medical-package"
export const GET_MEDICAL_PACKAGE_BY_ID = "/get-medical-package-by-id"
export const DELETE_MEDICAL_PACKAGE = "/delete-medical-package"
export const GET_MEDICAL_PACKAGE_FOLLOW_CATEGORY = "/get-medical-package-follow-category"

// Route api position
export const GET_POSITIONS = "/get-postions"
export const CREATE_POSITION = "/create-position"
export const DELETE_POSITION = "/delete-position"
export const UPDATE_POSITION = "/update-position"
export const GET_POSITION_BY_ID = "/get-position-by-id"

// Route api schedule
export const CREATE_OR_UPDATE_SCHEDULE = "/create-or-update-schedule"
export const GET_SCHEDULE_FOLLOW_DATE = "/get-schedule-follow-date"
export const GET_SCHEDULE_OF_DOCTOR = "/get-schedule-of-doctor"

// Route search
export const SEARCH = "/search"

// Route api specialty
export const GET_SPECIALTIES = "/get-specialties"
export const CREATE_SPECIALTY = "/create-specialty"
export const UPDATE_SPECIALTY = "/update-specialty"
export const DELETE_SPECIALTY = "/delete-specialty"
export const GET_SPECIALTY_BY_ID = "/get-specialty-by-id"

// Route api timeframe
export const GET_TIMEFRAMES = "/get-timeFrames"

// Route user
export const GET_USERS = "/get-users"
export const GET_USER_BY_ID = "/get-user-by-id"
export const UPDATE_USER = "/update-user"
export const DELETE_USER = "/delete-user"