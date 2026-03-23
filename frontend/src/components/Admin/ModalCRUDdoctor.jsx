import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getPostions } from "../../services/positionService";
import { getSpecialties } from "../../services/specialtyService";
import imageAvatarDefault from "../../assets/defaultAvatar.png";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import {
  createDoctor,
  deleteDoctorById,
  getDoctorById,
  updateDoctor,
} from "../../services/doctorService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Validation } from "../../utils/validation";
import FormInfoDoctor from "../FormInfoDoctor";

function ModalCRUDdoctor({ type, setIsShowModal, fectDoctors }) {
  const [postions, setPositions] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    role: "R2",
    phone: "",
    email: "",
    password: "",
    dateOfBirth: new Date().toISOString().split("T")[0],
    gender: "male",
    address: "",
    avatar: null,
    price: "",
    description: "",
    id_specialty: [],
    id_position: [],
    description_detail: "",
  });

  const [imgUpload, setImgUpload] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idDoctor = query.get("id");

  useEffect(() => {
    const fetchPostions = async () => {
      const res = await getPostions();
      if (res.err === 0) setPositions(res.data);
    };
    const fetchSpecialties = async () => {
      const res = await getSpecialties();
      if (res.err === 0) setSpecialties(res.data);
    };
    const fetchData = async () => {
      await Promise.all([fetchPostions(), fetchSpecialties()]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (idDoctor && postions.length > 0 && specialties.length > 0) {
      const fetchDataDoctor = async () => {
        const res = await getDoctorById(idDoctor);
        if (res.err === 0) {
          setPayload({
            firstName: res?.data?.user?.firstName,
            lastName: res?.data?.user?.lastName,
            role: "R2",
            phone: res?.data?.user?.phone,
            email: res?.data?.user?.email,
            password: "",
            dateOfBirth: res?.data?.user?.dateOfBirth?.split("T")[0],
            gender: res?.data?.user?.gender,
            address: res?.data?.user?.address,
            avatar: res?.data?.user?.avatar,
            price: res?.data?.price,
            description: res?.data?.description,
            id_specialty: res?.data?.specialty.map((item) => item.id),
            id_position: res?.data?.position.map((item) => item.id),
            description_detail:
              res?.data?.description_detail?.description || "",
          });
        }
      };
      fetchDataDoctor();
    }
  }, [idDoctor, postions, specialties]);

  const handleClickAdd = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let linkImg = null;
      if (imgUpload) {
        try {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        } catch (error) {
          toast.error("Lỗi upload ảnh!");
          setIsLoading(false);
          return;
        }
      }
      const res = await createDoctor({ ...payload, avatar: linkImg });
      if (res.err === 0) {
        toast.success(res.message);
        setIsShowModal(false);
        navigate(location.pathname);
        fectDoctors();
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deleteDoctorById(idDoctor);
    if (res.err === 0) {
      setIsShowModal(false);
      navigate(location.pathname);
      toast.success(res.message);
      fectDoctors();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const handleClickUpdate = async () => {
    const { password, ...other } = payload;
    if (Validation(other, setErrors)) {
      setIsLoading(true);
      let linkImg = payload?.linkImg || payload?.avatar;
      if (imgUpload) {
        try {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        } catch (error) {
          toast.error("Lỗi upload ảnh!");
          setIsLoading(false);
          return;
        }
      }
      const res = await updateDoctor({ idDoctor, ...payload, avatar: linkImg });
      if (res.err === 0) {
        setIsShowModal(false);
        navigate(location.pathname);
        toast.success(res.message);
        fectDoctors();
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickClose = () => {
    setIsShowModal(false);
    if (type !== "ADD") {
      navigate(location.pathname);
    }
  };

  // Render Modal XÓA (Delete)
  if (type === "DELETE") {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col animate-[fadeIn_0.2s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Xóa Bác sĩ</h3>
            <button
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              onClick={handleClickClose}
            >
              <IoMdClose size={"1.5rem"} />
            </button>
          </div>
          {/* Body */}
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md mb-4">
              <img
                className="w-full h-full object-cover"
                alt="Avatar"
                src={payload?.avatar || imageAvatarDefault}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageAvatarDefault;
                }}
              />
            </div>
            <p className="text-slate-600 text-[15px]">
              Bạn có chắc chắn muốn xóa bác sĩ <br />
              <span className="font-bold text-slate-800 text-lg">
                {payload.firstName} {payload.lastName}
              </span>{" "}
              khỏi hệ thống?
            </p>
            <p className="text-sm text-red-500 mt-2 bg-red-50 px-3 py-1 rounded-lg">
              Hành động này không thể hoàn tác!
            </p>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button
              className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              onClick={handleClickClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm transition-colors disabled:opacity-70"
              onClick={handleClickDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Xóa bác sĩ"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Modal THÊM / SỬA / XEM (Add/Update/View)
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col animate-[fadeIn_0.2s_ease-out]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl shrink-0">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            {type === "ADD" && "Thêm bác sĩ mới"}
            {type === "VIEW" && "Thông tin chi tiết Bác sĩ"}
            {type === "UPDATE" && "Cập nhật hồ sơ Bác sĩ"}
          </h3>
          <button
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            onClick={handleClickClose}
          >
            <IoMdClose size={"1.5rem"} />
          </button>
        </div>

        {/* Scrollable Body chứa Form */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 custom-scrollbar">
          <FormInfoDoctor
            payload={payload}
            setPayload={setPayload}
            idDoctor={idDoctor}
            setImgUpload={setImgUpload}
            errors={errors}
            type={type}
          />
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-4 px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl shrink-0">
          <button
            className="px-6 py-2.5 font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={handleClickClose}
            disabled={isLoading}
          >
            Đóng
          </button>

          {type === "ADD" && (
            <button
              className="flex items-center justify-center gap-2 px-8 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-colors disabled:opacity-70"
              onClick={handleClickAdd}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Thêm bác sĩ"
              )}
            </button>
          )}

          {type === "UPDATE" && (
            <button
              className="flex items-center justify-center gap-2 px-8 py-2.5 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md transition-colors disabled:opacity-70"
              onClick={handleClickUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCRUDdoctor;
