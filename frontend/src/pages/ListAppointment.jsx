import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";
import { GoHome } from "react-icons/go";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAppointmentOfUser,
  updateStatusAppointment,
} from "../services/appointment";
import { InfoAppointment, Pagination } from "../components";
import { IoClose } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { PiWarningCircleLight } from "react-icons/pi";
import { FaRegCheckCircle, FaRegTrashAlt, FaUserAlt } from "react-icons/fa"; // Nhớ import thêm FaUserAlt
import { VscFeedback } from "react-icons/vsc";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalComment from "../components/ModalComment";

function ListAppointment() {
  const navigate = useNavigate();
  const idUser = useSelector((state) => state?.auth?.data?.id);
  const [infoAppointments, setInfoAppointment] = useState([]);

  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalCmt, setIsShowModalCmt] = useState(false);
  const [infoAppointmentCmt, setInfoAppointmentCmt] = useState(null);

  const fetchAppointment = async () => {
    const res = await getAppointmentOfUser(idUser, limit, page);

    if (res.err === 0 && res?.data) {
      setTotalPages(res.totalPage);
      let data = res.data
        .map((item) => {
          if (item?.doctor) {
            return {
              id: item.id,
              status: item.status,
              name:
                (item?.doctor?.position?.map((pos) => pos.name).join(", ") ||
                  "") +
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
              infoPatient: item?.patient, // Data patient từ API
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
              infoPatient: item?.patient, // Data patient từ API
            };
          }
          return null;
        })
        .filter(Boolean);
      setInfoAppointment(data);
    }
  };

  useEffect(() => {
    if (idUser) {
      fetchAppointment();
    }
  }, [idUser, page]);

  const handleClickCancelAppointment = async (idAppointmemt) => {
    if (idAppointmemt) {
      Swal.fire({
        title: "Hủy lịch khám?",
        text: "Bạn có chắc chắn muốn hủy lịch khám này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#94A3B8",
        confirmButtonText: "Đồng ý Hủy",
        cancelButtonText: "Quay lại",
        customClass: { popup: "rounded-2xl" }, // Thêm bo góc cho mượt
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await updateStatusAppointment(idAppointmemt, 0);
          if (res.err === 0) {
            toast.success("Đã hủy lịch khám thành công!");
            await fetchAppointment();
          } else {
            Swal.fire({
              title: "Lỗi",
              text: "Hủy lịch hẹn không thành công!",
              icon: "error",
              confirmButtonColor: "#3B82F6",
              customClass: { popup: "rounded-2xl" },
            });
          }
        }
      });
    }
  };

  const handleClickShowModalCmt = () => {
    setIsShowModalCmt(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(HOMEPAGE)}
          >
            <GoHome size={"1.2rem"} className="pb-[2px]" />
            <span>Trang chủ</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 font-bold">Lịch sử khám bệnh</span>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Lịch hẹn của tôi
          </h1>
        </div>

        {/* Danh sách Lịch khám */}
        <div className="flex flex-col gap-6">
          {infoAppointments.length > 0 ? (
            infoAppointments.map((item) => {
              // Bóc tách infoPatient ra để hiển thị riêng
              const { id, status, payment_status, infoPatient, ...other } =
                item;

              return (
                <div
                  key={id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Dải màu đánh dấu (Tùy chọn cho đẹp) */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${status === 0 ? "bg-red-400" : status === 3 ? "bg-green-400" : "bg-blue-400"}`}
                  ></div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-2">
                    <div className="flex-1">
                      {/* Component gốc của bạn */}
                      <InfoAppointment infoAppointment={other} />

                      {/* HIỂN THỊ THÔNG TIN BỆNH NHÂN (MỚI THÊM) */}
                      {infoPatient && (
                        <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center shadow-sm">
                            <FaUserAlt size="0.9rem" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                              Hồ sơ bệnh nhân
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {infoPatient.fullName}{" "}
                              <span className="font-medium text-slate-500">
                                - {infoPatient.phone}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nút Hành động */}
                    <div className="flex items-center justify-end sm:justify-start gap-2 -mt-2 sm:mt-0">
                      {(status === 1 || status === 2) && (
                        <Tippy content="Hủy lịch khám" placement="top">
                          <button
                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                            onClick={() => handleClickCancelAppointment(id)}
                          >
                            <IoClose size={"1.8rem"} />
                          </button>
                        </Tippy>
                      )}
                      {status === 3 && (
                        <Tippy content="Đánh giá & Nhận xét" placement="top">
                          <button
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            onClick={() => {
                              setInfoAppointmentCmt(item);
                              handleClickShowModalCmt();
                            }}
                          >
                            <VscFeedback size={"1.5rem"} />
                          </button>
                        </Tippy>
                      )}
                    </div>
                  </div>

                  <hr className="my-5 border-slate-100 ml-2" />

                  {/* Nhãn trạng thái (Badges) */}
                  <div className="flex flex-wrap items-center gap-3 ml-2">
                    {/* ... (Các trạng thái của bạn được giữ nguyên) ... */}
                    {status === 1 && (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200">
                        <GiSandsOfTime size="1rem" /> Chờ xác nhận
                      </span>
                    )}
                    {status === 2 && (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                        <FaCheck size="1rem" /> Đã xác nhận (Chờ khám)
                      </span>
                    )}
                    {status === 3 && (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-semibold bg-green-50 text-green-600 border border-green-200">
                        <FaRegCheckCircle size="1rem" /> Đã khám xong
                      </span>
                    )}
                    {status === 0 && (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-semibold bg-red-50 text-red-500 border border-red-200">
                        <FaRegTrashAlt size="0.9rem" /> Đã hủy
                      </span>
                    )}

                    {!payment_status ? (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        <PiWarningCircleLight size="1.1rem" /> Chưa thanh toán
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <FaRegCheckCircle size="1rem" /> Đã thanh toán
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <GiSandsOfTime className="text-slate-300 mb-3" size="3rem" />
              <h3 className="text-lg font-bold text-slate-700">
                Chưa có lịch hẹn nào
              </h3>
              <p className="text-slate-500 mt-1">
                Bạn chưa đặt lịch khám nào trên hệ thống.
              </p>
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => navigate(HOMEPAGE)}
              >
                Đặt lịch ngay
              </button>
            </div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              currentPage={page}
            />
          </div>
        )}

        {/* Modal Nhận xét */}
        {isShowModalCmt && infoAppointmentCmt && (
          <ModalComment
            infoAppointmentCmt={infoAppointmentCmt}
            setIsShowModalCmt={setIsShowModalCmt}
          />
        )}
      </div>
    </div>
  );
}

export default ListAppointment;
