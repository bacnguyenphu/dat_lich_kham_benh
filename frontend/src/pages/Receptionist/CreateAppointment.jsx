import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaFileMedical,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { createAppointment } from "../../services/appointment";
import { getDoctors } from "../../services/doctorService";
import { getMedicalPackage } from "../../services/medicalPackageService";
import { getTimeFrames } from "../../services/timeFrameService";
import { getScheduleFollowDate } from "../../services/scheduleService";
import {
  getAllPatient,
  getPatientsByIdUser,
} from "../../services/patientService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Select from "react-select";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "2px",
    borderRadius: "0.75rem", // rounded-xl
    borderColor: state.isFocused ? "#3b82f6" : "#e2e8f0", // blue-500 or slate-200
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": { borderColor: "#94a3b8" }, // slate-400
    backgroundColor: "#f8fafc", // slate-50
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#eff6ff"
        : "white",
    color: state.isSelected ? "white" : "#334155",
    cursor: "pointer",
  }),
};

function CreateAppointment() {
  const navigate = useNavigate();
  const authReceptionist = useSelector((state) => state.authReceptionist?.data);
  const [loading, setLoading] = useState(false);

  // Patient selection mode
  const [useExistingPatient, setUseExistingPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [existingPatients, setExistingPatients] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  // Patient information
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  // Appointment details
  const [appointmentData, setAppointmentData] = useState({
    appointment_date: dayjs().format("YYYY-MM-DD"),
    time_frame: "",
    idDoctor: "",
    idMedicalPackage: "",
    diseaseDescription: "",
    payment_status: false,
    isCheckIn: true, // For walk-in patients
  });

  // Data for dropdowns
  const [doctors, setDoctors] = useState([]);
  const [medicalPackages, setMedicalPackages] = useState([]);
  const [allTimeFrames, setAllTimeFrames] = useState([]);
  const [availableTimeFrames, setAvailableTimeFrames] = useState([]);
  const [loadingTimeFrames, setLoadingTimeFrames] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsRes, packagesRes, timeFramesRes] = await Promise.all([
          getDoctors(100, 1),
          getMedicalPackage(100, 1),
          getTimeFrames(),
        ]);

        if (doctorsRes.err === 0) {
          setDoctors(doctorsRes.data);
        }
        if (packagesRes.err === 0) {
          setMedicalPackages(packagesRes.data);
        }
        if (timeFramesRes.err === 0) {
          setAllTimeFrames(timeFramesRes.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Swal.fire({
          title: "Lỗi!",
          text: "Không thể tải dữ liệu. Vui lòng thử lại.",
          icon: "error",
        });
      }
    };

    loadData();
  }, []);

  // Load existing patients for the receptionist
  useEffect(() => {
    const loadExistingPatients = async () => {
      if (authReceptionist?.id) {
        try {
          const res = await getAllPatient();
          if (res.err === 0 && res.data.length > 0) {
            setExistingPatients(res.data);
            const options = res.data.map((patient) => ({
              value: patient.id,
              label: `${patient.fullName} - SĐT: ${patient.phone}`,
              fullName: patient.fullName,
              phone: patient.phone,
              email: patient.email,
              address: patient.address,
              gender: patient.gender,
              dateOfBirth: patient.dateOfBirth.split("T")[0],
            }));
            setPatientOptions(options);
          }
        } catch (error) {
          console.error("Error loading existing patients:", error);
        }
      }
    };

    loadExistingPatients();
  }, [authReceptionist?.id]);

  // Load available time frames when date, doctor, or medical package changes
  useEffect(() => {
    const loadAvailableTimeFrames = async () => {
      // Clear current time frame selection
      handleAppointmentDataChange("time_frame", "");

      // Check if we have the required data to fetch schedules
      if (
        !appointmentData.appointment_date ||
        (!appointmentData.idDoctor && !appointmentData.idMedicalPackage)
      ) {
        setAvailableTimeFrames([]);
        return;
      }

      setLoadingTimeFrames(true);
      try {
        const params = {
          appointment_date: appointmentData.appointment_date,
          ...(appointmentData.idDoctor && {
            id_doctor: appointmentData.idDoctor,
          }),
          ...(appointmentData.idMedicalPackage && {
            idMedicalPackage: appointmentData.idMedicalPackage,
          }),
        };

        const res = await getScheduleFollowDate(params);

        if (res.err === 0 && res.data?.time_frame) {
          // Filter all time frames to only show those in the schedule
          const scheduledTimeFrameIds = res.data.time_frame.map((tf) => tf.id);
          const availableFrames = allTimeFrames.filter((tf) =>
            scheduledTimeFrameIds.includes(tf.id),
          );
          setAvailableTimeFrames(availableFrames);
        } else {
          setAvailableTimeFrames([]);
        }
      } catch (error) {
        console.error("Error loading available time frames:", error);
        setAvailableTimeFrames([]);
      } finally {
        setLoadingTimeFrames(false);
      }
    };

    loadAvailableTimeFrames();
  }, [
    appointmentData.appointment_date,
    appointmentData.idDoctor,
    appointmentData.idMedicalPackage,
    allTimeFrames,
  ]);

  const handlePatientSelectionChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedPatient({
        id: selectedOption.value,
        fullName: selectedOption.fullName,
        phone: selectedOption.phone,
        email: selectedOption.email,
        address: selectedOption.address,
        gender: selectedOption.gender,
        dateOfBirth: selectedOption.dateOfBirth,
      });
    } else {
      setSelectedPatient(null);
    }
  };

  const handlePatientModeChange = (useExisting) => {
    setUseExistingPatient(useExisting);
    if (useExisting) {
      // Clear new patient form
      setPatientInfo({
        fullName: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      });
    } else {
      // Clear selected patient
      setSelectedPatient(null);
    }
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAppointmentDataChange = (field, value) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Validate patient information
    if (useExistingPatient) {
      if (!selectedPatient) {
        Swal.fire("Lỗi!", "Vui lòng chọn bệnh nhân từ danh sách.", "error");
        return false;
      }
    } else {
      if (!patientInfo.fullName.trim()) {
        Swal.fire("Lỗi!", "Vui lòng nhập họ tên bệnh nhân.", "error");
        return false;
      }
      if (!patientInfo.phone.trim()) {
        Swal.fire("Lỗi!", "Vui lòng nhập số điện thoại.", "error");
        return false;
      }
      if (!patientInfo.dateOfBirth) {
        Swal.fire("Lỗi!", "Vui lòng nhập ngày sinh.", "error");
        return false;
      }
      if (!patientInfo.gender) {
        Swal.fire("Lỗi!", "Vui lòng chọn giới tính.", "error");
        return false;
      }
    }

    // Validate appointment details
    if (!appointmentData.appointment_date) {
      Swal.fire("Lỗi!", "Vui lòng chọn ngày khám.", "error");
      return false;
    }
    if (!appointmentData.time_frame) {
      if (
        availableTimeFrames.length === 0 &&
        (appointmentData.idDoctor || appointmentData.idMedicalPackage)
      ) {
        Swal.fire(
          "Lỗi!",
          "Không có khung giờ làm việc cho lựa chọn này. Vui lòng chọn ngày hoặc bác sĩ/gói khám khác.",
          "error",
        );
      } else {
        Swal.fire("Lỗi!", "Vui lòng chọn khung giờ.", "error");
      }
      return false;
    }
    if (!appointmentData.idDoctor && !appointmentData.idMedicalPackage) {
      Swal.fire("Lỗi!", "Vui lòng chọn bác sĩ hoặc gói khám.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare patient data based on selection mode
      const patientData = useExistingPatient ? selectedPatient : patientInfo;

      const payload = {
        patient: patientData,
        appointment_date: appointmentData.appointment_date,
        time_frame: appointmentData.time_frame,
        idDoctor: appointmentData.idDoctor || null,
        idMedicalPackage: appointmentData.idMedicalPackage || null,
        diseaseDescription: appointmentData.diseaseDescription,
        payment_status: appointmentData.payment_status,
        isCheckIn: appointmentData.isCheckIn,
        status: 2, // Confirmed status for walk-in patients
        id_user: authReceptionist?.id, // Add receptionist ID
      };

      // console.log(payload);

      const res = await createAppointment(payload);

      if (res.err === 0) {
        Swal.fire({
          title: "Thành công!",
          text: "Đã tạo lịch hẹn thành công.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Reset form
          setUseExistingPatient(false);
          setSelectedPatient(null);
          setPatientInfo({
            fullName: "",
            phone: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            address: "",
          });
          setAppointmentData({
            appointment_date: dayjs().format("YYYY-MM-DD"),
            time_frame: "",
            idDoctor: "",
            idMedicalPackage: "",
            diseaseDescription: "",
            payment_status: false,
            isCheckIn: true,
          });
        });
      } else {
        Swal.fire("Lỗi!", res.message || "Không thể tạo lịch hẹn.", "error");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaFileMedical className="text-blue-600" />
            Tạo lịch hẹn nhanh cho bệnh nhân đến trực tiếp
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Thông tin bệnh nhân
              </h2>

              {/* Patient Selection Mode */}
              <div className="mb-4">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="patientMode"
                      checked={!useExistingPatient}
                      onChange={() => handlePatientModeChange(false)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Tạo bệnh nhân mới
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="patientMode"
                      checked={useExistingPatient}
                      onChange={() => handlePatientModeChange(true)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Chọn bệnh nhân đã có
                    </span>
                  </label>
                </div>

                {useExistingPatient ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn bệnh nhân *
                    </label>
                    <Select
                      value={
                        selectedPatient
                          ? {
                              value: selectedPatient.id,
                              label: `${selectedPatient.fullName} - SĐT: ${selectedPatient.phone}`,
                            }
                          : null
                      }
                      onChange={handlePatientSelectionChange}
                      options={patientOptions}
                      placeholder="Tìm kiếm bệnh nhân..."
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={customSelectStyles}
                    />
                    {existingPatients.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Chưa có bệnh nhân nào trong hệ thống.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={patientInfo.fullName}
                        onChange={(e) =>
                          handlePatientInfoChange("fullName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={patientInfo.phone}
                        onChange={(e) =>
                          handlePatientInfoChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={patientInfo.email}
                        onChange={(e) =>
                          handlePatientInfoChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh *
                      </label>
                      <input
                        type="date"
                        value={patientInfo.dateOfBirth}
                        onChange={(e) =>
                          handlePatientInfoChange("dateOfBirth", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={patientInfo.gender === "Nam"}
                            onChange={(e) =>
                              handlePatientInfoChange("gender", e.target.value)
                            }
                            className="mr-2"
                          />
                          <IoMdMale className="mr-1 text-blue-600" />
                          Nam
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={patientInfo.gender === "Nữ"}
                            onChange={(e) =>
                              handlePatientInfoChange("gender", e.target.value)
                            }
                            className="mr-2"
                          />
                          <IoMdFemale className="mr-1 text-pink-600" />
                          Nữ
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        value={patientInfo.address}
                        onChange={(e) =>
                          handlePatientInfoChange("address", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" />
                Thông tin lịch hẹn
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Hướng dẫn:</strong> Chọn ngày khám và bác sĩ/gói khám
                  trước, sau đó chọn khung giờ làm việc có sẵn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khám *
                  </label>
                  <input
                    type="date"
                    value={appointmentData.appointment_date}
                    onChange={(e) =>
                      handleAppointmentDataChange(
                        "appointment_date",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={dayjs().format("YYYY-MM-DD")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khung giờ *
                  </label>
                  <select
                    value={appointmentData.time_frame}
                    onChange={(e) => {
                      const text =
                        e.target.options[e.target.selectedIndex].text;
                      handleAppointmentDataChange("time_frame", text);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={
                      loadingTimeFrames || availableTimeFrames.length === 0
                    }
                  >
                    <option value="">
                      {loadingTimeFrames
                        ? "Đang tải..."
                        : availableTimeFrames.length === 0 &&
                            (appointmentData.idDoctor ||
                              appointmentData.idMedicalPackage)
                          ? "Không có khung giờ trống"
                          : "Chọn khung giờ"}
                    </option>
                    {availableTimeFrames.map((tf) => (
                      <option key={tf.id} value={tf.time_frame}>
                        {tf.time_frame}
                      </option>
                    ))}
                  </select>
                  {availableTimeFrames.length === 0 &&
                    (appointmentData.idDoctor ||
                      appointmentData.idMedicalPackage) &&
                    !loadingTimeFrames && (
                      <p className="text-sm text-amber-600 mt-1">
                        Không có khung giờ làm việc cho lựa chọn này. Vui lòng
                        chọn ngày hoặc bác sĩ/gói khám khác.
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bác sĩ
                  </label>
                  <select
                    value={appointmentData.idDoctor}
                    onChange={(e) => {
                      handleAppointmentDataChange("idDoctor", e.target.value);
                      if (e.target.value) {
                        handleAppointmentDataChange("idMedicalPackage", "");
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn bác sĩ</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.position?.map((p) => p.name).join(", ")} -{" "}
                        {doctor.user?.firstName} {doctor.user?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gói khám
                  </label>
                  <select
                    value={appointmentData.idMedicalPackage}
                    onChange={(e) => {
                      handleAppointmentDataChange(
                        "idMedicalPackage",
                        e.target.value,
                      );
                      if (e.target.value) {
                        handleAppointmentDataChange("idDoctor", "");
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn gói khám</option>
                    {medicalPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.price?.toLocaleString("vi-VN")} VND
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả triệu chứng
                  </label>
                  <textarea
                    value={appointmentData.diseaseDescription}
                    onChange={(e) =>
                      handleAppointmentDataChange(
                        "diseaseDescription",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Mô tả triệu chứng bệnh (nếu có)"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="payment_status"
                    checked={appointmentData.payment_status}
                    onChange={(e) =>
                      handleAppointmentDataChange(
                        "payment_status",
                        e.target.checked,
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="payment_status"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <MdOutlinePayment className="mr-1 text-green-600" />
                    Đã thanh toán
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <FaFileMedical />
                    Tạo lịch hẹn
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAppointment;
