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

function DetailDoctor() {
  const [doctor, setDoctor] = useState(null);
  const [comments, setComments] = useState([]);

  const naviagte = useNavigate();
  const { idDoctor } = useParams();

  useEffect(() => {
    // const fetchDoctor = async () => {
    //   try {
    //     const res = await getDoctorById(idDoctor);
    //     if (res.err === 0) {
    //       setDoctor(res.data);
    //     }
    //   } catch (error) {
    //     console.log("Lỗi không load được thông tin chi tiết bác sĩ", error);
    //   }
    // };
    // const fetchCmtOfDoctor = async () => {
    //   try {
    //     const res = await getCommentsByTarget(idDoctor, "doctor");
    //     console.log("Comments của doctor: ", res);
    //   } catch (error) {
    //     console.log("Lỗi khi lấy comments: ", error);
    //   }
    // };
    // fetchDoctor();
    const fetchDoctorData = async () => {
      try {
        // Gọi cả 2 API cùng một lúc
        const [resDoctor, resCmt] = await Promise.all([
          getDoctorById(idDoctor),
          getCommentsByTarget(idDoctor, "doctor"),
        ]);

        // Xử lý data bác sĩ
        if (resDoctor.err === 0) {
          setDoctor(resDoctor.data);
        }

        // Xử lý data comments
        // Giả sử API comments cũng trả về cấu trúc tương tự
        if (resCmt.err === 0) {
          setComments(resCmt.data);
        }
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu chi tiết bác sĩ: ", error);
      } finally {
        scrollToTop();
      }
    };

    if (idDoctor) {
      fetchDoctorData();
    }
    scrollToTop();
  }, [idDoctor]);

  return (
    <div className="lg:px-40 md:px-20 px-5 py-5">
      <div className="flex items-center">
        <span
          className="cursor-pointer"
          onClick={() => {
            naviagte(HOMEPAGE);
          }}
        >
          <GoHome color="#00A2A1" size={"1.25rem"} />
        </span>
        <div className="flex items-center gap-2 text-primary-100">
          <span className="">/</span>
          <span
            className="cursor-pointer"
            onClick={() => {
              naviagte(SPECIALTY);
            }}
          >
            Khám chuyên khoa
          </span>
          <span className="">/</span>
          <span
            className="cursor-pointer"
            onClick={() => {
              naviagte(
                `${SPECIALTY}/${doctor?.specialty[0]?.slug}?id=${doctor?.specialty[0].id}`,
              );
            }}
          >
            {doctor?.specialty[0].name}
          </span>
          <span className="">/</span>
          <div className="flex items-center gap-2 text-black">
            {doctor?.position.map((item) => {
              return (
                <p key={`pos-${item.id}`} className="">
                  {item.name}
                  {""}
                </p>
              );
            })}
            <p className="font-semibold">
              {doctor?.user?.firstName} {doctor?.user?.lastName}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-5">
        <div className="rounded-full size-32 overflow-hidden">
          <img
            className="object-center object-cover size-full"
            src={doctor?.user?.avatar ? doctor?.user?.avatar : defaultAvatar}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 text-black text-xl">
            {doctor?.position.map((item) => {
              return (
                <p key={`pos-${item.id}`} className="">
                  {item.name}
                  {""}
                </p>
              );
            })}
            <p className="font-semibold">
              {doctor?.user?.firstName} {doctor?.user?.lastName}
            </p>
          </div>
          <p className="whitespace-pre-line mt-3 text-gray-700">
            {doctor?.description}
          </p>
          <div className="mt-2 flex gap-1 items-center text-gray-700">
            <span>
              <GiPositionMarker />
            </span>
            <span>{doctor?.user?.address}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-5 mt-8 ">
        <div className="w-1/2">
          <Schedules idDoctor={idDoctor} />
        </div>
        <div className="w-1/2 pl-5">
          <div className="border-b border-gray-400 pb-4 w-fit">
            <h4 className="text-xl font-semibold">Địa chỉ khám</h4>
            <p className="font-semibold text-sm text-primary-100">
              Nger Hospital
            </p>
            <p className="text-sm">
              Thôn Tây Xuân Vy, Hoằng Thanh, Hoằng Hóa, Thanh Hóa
            </p>
          </div>
          <div className="flex gap-2 mt-3 items-center">
            <h4 className="text-xl">Giá khám :</h4>
            <p className="text-primary-100 underline">
              {doctor?.price?.toLocaleString("vi-VN")}Đ
            </p>
          </div>
        </div>
      </div>
      <hr className="my-10 border border-gray-400" />
      <div className="prose">
        {doctor && (
          <div
            dangerouslySetInnerHTML={{
              __html: doctor?.description_detail?.description,
            }}
          />
        )}
      </div>
      <hr className="mt-10 border border-gray-400" />
      <div className="mt-5">
        <h3 className="text-xl font-semibold">
          Phản hồi của bệnh nhân sau khi đi khám
        </h3>
        <div className="mt-10">
          {comments &&
            comments.length > 0 &&
            comments.map((cmt) => (
              <div key={cmt.id} className="mb-5 border-b border-gray-300 pb-3">
                <p className="font-semibold flex items-center">
                  {cmt.user.firstName} {cmt.user.lastName}{" "}
                  <span className="font-light text-blue-600 flex items-center">
                    <IoIosCheckmarkCircle className="text-blue-600 ml-1.5" />
                    đã khám ngày{" "}
                    {new Date(
                      cmt.Appointment?.appointment_date,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </p>
                <p>{cmt.content}</p>
              </div>
            ))}
          {comments && comments.length === 0 && (
            <p className="text-gray-500">
              Chưa có phản hồi nào cho bác sĩ này!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailDoctor;
