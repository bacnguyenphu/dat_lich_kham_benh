import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategoryPackage } from "../../services/categoryPackageService";
import DescriptionDetail from "./DescriptionDetail";
import imageAvatarDefault from "../../assets/default_image.webp";
import { TbCameraPlus } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import {
  createMedicalPackage,
  deleteMedicalPackage,
  getMedicalPackageById,
  updateMedicalPackage,
} from "../../services/medicalPackageService";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaTags, FaFileAlt } from "react-icons/fa";

function ModalCRUDMedicalPackage({
  setIsShowModal,
  type,
  fetchMedicalPackages,
}) {
  const [categoriesPackage, setCategoriesPackage] = useState([]);
  const [payload, setPayload] = useState({
    name: "",
    description_detail: "",
    price: "",
    image: null,
    description: "",
    id_category_package: "",
  });
  const [imgUpload, setImgUpload] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  useEffect(() => {
    const fetchCategoriesPackage = async () => {
      const res = await getCategoryPackage();
      if (res.err == 0) setCategoriesPackage(res.data);
    };
    fetchCategoriesPackage();
  }, []);

  useEffect(() => {
    if (type !== "ADD" && id) {
      const fetchMedicalPackageById = async () => {
        const res = await getMedicalPackageById(id);
        if (res.err === 0) {
          setPayload({
            name: res?.data?.name,
            description_detail: res?.data?.description_detail?.description,
            price: res?.data?.price,
            image: res?.data?.image,
            description: res?.data?.description,
            id_category_package: res?.data?.category_package?.id,
          });
        }
      };
      fetchMedicalPackageById();
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
      let finalImg = null;
      try {
        if (imgUpload) {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          finalImg = res.data.url;
        }
        const res = await createMedicalPackage({ ...payload, image: finalImg });
        if (res.err === 0) {
          toast.success(res.message);
          setIsShowModal(false);
          fetchMedicalPackages();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Lỗi hệ thống khi tải ảnh!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickUpdate = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let finalImg = payload?.image;
      try {
        if (imgUpload) {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          finalImg = res.data.url;
        }
        const res = await updateMedicalPackage({
          ...payload,
          image: finalImg,
          idMedicalPackage: id,
        });
        if (res.err === 0) {
          fetchMedicalPackages();
          setIsShowModal(false);
          toast.success(res.message);
          navigate(location.pathname);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Lỗi cập nhật!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deleteMedicalPackage(id);
    if (res.err == 0) {
      toast.success(res.message);
      setIsShowModal(false);
      navigate(location.pathname);
      fetchMedicalPackages();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  if (type === "DELETE") {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Xóa gói khám</h3>
            <button
              className="text-slate-400 hover:text-red-500"
              onClick={handleClickClose}
            >
              <IoMdClose size={"1.5rem"} />
            </button>
          </div>
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-48 h-32 rounded-xl overflow-hidden border-4 border-slate-50 shadow-md">
              <img
                className="w-full h-full object-cover"
                src={payload.image || imageAvatarDefault}
                alt="Icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageAvatarDefault;
                }}
              />
            </div>
            <p className="text-slate-600">
              Bạn chắc chắn muốn xóa gói khám: <br />
              <span className="font-bold text-slate-800 text-lg">
                {payload.name}
              </span>
              ?
            </p>
          </div>
          <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t">
            <button
              className="px-5 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              onClick={handleClickClose}
            >
              Hủy
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
              onClick={handleClickDelete}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Xác nhận Xóa"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <p className="text-2xl font-bold text-slate-800">
            {type === "ADD" ? "Thêm gói khám mới" : "Chỉnh sửa gói khám"}
          </p>
          <span
            className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
            onClick={handleClickClose}
          >
            <IoMdClose size={"1.8rem"} />
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-8">
          {/* Hàng 1: Tên & Giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FaFileAlt className="text-blue-500" /> Tên gói khám{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                className={`border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                name="name"
                value={payload.name}
                placeholder="VD: Khám tổng quát Diamond"
                onChange={handleOnchange}
              />
              {errors.name && (
                <small className="text-red-500">{errors.name}</small>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" /> Giá khám (VNĐ){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                className={`border ${errors.price ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                name="price"
                type="number"
                value={payload.price}
                placeholder="VD: 2000000"
                onChange={handleOnchange}
              />
              {errors.price && (
                <small className="text-red-500">{errors.price}</small>
              )}
            </div>
          </div>

          {/* Hàng 2: Danh mục (Chips Layout) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FaTags className="text-amber-500" /> Danh mục gói khám{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categoriesPackage.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleOnchange({
                      target: { name: "id_category_package", value: item.id },
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${payload.id_category_package === item.id ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            {errors.id_category_package && (
              <small className="text-red-500">
                {errors.id_category_package}
              </small>
            )}
          </div>

          {/* Hàng 3: Ảnh & Giới thiệu ngắn */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <label className="text-sm font-bold text-slate-700">
                Hình ảnh
              </label>
              <div className="relative group">
                <div className="w-48 h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-white p-1">
                  <img
                    className="w-full h-full object-cover rounded-xl"
                    src={payload?.image || imageAvatarDefault}
                    alt="Package"
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
                  <TbCameraPlus size="1.4rem" />
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
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 italic">
                Mô tả ngắn (Hiển thị ở danh sách)
              </label>
              <textarea
                className="border border-slate-200 bg-slate-50 rounded-xl p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-[15px]"
                name="description"
                placeholder="Nhập tóm tắt nội dung gói khám..."
                onChange={handleOnchange}
                value={payload.description || ""}
              />
            </div>
          </div>

          {/* Hàng 4: Mô tả chi tiết (CKEditor) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Nội dung chi tiết (Bài viết)
            </label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
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
          {type === "ADD" ? (
            <button
              className="flex items-center gap-2 px-10 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickAdd}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Thêm gói khám"
              )}
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-10 py-2.5 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md transition-all active:scale-95 disabled:opacity-70"
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

export default ModalCRUDMedicalPackage;
