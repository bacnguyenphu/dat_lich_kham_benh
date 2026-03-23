import { GoHome } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { DOCTORS, HOMEPAGE, SPECIALTY } from "../utils/path";
import { useState, useEffect } from "react";
import { getSpecialtyById } from "../services/specialtyService";
import { getDoctorFollowSpecialty } from "../services/doctorService";
import defaultAvatar from "../assets/defaultAvatar.png";
import { GiPositionMarker } from "react-icons/gi";
import { Pagination, Schedules } from "../components";
import { scrollToTop } from "../utils/scrollToTop";
import { FaMoneyBillWave } from "react-icons/fa";

function DetailSpecialty() {
  const navigate = useNavigate();
  const [specialty, setSpeciallty] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const limit = 7;
  const [page, setPage] = useState(1);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchSpecialty = async () => {
      const res = await getSpecialtyById(id);
      if (res.err === 0) setSpeciallty(res.data);
    };

    const fetchDoctor = async () => {
      const res = await getDoctorFollowSpecialty(id, limit, page);
      if (res.err === 0) {
        setDoctors(res.data);
        setTotalPages(res?.totalPage);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchSpecialty(), fetchDoctor()]);
    };

    if (id) {
      fetchData();
    }
    scrollToTop();
  }, [id, page]); // Thêm id vào mảng dependencies để auto update khi đổi chuyên khoa

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== BREADCRUMB (THANH ĐIỀU HƯỚNG) ===== */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500 mb-6">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(HOMEPAGE)}
          >
            <GoHome size={"1.2rem"} className="pb-[2px]" />
            <span>Trang chủ</span>
          </div>
          <span className="text-slate-300">/</span>
          <span
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(SPECIALTY)}
          >
            Khám chuyên khoa
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">
            {specialty?.name || "Chi tiết chuyên khoa"}
          </span>
        </div>

        {/* ===== THÔNG TIN CHUYÊN KHOA ===== */}
        {specialty && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
              Chuyên khoa {specialty?.name}
            </h1>
            <div
              className="prose prose-slate max-w-none prose-headings:text-blue-700 prose-a:text-blue-600 prose-img:rounded-xl leading-relaxed text-justify"
              dangerouslySetInnerHTML={{
                __html: specialty?.description_detail?.description,
              }}
            />
          </div>
        )}

        {/* ===== DANH SÁCH BÁC SĨ THUỘC CHUYÊN KHOA ===== */}
        {doctors && doctors.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Bác sĩ chuyên khoa {specialty?.name} ({doctors.length})
            </h2>

            <div className="flex flex-col gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col lg:flex-row gap-8 hover:shadow-md transition-shadow"
                >
                  {/* Bên trái: Thông tin Bác sĩ (Mobile: full, Desktop: 5 phần) */}
                  <div className="lg:w-5/12 flex flex-col sm:flex-row gap-5 items-start">
                    {/* Avatar */}
                    <div
                      className="shrink-0 cursor-pointer group flex flex-col items-center gap-2 mx-auto sm:mx-0"
                      onClick={() =>
                        navigate(`/${DOCTORS}/chi-tiet/${doctor.id}`)
                      }
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors">
                        <img
                          className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform"
                          src={
                            doctor?.user?.avatar
                              ? doctor?.user?.avatar
                              : defaultAvatar
                          }
                          alt="Avatar"
                        />
                      </div>
                      <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                        Xem hồ sơ
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3
                        className="text-lg md:text-xl font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors mb-2"
                        onClick={() =>
                          navigate(`/${DOCTORS}/chi-tiet/${doctor.id}`)
                        }
                      >
                        {doctor?.position?.map((item, index) => (
                          <span key={`pos-${item.id}`}>
                            {item.name}
                            {index === doctor?.position?.length - 1
                              ? " "
                              : ", "}
                          </span>
                        ))}
                        {doctor?.user?.firstName} {doctor?.user?.lastName}
                      </h3>
                      <p className="whitespace-pre-line text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {doctor?.description}
                      </p>
                      <div className="flex items-start justify-center sm:justify-start gap-1.5 text-slate-500 text-sm">
                        <GiPositionMarker className="text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-left">
                          {doctor?.user?.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Đường kẻ chia cắt trên Mobile */}
                  <div className="w-full h-px bg-slate-100 lg:hidden block"></div>

                  {/* Bên phải: Lịch khám & Giá (Mobile: full, Desktop: 7 phần) */}
                  <div className="lg:w-7/12 flex flex-col gap-4">
                    <div className="flex-1">
                      <Schedules idDoctor={doctor.id} />
                    </div>

                    {/* Khối giá khám (Price) */}
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                        <FaMoneyBillWave size={"1.2rem"} />
                      </div>
                      <span className="text-slate-600 font-medium">
                        Giá khám:
                      </span>
                      <p className="text-xl font-bold text-blue-600">
                        {doctor?.price?.toLocaleString("vi-VN")}{" "}
                        <span className="text-sm text-slate-500 font-normal">
                          VNĐ
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 0 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  setPage={setPage}
                  totalPages={totalPages}
                  currentPage={page}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailSpecialty;
