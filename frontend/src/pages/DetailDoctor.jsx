import { GoHome } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { HOMEPAGE, SPECIALTY } from "../utils/path";
import { useEffect, useState } from "react";
import { getDoctorById } from "../services/doctorService";
import { GiPositionMarker } from "react-icons/gi";
import defaultAvatar from "../assets/defaultAvatar.png";
import Schedules from "../components/Schedules";
import { scrollToTop } from "../utils/scrollToTop";
import { getCommentsByTarget } from "../services/commentService";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaMoneyBillWave, FaHospitalUser } from "react-icons/fa";

function DetailDoctor() {
  const [doctor, setDoctor] = useState(null);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();
  const { idDoctor } = useParams();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [resDoctor, resCmt] = await Promise.all([
          getDoctorById(idDoctor),
          getCommentsByTarget(idDoctor, "doctor"),
        ]);

        if (resDoctor.err === 0) setDoctor(resDoctor.data);
        if (resCmt.err === 0) setComments(resCmt.data);
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu chi tiết bác sĩ: ", error);
      } finally {
        scrollToTop();
      }
    };

    if (idDoctor) fetchDoctorData();
    scrollToTop();
  }, [idDoctor]);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Đang tải thông tin bác sĩ...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {doctor?.specialty?.length > 0 && (
            <>
              <span className="text-slate-300">/</span>
              <span
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() =>
                  navigate(
                    `${SPECIALTY}/${doctor.specialty[0].slug}?id=${doctor.specialty[0].id}`,
                  )
                }
              >
                {doctor.specialty[0].name}
              </span>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">Hồ sơ Bác sĩ</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
              <img
                className="object-cover object-top w-full h-full"
                src={
                  doctor?.user?.avatar ? doctor?.user?.avatar : defaultAvatar
                }
                alt="Avatar"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              {doctor?.position?.map((item) => (
                <span
                  key={`pos-${item.id}`}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md"
                >
                  {item.name}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              {doctor?.user?.firstName} {doctor?.user?.lastName}
            </h1>
            <p className="whitespace-pre-line text-slate-600 leading-relaxed">
              {doctor?.description}
            </p>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-slate-500 bg-slate-50 w-fit px-4 py-2 rounded-lg mx-auto md:mx-0">
              <GiPositionMarker
                className="text-blue-600 shrink-0"
                size={"1.2rem"}
              />
              <span className="text-sm">{doctor?.user?.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <Schedules idDoctor={idDoctor} />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FaHospitalUser size={"1.5rem"} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">
                  Địa chỉ khám
                </h3>
              </div>
              <p className="font-bold text-blue-700 text-lg">Nger Hospital</p>
              <p className="text-slate-600 mt-1">
                Thôn Tây Xuân Vy, xã Hoằng Thanh, huyện Hoằng Hóa, tỉnh Thanh
                Hóa
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <FaMoneyBillWave size={"1.5rem"} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">
                  Giá khám
                </h3>
              </div>
              <div className="flex items-baseline gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-3xl font-bold text-blue-600">
                  {doctor?.price?.toLocaleString("vi-VN")}
                </p>
                <span className="text-slate-500 font-medium">VNĐ / Lượt</span>
              </div>
            </div>
          </div>
        </div>

        {doctor?.description_detail?.description && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mt-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              Chi tiết chuyên môn
            </h3>
            <div
              className="prose prose-slate max-w-none prose-headings:text-blue-700 prose-a:text-blue-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{
                __html: doctor?.description_detail?.description,
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mt-6 mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Phản hồi từ bệnh nhân ({comments?.length || 0})
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
                Chưa có phản hồi nào cho bác sĩ này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailDoctor;
