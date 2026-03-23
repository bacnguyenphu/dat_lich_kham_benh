import { useLocation, useNavigate } from "react-router-dom";
import cate_banner from "../assets/ic_banner.b9608702.png";
import { useEffect, useState } from "react";
import { getCategoryPackageById } from "../services/categoryPackageService";
import defaultAvatar from "../assets/default_image.webp";
import { GiPositionMarker } from "react-icons/gi";
import Schedules from "./Schedules";
import Pagination from "./Pagination";
import { getMedicalPackageFollowCategory } from "../services/medicalPackageService";
import { MEDICAL_PACKAGE } from "../utils/path";
import { FaMoneyBillWave } from "react-icons/fa";
import { scrollToTop } from "../utils/scrollToTop";

function ListMedicalPackgeFollowCategory() {
  // Tối ưu State: Chỉ cần gán null ban đầu, sau đó cập nhật cả cục data từ API
  const [categoryMedical, setCategoryMedical] = useState(null);
  const [medicalPackages, setMedicalPackages] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const limit = 7;
  const [page, setPage] = useState(1);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryMedical = async () => {
      const res = await getCategoryPackageById(id);
      if (res.err === 0) {
        setCategoryMedical(res.data);
      }
    };
    if (id) fetchCategoryMedical();
    scrollToTop();
  }, [id]);

  useEffect(() => {
    const fetchMedicalPackageFollowCategory = async () => {
      const res = await getMedicalPackageFollowCategory({
        idCategory: id,
        limit,
        page,
      });
      if (res.err === 0) {
        setMedicalPackages(res.data);
        setTotalPages(res?.totalPage);
      }
    };

    if (id) fetchMedicalPackageFollowCategory();
    scrollToTop();
  }, [id, page]);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div
        className="relative w-full min-h-[280px] bg-slate-800 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${cate_banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 bg-white/10 backdrop-blur-md rounded-full p-2 md:p-3 shadow-2xl border border-white/20">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center p-2">
                <img
                  src={categoryMedical?.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt={categoryMedical?.name}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
              {categoryMedical?.name || "Danh mục Gói khám"}
            </h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-3xl">
              {categoryMedical?.description ||
                "Bảo vệ sức khỏe toàn diện với các gói khám được thiết kế chuyên sâu, phù hợp với mọi độ tuổi và nhu cầu."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {medicalPackages && medicalPackages.length > 0 ? (
          <div className="flex flex-col gap-6">
            {medicalPackages.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col lg:flex-row gap-8 hover:shadow-md transition-shadow"
              >
                <div className="lg:w-5/12 flex flex-col sm:flex-row gap-5 items-start">
                  <div
                    className="shrink-0 cursor-pointer group flex flex-col items-center gap-2 mx-auto sm:mx-0"
                    onClick={() =>
                      navigate(
                        `${MEDICAL_PACKAGE}/${categoryMedical?.slug}/${item.id}`,
                      )
                    }
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors">
                      <img
                        className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform"
                        src={item?.image ? item?.image : defaultAvatar}
                        alt="Package"
                      />
                    </div>
                    <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                      Xem chi tiết
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3
                      className="text-lg md:text-xl font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors mb-2"
                      onClick={() =>
                        navigate(
                          `${MEDICAL_PACKAGE}/${categoryMedical?.slug}/${item.id}`,
                        )
                      }
                    >
                      {item.name}
                    </h3>
                    <p className="whitespace-pre-line text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                      {item?.description}
                    </p>
                    <div className="flex items-start justify-center sm:justify-start gap-1.5 text-slate-500 text-sm">
                      <GiPositionMarker className="text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-left">Nger Hospital</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100 lg:hidden block"></div>

                <div className="lg:w-7/12 flex flex-col gap-4">
                  <div className="flex-1">
                    <Schedules idMedicalPackage={item.id} />
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                      <FaMoneyBillWave size={"1.2rem"} />
                    </div>
                    <span className="text-slate-600 font-medium">
                      Giá khám:
                    </span>
                    <p className="text-xl font-bold text-blue-600">
                      {item?.price?.toLocaleString("vi-VN")}{" "}
                      <span className="text-sm text-slate-500 font-normal">
                        VNĐ
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center mt-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <GiPositionMarker className="text-slate-400" size="2rem" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Chưa có gói khám nào!
            </h3>
            <p className="text-slate-500">
              Danh mục này hiện tại đang được cập nhật thêm các gói khám mới.
              Vui lòng quay lại sau.
            </p>
          </div>
        )}

        {/* Phân trang */}
        {medicalPackages.length !== 0 && totalPages > 1 && (
          <div className="mt-10">
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

export default ListMedicalPackgeFollowCategory;
