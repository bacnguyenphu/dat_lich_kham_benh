import { IoMdClose } from "react-icons/io";
import imageAvatarDefault from "../../assets/defaultAvatar.png";
import { useState, useEffect } from "react";
import DescriptionDetail from "./DescriptionDetail";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import {
  createSpecialty,
  deleteSpecialty,
  getSpecialtyById,
  updateSpecialty,
} from "../../services/specialtyService";
import { Validation } from "../../utils/validation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { TbCameraPlus } from "react-icons/tb";

function ModalCRUDspecialty({ setIsShowModal, type, fetchSpecialties }) {
  const [payload, setPayload] = useState({
    name: "",
    linkImg: null, // Giữ nguyên tên biến linkImg của bạn
    description_detail: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgUpload, setImgUpload] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  useEffect(() => {
    if (type !== "ADD" && id !== null) {
      const fetchSpecialty = async () => {
        const res = await getSpecialtyById(id);
        if (res.err === 0 && res.data) {
          setPayload({
            name: res.data.name,
            // Quan trọng: Gán ảnh từ API vào đúng biến linkImg để hiển thị
            linkImg: res.data.image || res.data.images,
            description_detail:
              res?.data?.description_detail?.description || "",
          });
        }
      };
      fetchSpecialty();
    }
  }, [id, type]);

  const handleClickClose = () => {
    setIsShowModal(false);
    if (type !== "ADD") {
      navigate(location.pathname);
    }
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL tạm thời để xem trước (Preview)
      setPayload((prev) => ({ ...prev, linkImg: URL.createObjectURL(file) }));
      setImgUpload(file);
    }
  };

  const handleClickAdd = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let finalLinkImg = null;
      if (imgUpload) {
        let formData = new FormData();
        formData.append("file", imgUpload);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        const res = await uploadImgCloudinary(formData);
        finalLinkImg = res.data.url;
      }
      const res = await createSpecialty({ ...payload, linkImg: finalLinkImg });
      if (res.err === 0) {
        fetchSpecialties();
        setIsShowModal(false);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickUpdate = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      // Nếu có ảnh mới (imgUpload) thì up lên Cloudinary, nếu không lấy lại ảnh cũ (payload.linkImg)
      let finalLinkImg = payload.linkImg;
      if (imgUpload) {
        let formData = new FormData();
        formData.append("file", imgUpload);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        const res = await uploadImgCloudinary(formData);
        finalLinkImg = res.data.url;
      }
      const res = await updateSpecialty({
        ...payload,
        linkImg: finalLinkImg,
        id: id,
      });
      if (res.err === 0) {
        fetchSpecialties();
        setIsShowModal(false);
        toast.success(res.message);
        navigate(location.pathname);
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deleteSpecialty(id);
    if (res.err === 0) {
      toast.success(res.message);
      setIsShowModal(false);
      navigate(location.pathname);
      fetchSpecialties();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  // Giao diện MODAL XÓA
  if (type === "DELETE") {
    return (
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-xl font-bold text-slate-800">Xóa chuyên khoa</p>
            <span
              className="cursor-pointer text-slate-400 hover:text-red-500"
              onClick={handleClickClose}
            >
              <IoMdClose size={"1.5rem"} />
            </span>
          </div>
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md">
              <img
                className="w-full h-full object-cover"
                alt="Avatar"
                src={payload.linkImg ? payload.linkImg : imageAvatarDefault}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageAvatarDefault;
                }}
              />
            </div>
            <p className="font-medium text-slate-600">
              Bạn chắc chắn muốn xóa chuyên khoa: <br />
              <span className="text-slate-800 font-bold text-lg">
                {payload.name}
              </span>
              ?
            </p>
          </div>
          <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t">
            <button
              className="bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold py-2 px-6 rounded-xl transition-colors"
              onClick={handleClickClose}
            >
              Thoát
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors"
              onClick={handleClickDelete}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Xóa ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện MODAL THÊM / SỬA
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <p className="text-2xl font-bold text-slate-800">
            {type === "ADD" ? "Thêm chuyên khoa mới" : "Chỉnh sửa chuyên khoa"}
          </p>
          <span
            className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
            onClick={handleClickClose}
          >
            <IoMdClose size={"1.8rem"} />
          </span>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Tên chuyên khoa */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Tên chuyên khoa <span className="text-red-500">*</span>
              </label>
              <input
                className={`border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                value={payload.name}
                placeholder="Nhập tên chuyên khoa..."
                onChange={(e) => {
                  setPayload({ ...payload, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <small className="text-red-500">{errors.name}</small>
              )}
            </div>

            {/* Hình ảnh */}
            <div className="shrink-0 flex flex-col items-center">
              <label className="text-sm font-bold text-slate-700 mb-2">
                Hình đại diện
              </label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-white flex items-center justify-center p-2">
                  <img
                    className="w-full h-full object-contain mix-blend-multiply"
                    alt="Specialty Icon"
                    src={payload.linkImg ? payload.linkImg : imageAvatarDefault}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imageAvatarDefault;
                    }}
                  />
                </div>
                <label
                  htmlFor="uploadAvatar"
                  className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full border border-slate-200 shadow-md cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <TbCameraPlus size="1.2rem" />
                </label>
                <input
                  type="file"
                  hidden
                  id="uploadAvatar"
                  onChange={handleImg}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* CKEditor Mô tả */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </p>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <DescriptionDetail
                type={type}
                payload={payload}
                setPayload={setPayload}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 justify-end px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={handleClickClose}
          >
            Thoát
          </button>

          {type === "ADD" && (
            <button
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-colors"
              onClick={handleClickAdd}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Thêm chuyên khoa"
              )}
            </button>
          )}

          {type === "UPDATE" && (
            <button
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md transition-colors"
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

export default ModalCRUDspecialty;
