import { useNavigate } from "react-router-dom";
import { DOCTORS, HOMEPAGE } from "../utils/path";
import { GoHome } from "react-icons/go";
import { useState, useEffect } from "react";
import { getDoctors } from "../services/doctorService";
import defaultAvatar from "../assets/defaultAvatar.png";
import Pagination from "./Pagination";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const limit = 12; // Mẹo: Đổi limit thành 12 để chia hết cho 2, 3 và 4 (số cột trên các màn hình) cho lưới luôn vuông vức
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await getDoctors(limit, page);
      if (res.err === 0) {
        setDoctors(res.data);
        setTotalPages(res.totalPage);
      }
    };
    fetchDoctors();
  }, [page]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(HOMEPAGE)}
          >
            <GoHome size={"1.2rem"} className="pb-[2px]" />
            <span>Trang chủ</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">Đội ngũ Bác sĩ</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Đội ngũ Bác sĩ chuyên môn cao
          </h1>
          <p className="text-slate-500 mt-2">
            Tìm kiếm và đặt lịch khám với các chuyên gia, bác sĩ hàng đầu tại
            Nger Hospital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {doctors.length > 0 ? (
            doctors.map((doctor) => {
              return (
                <div
                  key={`doctor-${doctor.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300"
                  onClick={() => navigate(`/${DOCTORS}/chi-tiet/${doctor.id}`)}
                >
                  {/* Avatar */}
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-blue-50 group-hover:border-blue-100 transition-colors shadow-sm relative">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      className="object-cover object-top w-full h-full group-hover:scale-110 transition-transform duration-500"
                      src={
                        doctor?.user?.avatar
                          ? doctor?.user?.avatar
                          : defaultAvatar
                      }
                      alt={`${doctor?.user?.firstName} ${doctor?.user?.lastName}`}
                    />
                  </div>
                  {/* Học hàm / Học vị */}
                  <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
                    {doctor?.position &&
                      doctor.position.map((item) => (
                        <span
                          key={`pos-${item.id}`}
                          className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-slate-100"
                        >
                          {item.name}
                        </span>
                      ))}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {doctor?.user?.firstName} {doctor?.user?.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4 font-medium px-2 line-clamp-2">
                    {doctor?.specialty && doctor.specialty.length > 0
                      ? doctor.specialty.map((spec) => spec.name).join(" • ")
                      : "Đang cập nhật chuyên khoa"}
                  </p>
                  <div className="mt-auto w-full pt-4 border-t border-slate-100">
                    <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-800 flex items-center justify-center gap-2">
                      Xem hồ sơ
                      <span className="group-hover:translate-x-1 transition-transform">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
              Đang tải danh sách bác sĩ...
            </div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              currentPage={page}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;
