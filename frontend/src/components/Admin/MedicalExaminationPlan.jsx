import { useEffect, useState } from "react";
import { getTimeFrames } from "../../services/timeFrameService";
import _ from "lodash";
import Select from "react-select";
import { getDoctorById, getDoctors } from "../../services/doctorService";
import {
  createOrUpdateSchedule,
  getScheduleFollowDate,
} from "../../services/scheduleService";
import { toast } from "react-toastify";
import { getMedicalPackage } from "../../services/medicalPackageService";
import { useSelector } from "react-redux";
import { IoIosSave } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCalendarAlt, FaRegClock, FaCheckCircle } from "react-icons/fa";

function MedicalExaminationPlan({ type }) {
  const [timeFrames, setTimeFrames] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSaving, setIsSaving] = useState(false);

  const idDoctor = useSelector((state) => state?.authDoctor?.data?.id); // Dành cho DOCTOR_ONLY

  // Lấy danh sách khung giờ hệ thống
  useEffect(() => {
    const fetchTimeFrames = async () => {
      const res = await getTimeFrames();
      if (res.err === 0) {
        let temp = res.data.map((item) => ({ ...item, selected: false }));
        setTimeFrames(temp);
      }
    };
    fetchTimeFrames();
  }, []);

  // Lấy danh sách Đối tượng (Bác sĩ / Gói khám) tùy theo Type
  useEffect(() => {
    if (type === "DOCTOR") {
      const fetchDoctors = async () => {
        const res = await getDoctors();
        if (res.err === 0 && res.data.length > 0) {
          let temp = res.data.map((item) => ({
            value: item?.id,
            label: `${item?.user?.firstName} ${item?.user?.lastName} - Khoa: ${item?.specialty.map((spe) => spe?.name).join(", ")}`,
          }));
          setListItems(temp);
        }
      };
      fetchDoctors();
    }

    if (type === "MEDICAL_PACKAGE") {
      const fetchMedicalPackage = async () => {
        const res = await getMedicalPackage();
        if (res.err === 0 && res.data.length > 0) {
          let temp = res.data.map((item) => ({
            value: item?.id,
            label: `${item?.name} - ${item?.category_package?.name}`,
          }));
          setListItems(temp);
        }
      };
      fetchMedicalPackage();
    }

    if (type === "DOCTOR_ONLY" && idDoctor) {
      const fetchDoctor = async () => {
        const item = await getDoctorById(idDoctor);
        if (item.err === 0) {
          let temp = [
            {
              value: item?.data?.id,
              label: `${item?.data?.user?.firstName} ${item?.data?.user?.lastName} - Khoa: ${item?.data?.specialty.map((spe) => spe?.name).join(", ")}`,
            },
          ];
          setListItems(temp);
          setSelectedItem(temp[0]); // Tự động chọn luôn cho Bác sĩ đỡ phải click
        }
      };
      fetchDoctor();
    }
  }, [type, idDoctor]);

  // Load lịch khám tương ứng khi Đổi Ngày hoặc Đổi Người/Gói
  useEffect(() => {
    if (selectedItem != null && selectedDate) {
      const fetchScheduleFollowDate = async () => {
        const res = await getScheduleFollowDate({
          [type === "MEDICAL_PACKAGE" ? "idMedicalPackage" : "id_doctor"]:
            selectedItem.value,
          appointment_date: selectedDate,
        });

        if (res.err === 0 && res.data !== null) {
          let temp = _.cloneDeep(timeFrames).map((item) => ({
            ...item,
            selected: res.data.time_frame.some((item2) => item2.id === item.id),
          }));
          setTimeFrames(temp);
        } else {
          // Reset nếu không có lịch
          let temp = _.cloneDeep(timeFrames).map((item) => ({
            ...item,
            selected: false,
          }));
          setTimeFrames(temp);
        }
      };
      fetchScheduleFollowDate();
    } else {
      // Reset nếu chưa chọn ai
      let temp = _.cloneDeep(timeFrames).map((item) => ({
        ...item,
        selected: false,
      }));
      setTimeFrames(temp);
    }
  }, [selectedItem, selectedDate]);

  const handleSelectTimeFrame = (id) => {
    if (!selectedItem) {
      toast.warning(
        "Vui lòng chọn Đối tượng (Bác sĩ/Gói khám) trước khi chọn giờ!",
      );
      return;
    }
    let temp = _.cloneDeep(timeFrames);
    let index = temp.findIndex((item) => item.id === id);
    if (index !== -1) {
      temp[index].selected = !temp[index].selected;
      setTimeFrames(temp);
    }
  };

  const handleClickSave = async () => {
    if (!selectedItem) {
      toast.error("Vui lòng chọn Đối tượng áp dụng!");
      return;
    }
    if (!selectedDate) {
      toast.error("Vui lòng chọn Ngày!");
      return;
    }

    setIsSaving(true);
    let payload = {
      [type === "MEDICAL_PACKAGE" ? "idMedicalPackage" : "idDoctor"]:
        selectedItem.value,
      appointment_date: selectedDate,
      time_frame: timeFrames
        .filter((item) => item.selected === true)
        .map((item) => item.id),
    };

    try {
      const res = await createOrUpdateSchedule(payload);
      if (res.err === 0) {
        toast.success("Lưu kế hoạch khám thành công!");
      } else {
        toast.error(res.message || "Có lỗi xảy ra khi lưu lịch!");
      }
    } catch (error) {
      toast.error("Hệ thống đang bận, vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  // Custom CSS cho React-Select để nó hợp với Tailwind
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

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col w-full">
      {/* ===== HEADER ===== */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          {type === "MEDICAL_PACKAGE"
            ? "Kế hoạch Gói khám"
            : "Kế hoạch khám bệnh"}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Thiết lập các khung giờ nhận bệnh nhân theo ngày.
        </p>
      </div>

      {/* ===== FORM CHỌN ===== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Chọn Đối tượng */}
        <div className="md:col-span-8 flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            {type === "MEDICAL_PACKAGE" ? "Chọn Gói khám" : "Chọn Bác sĩ"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedItem}
            onChange={setSelectedItem}
            options={listItems}
            styles={customSelectStyles}
            placeholder="Tìm kiếm và lựa chọn..."
            noOptionsMessage={() => "Không tìm thấy dữ liệu"}
            isDisabled={type === "DOCTOR_ONLY"} // Khóa nếu là Bác sĩ tự xem
          />
        </div>

        {/* Chọn Ngày */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Ngày áp dụng <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[9px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]} // Không cho chọn ngày quá khứ
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* ===== CHỌN KHUNG GIỜ ===== */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaRegClock className="text-slate-500" size="1.1rem" />
          <h3 className="font-bold text-slate-700">Khung giờ hoạt động</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {timeFrames.length > 0 ? (
            timeFrames.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectTimeFrame(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 select-none border-2
                    ${
                      item.selected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md -translate-y-0.5"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                    }`}
              >
                <span className="font-bold text-[15px]">
                  {item?.time_frame}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400">
              Đang tải danh sách khung giờ...
            </div>
          )}
        </div>
      </div>

      {/* ===== NÚT LƯU ===== */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleClickSave}
          disabled={isSaving || !selectedItem}
        >
          {isSaving ? (
            <AiOutlineLoading3Quarters
              className="animate-spin"
              size="1.25rem"
            />
          ) : (
            <IoIosSave size="1.25rem" />
          )}
          <span>{isSaving ? "Đang lưu..." : "Lưu kế hoạch khám"}</span>
        </button>
      </div>
    </div>
  );
}

export default MedicalExaminationPlan;
