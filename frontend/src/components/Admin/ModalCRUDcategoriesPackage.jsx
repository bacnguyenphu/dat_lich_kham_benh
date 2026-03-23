import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCategoryPackageById,
  createCategoryPackage,
  deleteCategoryPackage,
  updateCategoryPackage,
} from "../../services/categoryPackageService";
import imageAvatarDefault from "../../assets/default_image.webp";
import { TbCameraPlus } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { toast } from "react-toastify";

function ModalCRUDcategoriesPackage({
  type,
  setIsShowModal,
  fetchCategoriesPackage,
}) {
  const [payload, setPayload] = useState({
    name: "",
    image: null,
    description: "",
  });
  const [imgUpload, setImgUpload] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  useEffect(() => {
    if (type === "UPDATE" && id !== null) {
      const fetchCategoriesPackageById = async () => {
        const res = await getCategoryPackageById(id);
        if (res.err === 0) {
          setPayload({
            name: res.data?.name,
            image: res.data?.image,
            description: res.data?.description,
          });
        }
      };
      fetchCategoriesPackageById();
    }
  }, [id, type]);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPayload((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
      setImgUpload(file);
    }
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleClickClose = () => {
    setIsShowModal(false);
    if (type !== "ADD") navigate(location.pathname);
  };

  const handleClickAdd = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let linkImg = null;
      if (imgUpload) {
        let formData = new FormData();
        formData.append("file", imgUpload);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        const res = await uploadImgCloudinary(formData);
        linkImg = res.data.url;
      }
      const res = await createCategoryPackage({ ...payload, linkImg: linkImg });
      if (res.err === 0) {
        fetchCategoriesPackage();
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
      let linkImg = payload?.image;
      if (imgUpload) {
        let formData = new FormData();
        formData.append("file", imgUpload);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        const res = await uploadImgCloudinary(formData);
        linkImg = res.data.url;
      }
      const res = await updateCategoryPackage({
        ...payload,
        image: linkImg,
        id: id,
      });
      if (res.err === 0) {
        fetchCategoriesPackage();
        setIsShowModal(false);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deleteCategoryPackage(id);
    if (res.err == 0) {
      toast.success(res.message);
      setIsShowModal(false);
      navigate(location.pathname);
      fetchCategoriesPackage();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <p className="text-xl font-bold text-slate-800">
            {type === "ADD" && "Thêm danh mục mới"}
            {type === "UPDATE" && "Chỉnh sửa danh mục"}
            {type === "DELETE" && "Xác nhận xóa"}
          </p>
          <span
            className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
            onClick={handleClickClose}
          >
            <IoMdClose size={"1.5rem"} />
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {type !== "DELETE" ? (
            <div className="space-y-6">
              {/* Tên danh mục */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                  name="name"
                  placeholder="Nhập tên danh mục..."
                  value={payload.name}
                  onChange={handleOnchange}
                />
                {errors.name && (
                  <small className="text-red-500">{errors.name}</small>
                )}
              </div>

              {/* Hình ảnh */}
              <div className="flex flex-col items-center gap-3">
                <label className="text-sm font-bold text-slate-700 w-full text-left">
                  Hình ảnh danh mục
                </label>
                <div className="relative group">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center p-2">
                    <img
                      className="w-full h-full object-contain mix-blend-multiply"
                      alt="Category"
                      src={payload?.image || imageAvatarDefault}
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

              {/* Giới thiệu */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Giới thiệu ngắn
                </label>
                <textarea
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl p-4 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  name="description"
                  placeholder="Nhập mô tả cho danh mục này..."
                  onChange={handleOnchange}
                  value={payload.description || ""}
                />
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <IoMdClose size="2.5rem" />
              </div>
              <p className="text-lg font-medium text-slate-600">
                Bạn chắc chắn muốn xóa danh mục: <br />
                <span className="font-bold text-slate-800 text-xl">
                  {payload.name}
                </span>
                ?
              </p>
              <p className="text-sm text-slate-400 italic">
                Hành động này sẽ không thể hoàn tác.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 justify-end px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            className="px-6 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={handleClickClose}
          >
            Hủy
          </button>

          {type === "ADD" && (
            <button
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickAdd}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Thêm mới"
              )}
            </button>
          )}

          {type === "UPDATE" && (
            <button
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md transition-all active:scale-95 disabled:opacity-70"
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

          {type === "DELETE" && (
            <button
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Xác nhận xóa"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCRUDcategoriesPackage;
