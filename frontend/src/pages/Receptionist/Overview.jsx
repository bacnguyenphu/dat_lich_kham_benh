import { useEffect, useState } from "react";
import { Statistical } from "../../components/Admin";
import { getAppointments } from "../../services/appointment";
import { CiSearch } from "react-icons/ci";
import { FaCheck, FaTimes } from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import dayjs from "dayjs";
import Pagination from "../../components/Pagination";

function Overview() {
  const [appointments, setAppointments] = useState([]);
  const [value, setValue] = useState(""); // Dùng cho ô tìm kiếm
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [page, setPage] = useState(1);

  // Fetch dữ liệu mỗi khi page hoặc chuỗi tìm kiếm (value) thay đổi
  useEffect(() => {
    const fetchAppointments = async () => {
      // Số 1 ở cuối có vẻ là trạng thái "Chờ duyệt"
      const res = await getAppointments("", limit, page, value, 1);
      if (res.err === 0) {
        setAppointments(res?.data || []);
        setTotalPages(res?.totalPage || 0);
      }
    };

    // Tối ưu: Dùng debounce nếu API gọi quá nhanh khi gõ phím (ở đây tạm gọi trực tiếp)
    const timeoutId = setTimeout(() => {
      fetchAppointments();
    }, 300); // Chờ 300ms sau khi ngừng gõ mới gọi API

    return () => clearTimeout(timeoutId);
  }, [page, value]);

  // Hàm hiển thị badge trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
            Chờ xác nhận
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
            Đã xác nhận
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">
            Không rõ
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full pb-8 scroll-auto">
      {/* KHỐI 1: THỐNG KÊ (STATISTICAL) */}
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Tổng quan hệ thống
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Số liệu thống kê và hoạt động gần đây
          </p>
        </div>
        <Statistical />
      </div>

      {/* KHỐI 2: DANH SÁCH CHỜ DUYỆT */}
      <div className="w-full">
        {/* Card Container */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          {/* Table Header & Search */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <LuCalendarClock className="text-blue-600" size="1.4rem" />
              <h2 className="text-lg font-bold text-slate-800">
                Lịch hẹn cần xử lý
              </h2>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {appointments.length}
              </span>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="text-slate-400" size="1.2rem" />
              </div>
              <input
                type="text"
                placeholder="Tìm bệnh nhân, SĐT..."
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setPage(1); // Khi search thì reset về trang 1
                }}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Bệnh nhân</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Thời gian hẹn</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Bệnh nhân */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-[15px] text-slate-800">
                          {apt.user.lastName} {apt.user.firstName}
                        </p>
                      </td>

                      {/* SĐT */}
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-md text-sm">
                          {apt.user.phone}
                        </span>
                      </td>

                      {/* Lịch khám */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 text-sm">
                          {dayjs(apt.appointment_date).format("DD/MM/YYYY")}
                        </div>
                        <div className="text-blue-600 font-semibold text-xs mt-0.5">
                          🕒 {apt.time}
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-6 py-4">
                        {getStatusBadge(apt.status)}
                      </td>

                      {/* Thanh toán */}
                      <td className="px-6 py-4">
                        {apt.payment_status ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                            <FaCheck size="0.7rem" /> Đã thanh toán
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">
                            Chưa thanh toán
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Nút Xác nhận */}
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
                            title="Duyệt lịch hẹn"
                            // onClick={() => handleConfirm(apt.id)} // TODO: Gắn API Duyệt
                          >
                            <FaCheck size="0.8rem" /> Xác nhận
                          </button>

                          {/* Nút Hủy */}
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-semibold transition-all active:scale-95"
                            title="Hủy lịch hẹn"
                            // onClick={() => handleCancel(apt.id)} // TODO: Gắn API Hủy
                          >
                            <FaTimes size="0.8rem" /> Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <LuCalendarClock
                          size="3rem"
                          className="mb-3 opacity-50"
                        />
                        <p className="text-lg font-bold text-slate-600">
                          Không có lịch hẹn chờ duyệt
                        </p>
                        <p className="text-sm mt-1">
                          Tất cả lịch hẹn đã được xử lý hoặc không tìm thấy kết
                          quả.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 bg-slate-50/50 py-3 rounded-b-2xl">
              <Pagination
                setPage={setPage}
                totalPages={totalPages}
                currentPage={page}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;
