import { useEffect, useState } from "react";
import {
  checkInConfirmation,
  getAppointments,
  paymentConfirmation,
  updateStatusAppointment,
} from "../../services/appointment";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckCircle, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { PiWarningCircleLight } from "react-icons/pi";
import { MdCheckBox } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaMoneyBillAlt, FaUserCheck, FaUserClock } from "react-icons/fa";
import dayjs from "dayjs";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import ModalInfoAppointment from "../../components/Receptionist/ModalInfoAppointment";

dayjs.locale("vi");
function AppointmentSchedule() {
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [page, setPage] = useState(1);

  const [appointments, setAppointments] = useState([]);
  const [checkInFilter, setCheckInFilter] = useState("false");

  // 99:Tat ca, 1: chờ xác nhận, 2: xác  nhận, 3 : đã xong, 0: đã huỷ
  const ALL = 99;
  const CHO_XAC_NHAN = 1;
  const XAC_NHAN = 2;
  const DA_XONG = 3;
  const DA_HUY = 0;
  const [filter, setFilter] = useState(XAC_NHAN);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  );
  const [isShowModal, setIsShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAppointment = async () => {
    const res = await getAppointments(
      undefined,
      limit,
      page,
      value,
      filter,
      selectedDate,
      checkInFilter,
    );
    if (res.err === 0) {
      setTotalPages(res?.totalPage);
      setAppointments(res?.data);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [page, filter, debouncedValue, selectedDate, checkInFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
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
      case 2:
        config = {
          title: "Xác nhận lịch khám?",
          text: "Hệ thống sẽ chuyển trạng thái sang Chờ khám.",
          icon: "question",
          confirmText: "Xác nhận",
          confirmColor: "#3b82f6",
          successMsg: "Xác nhận khám thành công!",
        };
        break;
      case 3:
        config = {
          title: "Hoàn tất khám bệnh?",
          text: "Xác nhận bệnh nhân này đã khám xong.",
          icon: "info",
          confirmText: "Hoàn tất",
          confirmColor: "#10b981",
          successMsg: "Đã cập nhật trạng thái hoàn tất!",
        };
        break;
      default:
        return;
    }

    Swal.fire({
      title: config.title,
      text: config.text,
      icon: config.icon,
      showCancelButton: true,
      confirmButtonColor: config.confirmColor,
      cancelButtonColor: "#94a3b8",
      confirmButtonText: config.confirmText,
      cancelButtonText: "Đóng",
      customClass: {
        popup: "rounded-2xl",
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

  const handlePaymentConfirm = async (idAppointment) => {
    if (!idAppointment) return;

    Swal.fire({
      title: "Xác nhận đã thu tiền?",
      text: "Hệ thống sẽ ghi nhận lịch hẹn này đã được thanh toán.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Xác nhận thu",
      cancelButtonText: "Đóng",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Gọi API cập nhật trạng thái thanh toán
          const res = await paymentConfirmation(idAppointment);

          if (res.err === 0) {
            toast.success("Xác nhận thanh toán thành công!");
            await fetchAppointment();
          } else {
            Swal.fire({
              title: "Thao tác thất bại!",
              text: res.message || "Vui lòng kiểm tra lại.",
              icon: "error",
              customClass: { popup: "rounded-2xl" },
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Lỗi hệ thống!",
            text: "Không thể kết nối đến máy chủ.",
            icon: "error",
            customClass: { popup: "rounded-2xl" },
          });
        }
      }
    });
  };

  const handleCheckInConfirm = async (idAppointment) => {
    if (!idAppointment) return;

    Swal.fire({
      title: "Xác nhận bệnh nhân đã đến?",
      text: "Đánh dấu bệnh nhân này đã có mặt tại phòng khám.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5", // Màu Indigo (tím xanh) để phân biệt
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Đã có mặt",
      cancelButtonText: "Đóng",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await checkInConfirmation(idAppointment, true);

          if (res.err === 0) {
            toast.success("Xác nhận Check-in thành công!");
            await fetchAppointment();
          } else {
            Swal.fire({
              title: "Check-in thất bại!",
              text:
                res.message ||
                "Không thể xác nhận, vui lòng tải lại trang và thử lại.",
              icon: "error",
              confirmButtonColor: "#3B82F6",
              customClass: { popup: "rounded-2xl" },
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Lỗi hệ thống!",
            text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.",
            icon: "error",
            confirmButtonColor: "#3B82F6",
            customClass: { popup: "rounded-2xl" },
          });
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Danh sách lịch hẹn</h2>
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

        {/* ===== KHỐI BỘ LỌC TỔNG HỢP ===== */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          {/* Bộ lọc Ngày */}
          <div className="relative w-full sm:w-[150px]">
            <input
              type="date"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Bộ lọc Check-in */}
          <div className="relative w-full sm:w-[160px]">
            <select
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-[14px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              value={checkInFilter}
              onChange={(e) => {
                setCheckInFilter(e.target.value);
                setPage(1);
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`,
              }}
            >
              <option value={"ALL"}>Tất cả</option>
              <option value={"true"}>Đã Check-in</option>
              <option value={"false"}>Chưa Check-in</option>
            </select>
          </div>

          {/* Bộ lọc Trạng thái */}
          <div className="relative w-full sm:w-[170px]">
            <select
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-[14px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`,
              }}
              value={filter}
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

      {/* ===== BẢNG DỮ LIỆU ===== */}
      <div className="mt-5">
        {appointments.length > 0 ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">STT</th>
                    <th className="px-6 py-4">Bệnh nhân</th>
                    <th className="px-6 py-4">Lịch hẹn</th>
                    <th className="px-6 py-4">Thông tin trạng thái </th>
                    {/* Đổi tên cột cho bao quát */}
                    <th className="px-6 py-4 text-center w-48">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment, index) => {
                    return (
                      <tr
                        className="hover:bg-slate-50/80 transition-colors group"
                        key={appointment.id}
                      >
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-slate-500">
                            {(page - 1) * limit + index + 1}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="font-bold text-[15px] text-slate-800">
                              {appointment?.patient?.fullName}
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                              {appointment?.patient?.phone}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start">
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

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            {/* 1. Trạng thái Khám */}
                            {appointment?.status === 1 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <GiSandsOfTime size="0.9rem" /> Chờ xác nhận
                              </span>
                            )}
                            {appointment?.status === 2 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaCheck size="0.8rem" /> Chờ khám
                              </span>
                            )}
                            {appointment?.status === 3 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaRegCheckCircle size="0.9rem" /> Đã khám xong
                              </span>
                            )}
                            {appointment?.status === 0 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-500 border border-red-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaRegTrashAlt size="0.8rem" /> Đã hủy
                              </span>
                            )}

                            {/* 2. Trạng thái Thanh toán */}
                            {!appointment?.payment_status ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <PiWarningCircleLight size="1rem" /> Chưa thanh
                                toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaRegCheckCircle size="0.9rem" /> Đã thanh toán
                              </span>
                            )}

                            {/* 3. Trạng thái Check-in */}
                            {appointment?.isCheckIn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaUserCheck size="0.9rem" /> Đã Check-in
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                <FaUserClock size="0.9rem" /> Chưa Check-in
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Nút Xem chi tiết */}
                            <button
                              className="flex items-center justify-center w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm active:scale-95"
                              title="Xem thông tin"
                              onClick={() => {
                                navigate(
                                  location.pathname + `?id=${appointment.id}`,
                                );
                                setIsShowModal(true);
                              }}
                            >
                              <FaRegEye size="0.9rem" />
                            </button>

                            {/* Nút Thanh toán */}
                            {!appointment?.payment_status &&
                              appointment?.status !== 0 && (
                                <button
                                  className="flex items-center justify-center w-8 h-8 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all active:scale-95 border border-teal-100"
                                  title="Xác nhận thanh toán"
                                  onClick={() =>
                                    handlePaymentConfirm(appointment.id)
                                  }
                                >
                                  <FaMoneyBillAlt size="1.1rem" />
                                </button>
                              )}

                            {/* Nút Check-in - Chỉ hiện khi chưa checkin và lịch chưa hủy/chưa khám xong */}
                            {!appointment?.isCheckIn &&
                              appointment?.status !== 0 &&
                              appointment?.status !== 3 && (
                                <button
                                  className="flex items-center justify-center w-8 h-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all active:scale-95 border border-indigo-100"
                                  title="Xác nhận Check-in"
                                  onClick={() =>
                                    handleCheckInConfirm(appointment.id)
                                  }
                                >
                                  <FaUserCheck size="1.1rem" />
                                </button>
                              )}

                            {/* Nút Xác nhận (Chuyển sang Chờ khám) */}
                            {appointment?.status === 1 && (
                              <button
                                className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors active:scale-95 border border-blue-100"
                                onClick={() =>
                                  handleUpdateStatusAppointment(
                                    appointment.id,
                                    XAC_NHAN,
                                  )
                                }
                                title="Xác nhận chờ khám"
                              >
                                <MdCheckBox size="1.2rem" />
                              </button>
                            )}

                            {/* Nút Hủy */}
                            {(appointment?.status === 1 ||
                              appointment?.status === 2) && (
                              <button
                                className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95 border border-red-100"
                                onClick={() =>
                                  handleUpdateStatusAppointment(
                                    appointment.id,
                                    DA_HUY,
                                  )
                                }
                                title="Hủy lịch hẹn"
                              >
                                <MdDeleteOutline size="1.2rem" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 w-full mt-4">
            <GiSandsOfTime className="text-slate-300 mb-3" size="3rem" />
            <p className="text-lg font-bold text-slate-600">
              Không có lịch hẹn nào
            </p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div>
          <Pagination setPage={setPage} totalPages={totalPages} />
        </div>
      )}
      {isShowModal && (
        <ModalInfoAppointment setIsShowModal={setIsShowModal} type={"INFO"} />
      )}
    </div>
  );
}

export default AppointmentSchedule;
