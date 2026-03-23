import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import imageAvatarDefault from "../../assets/defaultAvatar.png";
import { TbCameraPlus } from "react-icons/tb";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { register } from "../../services/authService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  deleteUserById,
  getUserById,
  updateUser,
} from "../../services/userService";

function ModalCRUDuser({ type, setIsShowModal, fetchUsers, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [imgUpload, setImgUpload] = useState();
  const [errors, setErrors] = useState({});

  const query = new URLSearchParams(location.search);
  const idUser = query.get("id");

  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    dateOfBirth: new Date().toISOString().split("T")[0],
    gender: "male",
    address: "",
    avatar: null,
    role: role || "R3",
  });

  useEffect(() => {
    if (type !== "ADD" && idUser) {
      const fetchDataUser = async () => {
        const res = await getUserById(idUser);
        if (res.err === 0) {
          setPayload({
            firstName: res?.data?.firstName,
            lastName: res?.data?.lastName,
            phone: res?.data?.phone,
            email: res?.data?.email,
            dateOfBirth: res?.data?.dateOfBirth?.split("T")[0],
            gender: res?.data?.gender || "male",
            address: res?.data?.address,
            avatar: res?.data?.avatar,
            role: res?.data?.role || role,
          });
        }
      };
      fetchDataUser();
    }
  }, [idUser, type]);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPayload((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      setImgUpload(file);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClickAdd = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      try {
        let linkImg = null;
        if (imgUpload) {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        }
        const res = await register({ ...payload, avatar: linkImg });
        if (res.err === 0) {
          toast.success("Thêm người dùng thành công");
          setIsShowModal(false);
          fetchUsers();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickUpdate = async () => {
    const { password, ...validatePayload } = payload;
    if (Validation(validatePayload, setErrors)) {
      setIsLoading(true);
      try {
        let linkImg = payload.avatar;
        if (imgUpload) {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        }
        const res = await updateUser({ idUser, ...payload, avatar: linkImg });
        if (res.err === 0) {
          toast.success("Cập nhật thành công");
          setIsShowModal(false);
          fetchUsers();
          navigate(location.pathname);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deleteUserById(idUser);
    if (res.err === 0) {
      toast.success("Đã xóa người dùng");
      setIsShowModal(false);
      fetchUsers();
      navigate(location.pathname);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const handleClickClose = () => {
    setIsShowModal(false);
    if (type !== "ADD") navigate(location.pathname);
  };

  if (type === "DELETE") {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Xác nhận xóa</h3>
            <button
              onClick={handleClickClose}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <IoMdClose size={"1.5rem"} />
            </button>
          </div>
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
              <img
                className="w-full h-full object-cover"
                src={payload.avatar || imageAvatarDefault}
                alt="Avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageAvatarDefault;
                }}
              />
            </div>
            <p className="text-slate-600">
              Bạn có chắc chắn muốn xóa người dùng <br />
              <span className="font-bold text-slate-800">
                {payload.firstName} {payload.lastName}
              </span>
              ?
            </p>
          </div>
          <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t rounded-b-2xl">
            <button
              onClick={handleClickClose}
              className="px-5 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleClickDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2"
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}{" "}
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <p className="text-2xl font-bold text-slate-800">
            {type === "ADD"
              ? "Thêm người dùng mới"
              : "Cập nhật thông tin người dùng"}
          </p>
          <button
            onClick={handleClickClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <IoMdClose size={"1.8rem"} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cột trái: Avatar */}
            <div className="w-full md:w-1/4 flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-white">
                  <img
                    className="w-full h-full object-cover"
                    src={payload?.avatar || imageAvatarDefault}
                    alt="Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imageAvatarDefault;
                    }}
                  />
                </div>
                <label
                  htmlFor="uploadAvatar"
                  className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full border border-slate-200 shadow-md cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <TbCameraPlus size="1.2rem" />
                </label>
                <input
                  type="file"
                  hidden
                  id="uploadAvatar"
                  accept="image/*"
                  onChange={handleImg}
                />
              </div>
              <p className="text-xs text-slate-400 text-center uppercase font-bold tracking-wider">
                Ảnh đại diện
              </p>
            </div>

            {/* Cột phải: Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.firstName ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  name="firstName"
                  value={payload.firstName || ""}
                  onChange={handleOnChange}
                  placeholder="Nguyễn Văn"
                />
                {errors.firstName && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.firstName}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.lastName ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  name="lastName"
                  value={payload.lastName || ""}
                  onChange={handleOnChange}
                  placeholder="A"
                />
                {errors.lastName && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.lastName}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  name="phone"
                  value={payload.phone || ""}
                  onChange={handleOnChange}
                  placeholder="0987xxxxxx"
                />
                {errors.phone && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6 p-3 border border-slate-200 bg-slate-50 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={payload.gender === "male"}
                      onChange={handleOnChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />{" "}
                    Nam
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={payload.gender === "female"}
                      onChange={handleOnChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />{" "}
                    Nữ
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.address ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  name="address"
                  value={payload.address || ""}
                  onChange={handleOnChange}
                  placeholder="Số nhà, tên đường, phường, quận..."
                />
                {errors.address && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.address}
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  name="dateOfBirth"
                  value={payload.dateOfBirth}
                  onChange={handleOnChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`border ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  name="email"
                  value={payload.email || ""}
                  onChange={handleOnChange}
                  placeholder="example@mail.com"
                />
                {errors.email && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.email}
                  </small>
                )}
              </div>

              <div
                className={`flex flex-col gap-1.5 ${type !== "ADD" ? "opacity-50" : ""}`}
              >
                <label className="text-sm font-bold text-slate-700">
                  Mật khẩu{" "}
                  {type === "ADD" && <span className="text-red-500">*</span>}
                </label>
                <input
                  disabled={type !== "ADD"}
                  type="password"
                  name="password"
                  className={`border ${errors.password ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  onChange={handleOnChange}
                  placeholder={
                    type === "ADD" ? "••••••••" : "Không thể thay đổi tại đây"
                  }
                />
                {errors.password && type === "ADD" && (
                  <small className="text-red-500 font-medium ml-1">
                    {errors.password}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 justify-end px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={handleClickClose}
            className="px-6 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Thoát
          </button>
          {type === "ADD" ? (
            <button
              onClick={handleClickAdd}
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}{" "}
              Thêm người dùng
            </button>
          ) : (
            <button
              onClick={handleClickUpdate}
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-2.5 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}{" "}
              Lưu thay đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCRUDuser;
