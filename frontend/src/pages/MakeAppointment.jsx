import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createAppointment,
  getInfoToMakeAppointment,
} from "../services/appointment";
import { FaPhone, FaTransgender, FaMoneyBillWave } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
import { CiCalendarDate } from "react-icons/ci";
import { GiPositionMarker } from "react-icons/gi";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { IoIosCalendar, IoIosMail } from "react-icons/io";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { APPOINTMENT } from "../utils/path";
import { InfoAppointment } from "../components";
import { IoShieldCheckmark } from "react-icons/io5";
import dayjs from "dayjs";
import { getPatientsByIdUser } from "../services/patientService";
import Select from "react-select";
dayjs.locale("vi");

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

function MakeAppointment() {
  const auth = useSelector((state) => state.auth?.data);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [forMyself, setForMyself] = useState(true);
  const [infoPatient, setInfoPatient] = useState({});
  const [patients, setPatients] = useState([]); // danh sách người quen trước có đặt lịch
  const [listItems, setListItems] = useState([]); // dùng để lưu cho Select nguoiewf quentrước có đặt lịch

  const idDoctor = searchParams.get("idDoctor");
  const idMedicalPackage = searchParams.get("idMedicalPackage");
  const appointment_date = searchParams.get("date");
  const time_frame = searchParams.get("tf");

  const [infoAppointment, setInfoAppointment] = useState({
    name: "",
    price: 0,
    image: "",
    time_frame: "",
    appointment_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getInfoToMakeAppointment({
        idDoctor,
        idMedicalPackage,
        time_frame,
        appointment_date,
      });
      if (res.err === 0) {
        if (idDoctor) {
          const positions = res.data?.doctor?.position
            .map((item) => item.name)
            .join(", ");
          const fullName = `${res.data?.doctor?.user?.firstName} ${res.data?.doctor?.user?.lastName}`;
          setInfoAppointment({
            name: `${positions ? positions + " - " : ""}${fullName}`,
            price: res.data?.doctor?.price || 0,
            image: res.data?.doctor?.user?.avatar,
            time_frame: res.data?.time_frame,
            appointment_date: res.data?.appointment_date,
          });
        }
        if (idMedicalPackage) {
          setInfoAppointment({
            name: res.data?.Medical_package?.name,
            price: res.data?.Medical_package?.price || 0,
            image: res.data?.Medical_package?.image,
            time_frame: res.data?.time_frame,
            appointment_date: res.data?.appointment_date,
          });
        }
      }
    };

    const fetchPatients = async () => {
      const res = await getPatientsByIdUser(auth?.id);
      if (res.err === 0 && res.data.length > 0) {
        setPatients(res?.data);
        let temp = res.data.map((item) => ({
          value: item?.id,
          label: `${item?.fullName} - SĐT: ${item?.phone}`,
          fullName: item?.fullName,
          phone: item?.phone,
          email: item?.email,
          address: item?.address,
          gender: item?.gender,
          dateOfBirth: item?.dateOfBirth.split("T")[0],
        }));
        setListItems(temp);
      }
    };
    if (appointment_date && time_frame && (idDoctor || idMedicalPackage)) {
      fetchData();
      fetchPatients();
    }
  }, [idDoctor, idMedicalPackage, time_frame, appointment_date]);

  const handleOnchangeSelectPatient = (selectedOption) => {
    if (selectedOption) {
      setInfoPatient({
        id: selectedOption.value,
        fullName: selectedOption.fullName,
        phone: selectedOption.phone,
        email: selectedOption.email,
        address: selectedOption.address,
        gender: selectedOption.gender,
        dateOfBirth: selectedOption.dateOfBirth,
        id_user: auth?.id,
      });
    } else {
      setInfoPatient({});
    }
  };

  const handleClickSubmit = () => {
    let payload = {};
    if (forMyself) {
      payload = {
        idDoctor,
        id_user: auth?.id,
        idPatient: auth?.id,
        idMedicalPackage,
        appointment_date,
        time_frame: infoAppointment?.time_frame,
        status: 1,
        payment_status: false,
        isCheckIn: false,
        diseaseDescription: infoPatient?.diseaseDescription || "",
        patient: { id: auth?.id },
      };
    } else {
      payload = {
        idDoctor,
        id_user: auth?.id,
        idPatient: infoPatient?.id,
        idMedicalPackage,
        appointment_date,
        time_frame: infoAppointment?.time_frame,
        status: 1,
        payment_status: false,
        isCheckIn: false,
        patient: infoPatient,
        diseaseDescription: infoPatient?.diseaseDescription || "",
      };
    }

    if (!forMyself) {
      if (
        !infoPatient?.fullName ||
        !infoPatient?.phone ||
        !infoPatient?.email ||
        !infoPatient?.address ||
        !infoPatient?.gender ||
        !infoPatient?.dateOfBirth
      ) {
        Swal.fire({
          title: "Thiếu thông tin người bệnh!",
          text: "Vui lòng điền đầy đủ các trường thông tin bắt buộc của người thân để tiếp tục.",
          icon: "warning",
          confirmButtonText: "Đã hiểu và Bổ sung",
          confirmButtonColor: "#f59e0b",
          customClass: {
            popup: "rounded-2xl",
          },
        });

        return;
      }
    }

    Swal.fire({
      title: "Xác nhận đặt lịch?",
      text: "Vui lòng kiểm tra lại thông tin trước khi đặt lịch.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Xác nhận đặt lịch",
      cancelButtonText: "Kiểm tra lại",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await createAppointment(payload);
        if (res.err === 0) {
          Swal.fire({
            title: "Thành công!",
            text: "Lịch khám của bạn đã được ghi nhận.",
            icon: "success",
            confirmButtonColor: "#3B82F6",
          }).then(() => {
            navigate(APPOINTMENT);
          });
        } else if (res.err === 5) {
          Swal.fire({
            title: "Trùng lịch!",
            text: "Bạn đã có một lịch hẹn khác vào khung giờ này.",
            icon: "warning",
            confirmButtonColor: "#EF4444",
          });
        } else {
          Swal.fire({
            title: "Thất bại!",
            text: "Hệ thống đang bận, vui lòng thử lại sau.",
            icon: "error",
            confirmButtonColor: "#EF4444",
          });
        }
      }
    });
  };

  const ReadOnlyInput = ({ icon: Icon, value }) => (
    <div className="relative mb-5">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Icon className="text-slate-400" size="1.1rem" />
      </div>
      <input
        type="text"
        className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none cursor-not-allowed font-medium"
        value={value || "Chưa cập nhật"}
        readOnly
      />
    </div>
  );

  const handleOnchangeInput = (e) => {
    const { name, value } = e.target;
    setInfoPatient({ ...infoPatient, [name]: value });
  };

  // console.log(infoPatient);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-white border-b border-slate-200 sticky top-[0px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <InfoAppointment infoAppointment={infoAppointment} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Xác nhận thông tin đặt khám
        </h1>
        <div className="w-full">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Đối tượng khám bệnh <span className="text-red-500">*</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thẻ: Đặt cho bản thân */}
            <label
              htmlFor="forMyself"
              className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
        ${
          forMyself
            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-slate-50"
        }
      `}
            >
              <input
                type="radio"
                id="forMyself"
                name="patient"
                className="hidden" // Giấu đi nút radio xấu xí mặc định
                checked={forMyself}
                onChange={() => setForMyself(true)}
              />
              <FaUser size="1.5rem" className="mb-2" />
              <span className="font-bold text-[15px]">Đặt cho bản thân</span>

              {/* Nút check nhỏ góc phải khi được chọn */}
              {forMyself && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </label>

            {/* Thẻ: Đặt cho người khác */}
            <label
              htmlFor="forSomeone"
              className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
        ${
          !forMyself
            ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm"
            : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-slate-50"
        }
      `}
            >
              <input
                type="radio"
                id="forSomeone"
                name="patient"
                className="hidden"
                checked={!forMyself}
                onChange={() => setForMyself(false)}
              />
              <FaUserFriends size="1.5rem" className="mb-2" />
              <span className="font-bold text-[15px]">Đặt cho người thân</span>

              {/* Nút check nhỏ góc phải khi được chọn */}
              {!forMyself && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {forMyself ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <IoShieldCheckmark
                      className="text-blue-600"
                      size="1.5rem"
                    />
                    Thông tin Bệnh nhân
                  </h2>
                  <span className="text-xs text-slate-500 italic bg-slate-100 px-3 py-1 rounded-full">
                    Trích xuất từ Hồ sơ cá nhân
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <ReadOnlyInput
                    icon={ImUser}
                    value={`${auth?.firstName} ${auth?.lastName}`}
                  />
                  <ReadOnlyInput icon={FaPhone} value={auth?.phone} />
                  <ReadOnlyInput
                    icon={FaTransgender}
                    value={
                      auth?.gender === "male"
                        ? "Nam"
                        : auth?.gender === "female"
                          ? "Nữ"
                          : ""
                    }
                  />
                  <ReadOnlyInput
                    icon={CiCalendarDate}
                    value={
                      auth?.dateOfBirth
                        ? dayjs(auth?.dateOfBirth).format("DD/MM/YYYY")
                        : ""
                    }
                  />
                  <div className="md:col-span-2">
                    <ReadOnlyInput
                      icon={GiPositionMarker}
                      value={auth?.address}
                    />
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-2 italic text-center md:text-left">
                  * Thông tin được tự động điền. Nếu muốn thay đổi, vui lòng vào
                  phần{" "}
                  <strong className="text-blue-600 cursor-pointer">
                    Hồ sơ cá nhân
                  </strong>
                  .
                </p>
                <div className="mt-5 cursor-default">
                  <p className="text-sm font-bold text-slate-700 mb-3">
                    Lý do khám bệnh
                  </p>
                  <textarea
                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 outline-none resize-none"
                    placeholder="Mô tả ngắn gọn về tình trạng sức khỏe hoặc triệu chứng bạn đang gặp phải..."
                    name="diseaseDescription"
                    value={infoPatient?.diseaseDescription || ""}
                    onChange={handleOnchangeInput}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ImUser className="text-blue-600" size="1.5rem" />
                    Thông tin người đặt lịch
                  </h2>
                  <span className="text-xs text-slate-500 italic bg-slate-100 px-3 py-1 rounded-full">
                    Trích xuất từ Hồ sơ cá nhân
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                  <ReadOnlyInput
                    icon={ImUser}
                    value={`${auth?.firstName} ${auth?.lastName}`}
                  />
                  <ReadOnlyInput icon={FaPhone} value={auth?.phone} />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
                    <IoShieldCheckmark
                      className="text-blue-600"
                      size="1.5rem"
                    />
                    Thông tin Bệnh nhân
                  </h2>
                  <div className="md:col-span-8 flex flex-col gap-2">
                    <label className=" font-semibold text-slate-700">
                      Người quen đã có
                    </label>
                    <Select
                      onChange={handleOnchangeSelectPatient}
                      options={listItems}
                      styles={customSelectStyles}
                      placeholder="Tìm kiếm và lựa chọn..."
                      noOptionsMessage={() => "Không tìm thấy dữ liệu"}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
                    <div className="relative mb-5">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <ImUser className="text-slate-400" size="1.1rem" />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none font-medium"
                        placeholder="Họ tên người bệnh (VD: Nguyễn Văn A) (bắt buộc)"
                        name="fullName"
                        value={infoPatient?.fullName || ""}
                        onChange={handleOnchangeInput}
                        required
                      />
                    </div>

                    <div className="relative mb-5">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FaPhone className="text-slate-400" size="1.1rem" />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none font-medium"
                        placeholder="Số điện thoại (bắt buộc)"
                        name="phone"
                        value={infoPatient?.phone || ""}
                        onChange={handleOnchangeInput}
                        required
                      />
                    </div>
                    <div className="relative mb-5">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <IoIosMail className="text-slate-400" size="1.1rem" />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none font-medium"
                        placeholder="Email"
                        name="email"
                        value={infoPatient?.email || ""}
                        onChange={handleOnchangeInput}
                      />
                    </div>
                    <div className="relative mb-5">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <IoIosCalendar
                          className="text-slate-400"
                          size="1.1rem"
                        />
                      </div>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none font-medium"
                        placeholder="Ngày sinh"
                        name="dateOfBirth"
                        value={infoPatient?.dateOfBirth || ""}
                        onChange={handleOnchangeInput}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-5">
                    <label className="font-semibold text-slate-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 h-full pb-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          checked={infoPatient?.gender === "male"}
                          onChange={handleOnchangeInput}
                        />
                        <span className="text-slate-700 group-hover:text-blue-600 transition-colors">
                          Nam
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          checked={infoPatient?.gender === "female"}
                          onChange={handleOnchangeInput}
                        />
                        <span className="text-slate-700 group-hover:text-blue-600 transition-colors">
                          Nữ
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="relative mb-5">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <GiPositionMarker
                        className="text-slate-400"
                        size="1.1rem"
                      />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl pl-11 p-3 outline-none font-medium"
                      placeholder="Địa chỉ (bắt buộc)"
                      name="address"
                      value={infoPatient?.address || ""}
                      onChange={handleOnchangeInput}
                    />
                  </div>
                  <div className="mt-5 cursor-default">
                    <p className="text-sm font-bold text-slate-700 mb-3">
                      Lý do khám bệnh
                    </p>
                    <textarea
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 outline-none resize-none"
                      placeholder="Mô tả ngắn gọn về tình trạng sức khỏe hoặc triệu chứng bạn đang gặp phải..."
                      name="diseaseDescription"
                      value={infoPatient?.diseaseDescription || ""}
                      onChange={handleOnchangeInput}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Box Lưu ý  */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                LƯU Ý QUAN TRỌNG:
              </h3>
              <p className="text-amber-700 mb-2 leading-relaxed">
                Thông tin anh/chị cung cấp sẽ được sử dụng làm{" "}
                <strong>hồ sơ khám bệnh chính thức</strong> tại cơ sở y tế. Vui
                lòng đảm bảo:
              </p>
              <ul className="list-disc list-inside text-amber-700/80 space-y-1 ml-2">
                <li>Kiểm tra kỹ Họ Tên, Số điện thoại và Ngày sinh.</li>
                <li>
                  Đến trước giờ hẹn <strong>15 phút</strong> để làm thủ tục lễ
                  tân.
                </li>
                <li>Mang theo CMND/CCCD hoặc Giấy tờ tùy thân có ảnh.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 sticky top-[200px]">
              <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-100 pb-4">
                Thông tin thanh toán
              </h2>

              {/* Phương thức thanh toán */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  Hình thức
                </p>
                <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl cursor-not-allowed opacity-90">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1 text-sm font-medium text-blue-800">
                    Thanh toán tại cơ sở y tế
                  </span>
                  <FaMoneyBillWave className="text-blue-600" />
                </label>
              </div>

              {/* Chi tiết chi phí */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-3 text-slate-600">
                  <span>Giá dịch vụ</span>
                  <span className="font-medium">
                    {infoAppointment?.price?.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 text-slate-600">
                  <span>Phí đặt lịch</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-500">
                    {infoAppointment?.price?.toLocaleString("vi-VN")}{" "}
                    <span className="text-base text-red-400">VNĐ</span>
                  </span>
                </div>
              </div>

              {/* Nút Submit */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex justify-center items-center"
                onClick={handleClickSubmit}
              >
                Xác nhận đặt lịch
              </button>

              <p className="text-xs text-center text-slate-400 mt-4">
                Bằng việc xác nhận, bạn đồng ý với Điều khoản sử dụng dịch vụ
                của Nger Hospital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakeAppointment;
