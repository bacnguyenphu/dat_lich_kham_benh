import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicalPackageById } from "../services/medicalPackageService";
import { GoHome } from "react-icons/go";
import { HOMEPAGE, MEDICAL_PACKAGE } from "../utils/path";
import defaultAvatar from "../assets/default_image.webp";
import Schedules from "../components/Schedules";
import { scrollToTop } from "../utils/scrollToTop";
import { getCommentsByTarget } from "../services/commentService";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaHospitalUser, FaMoneyBillWave } from "react-icons/fa";

function DetailMedicalPackage() {
  const [medicalPackage, setMedicalPackage] = useState(null);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate(); // Đã fix lỗi chính tả 'naviagte'
  const { id } = useParams();

  useEffect(() => {
    const fetchMedicalPackageData = async () => {
      try {
        const [resPackage, resCmt] = await Promise.all([
          getMedicalPackageById(id),
          getCommentsByTarget(id, "package"),
        ]);

        if (resPackage.err === 0) setMedicalPackage(resPackage.data);
        if (resCmt.err === 0) setComments(resCmt.data);
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu chi tiết gói khám: ", error);
      } finally {
        scrollToTop();
      }
    };

    if (id) fetchMedicalPackageData();
    scrollToTop();
  }, [id]);

  if (!medicalPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Đang tải thông tin gói khám...
      </div>
    );
  }

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
            onClick={() => navigate(MEDICAL_PACKAGE)}
          >
            Danh mục khám tổng quát
          </span>

          {medicalPackage?.category_package && (
            <>
              <span className="text-slate-300">/</span>
              <span
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() =>
                  navigate(
                    `${MEDICAL_PACKAGE}/${medicalPackage.category_package.slug}?id=${medicalPackage.category_package.id}`,
                  )
                }
              >
                {medicalPackage.category_package.name}
              </span>
            </>
          )}

          <span className="text-slate-300">/</span>
          <span className="text-blue-600">Chi tiết gói khám</span>
        </div>

        {/* ===== THÔNG TIN GÓI KHÁM (HERO CARD) ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start mb-6">
          {/* Ảnh gói khám (Dùng bo góc vuông thay vì tròn) */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-blue-50 shadow-md">
              <img
                className="object-cover object-center w-full h-full"
                src={
                  medicalPackage?.image ? medicalPackage?.image : defaultAvatar
                }
                alt={medicalPackage?.name || "Ảnh gói khám"}
              />
            </div>
          </div>

          {/* Nội dung thông tin */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-3 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md">
              Gói khám toàn diện
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-tight">
              {medicalPackage?.name}
            </h1>
            <p className="whitespace-pre-line text-slate-600 leading-relaxed text-justify md:text-left">
              {medicalPackage?.description}
            </p>
          </div>
        </div>

        {/* ===== ĐẶT LỊCH & ĐỊA CHỈ (SPLIT GRID) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Cột trái: Component Đặt lịch (Chiếm 7 phần) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <Schedules idMedicalPackage={id} />
          </div>

          {/* Cột phải: Thông tin phòng khám & Giá (Chiếm 5 phần) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Box Địa chỉ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FaHospitalUser size={"1.5rem"} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">
                  Địa điểm thực hiện
                </h3>
              </div>
              <p className="font-bold text-blue-700 text-lg">Nger Hospital</p>
              <p className="text-slate-600 mt-1">
                Thôn Tây Xuân Vy, xã Hoằng Thanh, huyện Hoằng Hóa, tỉnh Thanh
                Hóa
              </p>
            </div>

            {/* Box Giá khám */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <FaMoneyBillWave size={"1.5rem"} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">
                  Chi phí trọn gói
                </h3>
              </div>
              <div className="flex items-baseline gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-3xl font-bold text-blue-600">
                  {medicalPackage?.price?.toLocaleString("vi-VN")}
                </p>
                <span className="text-slate-500 font-medium">VNĐ</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BÀI VIẾT CHI TIẾT ===== */}
        {medicalPackage?.description_detail?.description && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              Chi tiết gói khám
            </h3>
            <div
              className="prose prose-slate max-w-none prose-headings:text-blue-700 prose-a:text-blue-600 prose-img:rounded-xl text-justify"
              dangerouslySetInnerHTML={{
                __html: medicalPackage.description_detail.description,
              }}
            />
          </div>
        )}

        {/* ===== PHẢN HỒI (REVIEWS) ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Đánh giá từ khách hàng ({comments?.length || 0})
          </h3>

          <div className="flex flex-col gap-5">
            {comments && comments.length > 0 ? (
              comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-100"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <p className="font-bold text-slate-800 text-lg">
                      {cmt.user.firstName} {cmt.user.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                      <IoIosCheckmarkCircle size={"1.1rem"} />
                      <span>
                        Đã khám ngày{" "}
                        {new Date(
                          cmt.Appointment?.appointment_date,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{cmt.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Chưa có phản hồi nào cho gói khám này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailMedicalPackage;
