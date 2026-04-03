import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import {
  getAppointments,
  updateStatusAppointment,
} from "../../services/appointment";

import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import { PiWarningCircleLight } from "react-icons/pi";
import { MdCheckBox } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
dayjs.locale("vi");

function MyAppointment() {
  const authDoctor = useSelector((state) => state?.authDoctor?.data);

  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [page, setPage] = useState(1);

  const [appointments, setAppointments] = useState([]);

  // 99:Tat ca, 1: chờ xác nhận, 2: xác  nhận, 3 : đã xong, 0: đã huỷ
  const ALL = 99;
  const CHO_XAC_NHAN = 1;
  const XAC_NHAN = 2;
  const DA_XONG = 3;
  const DA_HUY = 0;
  const [filter, setFilter] = useState(ALL);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchAppointment = async () => {
    const res = await getAppointments(
      authDoctor?.id,
      limit,
      page,
      value,
      filter,
      selectedDate,
    );
    if (res.err === 0) {
      setTotalPages(res?.totalPage);
      setAppointments(res?.data);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [page, filter, debouncedValue, selectedDate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // chờ 0.5s sau khi ngừng gõ

    return () => clearTimeout(handler);
  }, [value]);

  const handleUpdateStatusAppointment = async (idAppointment, status) => {
    if (!idAppointment) return;

    // 1. Cấu hình nội dung Popup dựa theo trạng thái truyền vào
    let config = {};
    switch (status) {
      case DA_HUY:
        config = {
          title: "Xác nhận hủy lịch?",
          text: "Hành động này không thể hoàn tác.",
          icon: "warning",
          confirmText: "Hủy lịch ngay",
          confirmColor: "#ef4444", // Màu đỏ cảnh báo
          successMsg: "Đã hủy lịch hẹn thành công!",
        };
        break;
      case 2: // Khuyên dùng biến: case XAC_NHAN:
        config = {
          title: "Xác nhận lịch khám?",
          text: "Hệ thống sẽ chuyển trạng thái sang Chờ khám.",
          icon: "question",
          confirmText: "Xác nhận",
          confirmColor: "#3b82f6", // Màu xanh dương
          successMsg: "Xác nhận khám thành công!",
        };
        break;
      case 3: // Khuyên dùng biến: case DA_XONG:
        config = {
          title: "Hoàn tất khám bệnh?",
          text: "Xác nhận bệnh nhân này đã khám xong.",
          icon: "info",
          confirmText: "Hoàn tất",
          confirmColor: "#10b981", // Màu xanh ngọc (thành công)
          successMsg: "Đã cập nhật trạng thái hoàn tất!",
        };
        break;
      default:
        return; // Không làm gì nếu status không hợp lệ
    }

    // 2. Hiển thị Popup xác nhận (Chỉ viết 1 lần duy nhất)
    Swal.fire({
      title: config.title,
      text: config.text,
      icon: config.icon,
      showCancelButton: true,
      confirmButtonColor: config.confirmColor,
      cancelButtonColor: "#94a3b8", // Màu xám nhạt cho nút Hủy/Đóng
      confirmButtonText: config.confirmText,
      cancelButtonText: "Đóng",
      customClass: {
        popup: "rounded-2xl", // Bo góc popup cho đồng bộ giao diện
      },
    }).then(async (result) => {
      // 3. Xử lý gọi API nếu người dùng chọn OK
      if (result.isConfirmed) {
        try {
          const res = await updateStatusAppointment(idAppointment, status);

          if (res.err === 0) {
            toast.success(config.successMsg);
            await fetchAppointment(); // Load lại bảng dữ liệu
          } else {
            Swal.fire({
              title: "Thao tác thất bại!",
              text: res.message || "Vui lòng thử lại sau.",
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Lỗi hệ thống!",
            text: "Không thể kết nối đến máy chủ.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div>
      <h3 className="text-xl">
        Lịch khám của bác sĩ{" "}
        <span className="text-blue-800">
          {authDoctor?.firstName} {authDoctor?.lastName}
        </span>
      </h3>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full mb-6 mt-2">
        {/* ===== TÌM KIẾM (SEARCH) ===== */}
        <div className="relative w-full md:w-[350px] lg:w-[400px] shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <IoIosSearch className="text-slate-400" size="1.25rem" />
          </div>
          <input
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Tìm bệnh nhân hoặc SĐT..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Bộ lọc Ngày */}
          <div className="relative w-full sm:w-[160px]">
            <input
              type="date"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </div>

          {/* Bộ lọc Trạng thái */}
          <div className="relative w-full sm:w-[180px]">
            <select
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-[14px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              defaultValue="ALL"
              onChange={(e) => {
                // Giả sử bạn có hàm setFilter, nếu không hãy điều chỉnh theo logic của bạn
                setFilter(e.target.value);
                setPage(1);
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.75rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`,
              }}
            >
              <option value={ALL}>Tất cả trạng thái</option>
              <option value={CHO_XAC_NHAN}>Chờ xác nhận</option>
              <option value={XAC_NHAN}>Đã xác nhận</option>
              <option value={DA_XONG}>Đã khám xong</option>
              <option value={DA_HUY}>Đã hủy</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {appointments.length > 0 ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                {/* ===== TABLE HEADER ===== */}
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">STT</th>
                    <th className="px-6 py-4">Bệnh nhân</th>
                    <th className="px-6 py-4">Lịch hẹn</th>
                    <th className="px-6 py-4">Trạng thái & Thanh toán</th>
                    <th className="px-6 py-4 text-center w-40">Thao tác</th>
                  </tr>
                </thead>

                {/* ===== TABLE BODY ===== */}
                <tbody className="divide-y divide-slate-100">
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => {
                      return (
                        <tr
                          className="hover:bg-slate-50/80 transition-colors group"
                          key={appointment.id}
                        >
                          {/* STT */}
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-semibold text-slate-500">
                              {(page - 1) * limit + index + 1}
                            </span>
                          </td>

                          {/* Thông tin Bệnh nhân */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="font-bold text-[15px] text-slate-800">
                                {appointment?.user?.firstName}{" "}
                                {appointment?.user?.lastName}
                              </p>
                              <p className="text-sm font-medium text-slate-500 mt-0.5">
                                {appointment?.user?.phone}
                              </p>
                            </div>
                          </td>

                          {/* Thời gian Lịch hẹn */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="font-bold text-slate-700 text-sm">
                                {capitalizeFirstLetter(
                                  dayjs(appointment?.appointment_date).format(
                                    "dddd - DD/MM/YYYY",
                                  ),
                                )}
                              </p>
                              <p className="text-blue-600 font-semibold text-xs mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                                🕒 {appointment?.time}
                              </p>
                            </div>
                          </td>

                          {/* Trạng thái & Thanh toán */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2 items-start">
                              {/* Trạng thái Khám */}
                              {appointment?.status === 1 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <GiSandsOfTime size="0.9rem" /> Chờ xác nhận
                                </span>
                              )}
                              {appointment?.status === 2 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaCheck size="0.8rem" /> Chờ khám
                                </span>
                              )}
                              {appointment?.status === 3 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaRegCheckCircle size="0.9rem" /> Đã khám
                                  xong
                                </span>
                              )}
                              {appointment?.status === 0 && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-500 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaRegTrashAlt size="0.8rem" /> Đã hủy
                                </span>
                              )}

                              {/* Trạng thái Thanh toán */}
                              {!appointment?.payment_status ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <PiWarningCircleLight size="1rem" /> Chưa
                                  thanh toán
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                  <FaRegCheckCircle size="0.9rem" /> Đã thanh
                                  toán
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Thao tác (Action Buttons) */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Nút: Xác nhận chờ khám (Từ trạng thái 1 -> 2) */}
                              {appointment?.status === 1 && (
                                <button
                                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors active:scale-95"
                                  onClick={() =>
                                    handleUpdateStatusAppointment(
                                      appointment.id,
                                      XAC_NHAN,
                                    )
                                  }
                                  title="Xác nhận lịch hẹn"
                                >
                                  <MdCheckBox size="1.3rem" />
                                </button>
                              )}

                              {/* Nút: Xác nhận khám xong (Từ trạng thái 2 -> 3) */}
                              {appointment?.status === 2 && (
                                <button
                                  className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors active:scale-95"
                                  onClick={() =>
                                    handleUpdateStatusAppointment(
                                      appointment.id,
                                      DA_XONG,
                                    )
                                  }
                                  title="Xác nhận đã khám xong"
                                >
                                  <IoCheckmarkCircleSharp size="1.3rem" />
                                </button>
                              )}

                              {/* Nút: Hủy lịch (Chỉ hiện khi đang chờ xác nhận hoặc chờ khám) */}
                              {(appointment?.status === 1 ||
                                appointment?.status === 2) && (
                                <button
                                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95"
                                  onClick={() =>
                                    handleUpdateStatusAppointment(
                                      appointment.id,
                                      DA_HUY,
                                    )
                                  }
                                  title="Hủy lịch hẹn"
                                >
                                  <MdDeleteOutline size="1.4rem" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    /* Trạng thái trống (Empty State) */
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <p className="text-lg font-bold text-slate-600">
                            Không có lịch hẹn nào
                          </p>
                          <p className="text-sm mt-1">
                            Hiện tại danh sách lịch hẹn đang trống.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>Không có lịch khám nào !</div>
        )}
      </div>
      {totalPages > 1 && (
        <div>
          <Pagination setPage={setPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default MyAppointment;
