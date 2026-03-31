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
              patientName:
                res.data?.user?.firstName + " " + res.data?.user?.lastName,
              patientPhone: res.data?.user?.phone,
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
              patientName:
                res.data?.user?.firstName + " " + res.data?.user?.lastName,
              patientPhone: res.data?.user?.phone,
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
  }, [id]);

  const handleClickSubmit = async (status) => {
    if (status && id) {
      const res = await updateStatusAppointment(id, status);
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
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50">
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

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5">
            <InfoAppointment infoAppointment={infoAppointment} />
          </div>

          <div className="border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Thông tin bệnh nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FaUserAlt size="1.1rem" />
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
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FaPhoneAlt size="1.1rem" />
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
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50">
          <button
            className="px-6 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => {
              setIsShowModal(false);
              navigate(location.pathname);
            }}
          >
            Đóng
          </button>
          {type === "DUYET" && (
            <button
              className="flex items-center justify-center gap-2 px-8 py-2.5 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95"
              onClick={() => handleClickSubmit(2)}
            >
              <FaCheck size="1.1rem" />
              <span>Duyệt lịch</span>
            </button>
          )}

          {type === "TU_CHOI" && (
            <button
              className="flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors active:scale-95"
              onClick={() => handleClickSubmit(3)}
            >
              <FaTimes size="1.1rem" />
              <span>Từ chối</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalInfoAppointment;
