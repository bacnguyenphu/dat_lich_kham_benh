import { useLocation, useNavigate } from "react-router-dom";
import InfoAppointment from "../InfoAppointment";
import { useEffect, useState } from "react";
import {
  getAppointmentById,
  updateStatusAppointment,
} from "../../services/appointment";
import { IoMdClose } from "react-icons/io";
import { FaPhoneAlt, FaTimes, FaUserAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ModalInfoAppointment({ setIsShowModal, type, fetchAppointments }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [infoAppointment, setInfoAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  useEffect(() => {
    const fetchInfoAppointment = async () => {
      try {
        const res = await getAppointmentById(id);
        if (res.err === 0 && res.data) {
          if (res?.data?.doctor) {
            setInfoAppointment({
              id: res.data.id,
              status: res.data.status,
              name:
                (res.data?.doctor?.position
                  ?.map((pos) => pos.name)
                  .join(", ") || "") +
                " - " +
                res.data?.doctor?.user?.firstName +
                " " +
                res.data?.doctor?.user?.lastName,
              price: res.data?.doctor?.price.toLocaleString("vi-VN"),
              image: res.data?.doctor?.user?.avatar,
              time_frame: res.data?.time,
              appointment_date: res.data?.appointment_date,
              payment_status: res.data?.payment_status,
              doctorId: res.data?.doctor?.id,
              medicalPackageId: null,
              patientName: res.data?.patient?.fullName,
              patientPhone: res.data?.patient?.phone,
            });
          } else if (res?.data?.medical_package) {
            setInfoAppointment({
              id: res.data.id,
              status: res.data.status,
              name: res.data?.medical_package?.name,
              price: res.data?.medical_package?.price,
              image: res.data?.medical_package?.image,
              time_frame: res.data?.time,
              appointment_date: res.data?.appointment_date,
              payment_status: res.data?.payment_status,
              medicalPackageId: res.data?.medical_package?.id,
              doctorId: null,
              patientName: res.data?.patient?.fullName,
              patientPhone: res.data?.patient?.phone,
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin lịch hẹn:", error);
        setIsShowModal(false);
        navigate(location.pathname);
      }
    };
    if (id) {
      fetchInfoAppointment();
    }
  }, [id, location.pathname, navigate, setIsShowModal]);

  const handleClickSubmit = async (status) => {
    if (status === 0 && !cancelReason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối!");
      return;
    }

    if (id) {
      const res = await updateStatusAppointment(id, status, cancelReason);
      if (res.err === 0) {
        toast.success(
          status === 2
            ? "Duyệt lịch hẹn thành công, cuộc hẹn được đưa vào lịch làm việc !"
            : "Từ chối lịch hẹn thành công !",
        );
        await fetchAppointments();
      } else {
        Swal.fire({
          title: "Thao tác không thành công !",
          icon: "error",
        });
      }
      setIsShowModal(false);
      navigate(location.pathname);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header - Giảm py-5 xuống py-4 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {type === "DUYET"
              ? "Duyệt lịch hẹn"
              : type === "TU_CHOI"
                ? "Từ chối lịch hẹn"
                : "Chi tiết lịch hẹn"}
          </h2>
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

        {/* Body - Tăng max-h-[85vh], giảm space-y-4 */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <InfoAppointment infoAppointment={infoAppointment} />
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Thông tin bệnh nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FaUserAlt size="1rem" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Họ và tên
                  </p>
                  <p className="font-bold text-[15px] text-slate-800 mt-0.5">
                    {infoAppointment?.patientName || "Đang cập nhật..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FaPhoneAlt size="1rem" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Số điện thoại
                  </p>
                  <p className="font-bold text-[15px] text-slate-800 mt-0.5">
                    {infoAppointment?.patientPhone || "Đang cập nhật..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form nhập lý do từ chối - Đã giảm padding và số hàng Textarea */}
          {type === "TU_CHOI" && (
            <div className="border border-red-200 bg-red-50/50 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-red-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Lý do từ chối <span className="text-red-500">*</span>
              </h3>
              <textarea
                className="w-full p-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none bg-white transition-all text-sm"
                rows="2"
                placeholder="Nhập lý do từ chối lịch hẹn để gửi thông báo..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer - Giảm py-5 xuống py-4 */}
        <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            className="px-5 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => {
              setIsShowModal(false);
              navigate(location.pathname);
            }}
          >
            Đóng
          </button>
          {type === "DUYET" && (
            <button
              className="flex items-center justify-center gap-2 px-7 py-2.5 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95"
              onClick={() => handleClickSubmit(2)}
            >
              <FaCheck size="1.1rem" />
              <span>Duyệt lịch</span>
            </button>
          )}

          {type === "TU_CHOI" && (
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors active:scale-95"
              onClick={() => handleClickSubmit(0)}
            >
              <FaTimes size="1.1rem" />
              <span>Xác nhận từ chối</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalInfoAppointment;
