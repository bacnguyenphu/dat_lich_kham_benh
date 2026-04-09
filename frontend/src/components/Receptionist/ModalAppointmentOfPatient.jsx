import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { getAppointmetOfPatient } from "../../services/appointment";
import dayjs from "dayjs";
import {
  FaCalendarAlt,
  FaRegClock,
  FaUserMd,
  FaCheck,
  FaRegCheckCircle,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";

// IMPORT THƯ VIỆN INFINITE SCROLL Ở ĐÂY
import InfiniteScroll from "react-infinite-scroll-component";

function ModalAppointmentOfPatient({ setIsShowModal, navigate, location }) {
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const res = await getAppointmetOfPatient(id, limit, page);
        if (res && res.err === 0) {
          let data = res.data
            .map((item) => {
              if (item?.doctor) {
                return {
                  id: item.id,
                  status: item.status,
                  name:
                    (item?.doctor?.position
                      ?.map((pos) => pos.name)
                      .join(", ") || "") +
                    " - " +
                    item?.doctor?.user?.firstName +
                    " " +
                    item?.doctor?.user?.lastName,
                  price: item?.doctor?.price.toLocaleString("vi-VN"),
                  image: item?.doctor?.user?.avatar,
                  time_frame: item?.time,
                  appointment_date: item?.appointment_date,
                  payment_status: item?.payment_status,
                  doctorId: item?.doctor?.id,
                  medicalPackageId: null,
                  infoPatient: item?.patient,
                };
              }
              if (item?.medical_package) {
                return {
                  id: item.id,
                  status: item.status,
                  name: item?.medical_package?.name,
                  price: item?.medical_package?.price,
                  image: item?.medical_package?.image,
                  time_frame: item?.time,
                  appointment_date: item?.appointment_date,
                  payment_status: item?.payment_status,
                  medicalPackageId: item?.medical_package?.id,
                  doctorId: null,
                  infoPatient: item?.patient,
                };
              }
              return null;
            })
            .filter(Boolean);

          setAppointments((prev) => [...prev, ...data]);
          setHasMore(page < res.totalPage);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách lịch hẹn:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [page, id]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold">
            <GiSandsOfTime /> Chờ xác nhận
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold">
            <FaCheck /> Chờ khám
          </span>
        );
      case 3:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-bold">
            <FaRegCheckCircle /> Đã khám xong
          </span>
        );
      case 0:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-500 rounded-lg text-[11px] font-bold">
            <FaRegTrashAlt /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out] max-h-[90vh]">
        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Lịch sử khám bệnh
            </h2>
            {appointments.length > 0 && (
              <p className="text-sm font-medium text-slate-500 mt-1">
                Bệnh nhân:{" "}
                <span className="text-blue-600 font-bold">
                  {appointments[0]?.infoPatient?.fullName}
                </span>
              </p>
            )}
          </div>
          <button
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            onClick={() => {
              setIsShowModal(false);
              navigate(location.pathname);
            }}
          >
            <IoMdClose size="1.5rem" />
          </button>
        </div>

        {/* ===== BODY (THÊM id="scrollableDiv" ĐỂ THƯ VIỆN NHẬN DIỆN VÙNG CUỘN) ===== */}
        <div
          id="scrollableDiv"
          className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50"
        >
          {appointments.length === 0 && !isLoading ? (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3">
                <FaCalendarAlt size="2rem" />
              </div>
              <p className="text-slate-600 font-semibold text-lg">
                Chưa có lịch sử khám
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Bệnh nhân này chưa từng đặt lịch hẹn nào.
              </p>
            </div>
          ) : (
            /* ===== TÍCH HỢP INFINITE SCROLL ===== */
            <InfiniteScroll
              dataLength={appointments.length} // Bắt buộc: Số lượng item hiện tại
              next={() => setPage((prev) => prev + 1)} // Hàm gọi khi cuộn tới đáy (Tăng page)
              hasMore={hasMore} // Biến cờ kiểm tra còn data để tải không
              loader={
                // UI hiển thị lúc đang call API tải thêm
                <div className="flex justify-center items-center py-4 mt-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-slate-500 font-medium">
                    Đang tải thêm...
                  </span>
                </div>
              }
              endMessage={
                // UI hiển thị khi hasMore = false (hết cục data)
                appointments.length > 0 && (
                  <p className="text-center text-sm text-slate-400 mt-6 mb-2 font-medium">
                    Đã hiển thị toàn bộ lịch sử khám.
                  </p>
                )
              }
              scrollableTarget="scrollableDiv" // Bắt buộc: Trỏ ID tới thẻ div có overflow-y-auto bọc ngoài cùng
            >
              <div className="flex flex-col gap-4">
                {appointments.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Ảnh Bác sĩ / Gói khám */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserMd className="text-slate-300" size="2rem" />
                      )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-[15px] line-clamp-2 leading-snug">
                          {item.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 mt-2.5">
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                            <FaCalendarAlt className="text-slate-400 pb-[1px]" />
                            {dayjs(item.appointment_date).format("DD/MM/YYYY")}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-2 rounded-md">
                            <FaRegClock className="pb-[1px]" />
                            {item.time_frame}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 border-dashed">
                        <div className="flex items-center gap-1.5 font-bold text-orange-600 text-sm">
                          <MdOutlinePayment size="1.2rem" />
                          {item.price} VNĐ
                        </div>

                        <div className="flex items-center gap-2">
                          {item.payment_status ? (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[11px] font-bold uppercase">
                              Đã thu tiền
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[11px] font-bold uppercase">
                              Chưa thu
                            </span>
                          )}
                          {renderStatusBadge(item.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalAppointmentOfPatient;
