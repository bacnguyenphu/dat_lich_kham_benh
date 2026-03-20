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

function DetailMedicalPackage() {
  const [medicalPackage, setMedicalPackage] = useState(null);
  const [comments, setComments] = useState([]);

  const naviagte = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // const fetchMedicalPackage = async () => {
    //   const res = await getMedicalPackageById(id);
    //   if (res.err === 0) {
    //     setMedicalPackage(res.data);
    //   }
    // };
    // fetchMedicalPackage();
    const fetchMedicalPackageData = async () => {
      try {
        // Gọi cả 2 API cùng một lúc
        const [resPackage, resCmt] = await Promise.all([
          getMedicalPackageById(id),
          getCommentsByTarget(id, "package"),
        ]);

        // Xử lý data bác sĩ
        if (resPackage.err === 0) {
          setMedicalPackage(resPackage.data);
        }

        // Xử lý data comments
        // Giả sử API comments cũng trả về cấu trúc tương tự
        if (resCmt.err === 0) {
          setComments(resCmt.data);
        }
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu chi tiết gói khám: ", error);
      } finally {
        scrollToTop();
      }
    };
    if (id) {
      fetchMedicalPackageData();
    }
    scrollToTop();
  }, [id]);

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
              naviagte(MEDICAL_PACKAGE);
            }}
          >
            Danh mục khám tổng quát
          </span>
          <span className="">/</span>
          <span
            className="cursor-pointer"
            onClick={() => {
              naviagte(
                `${MEDICAL_PACKAGE}/${medicalPackage?.category_package?.slug}?id=${medicalPackage?.category_package?.id}`,
              );
            }}
          >
            {medicalPackage?.category_package?.name}
          </span>
          <span className="">/</span>
          <span className="text-black">{medicalPackage?.name}</span>
        </div>
      </div>
      <div className="mt-8 flex gap-5">
        <div className="rounded-full size-32 overflow-hidden w-1/6">
          <img
            className="object-center object-cover size-full"
            src={medicalPackage?.image ? medicalPackage?.image : defaultAvatar}
          />
        </div>
        <div className="w-5/6">
          <div className="flex items-center gap-2 text-black text-xl font-semibold">
            {medicalPackage?.name}
          </div>
          <p className="whitespace-pre-line mt-3 text-gray-700">
            {medicalPackage?.description}
          </p>
        </div>
      </div>

      <div className="flex gap-5 mt-8 ">
        <div className="w-1/2">
          <Schedules idMedicalPackage={id} />
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
              {medicalPackage?.price?.toLocaleString("vi-VN")}Đ
            </p>
          </div>
        </div>
      </div>
      <hr className="my-10 h-[1px] bg-gray-400" />
      <div className="prose">
        {medicalPackage && (
          <div
            dangerouslySetInnerHTML={{
              __html: medicalPackage?.description_detail?.description,
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
              Chưa có phản hồi nào cho gói khám này!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailMedicalPackage;
