import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from "../assets/defaultAvatar.png";
import { IoIosSave } from "react-icons/io";
import { TbCameraPlus } from "react-icons/tb"; // Đổi icon cho hợp với việc đổi ảnh
import { Validation } from "../utils/validation";
import { uploadImgCloudinary } from "../services/uploadImgCloudinary";
import { updateUser } from "../services/userService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import _ from "lodash";
import { getUserRedux } from "../redux/authSlice";
import dayjs from "dayjs";
dayjs.locale("vi");

function Profile() {
  const auth = useSelector((state) => state.auth);
  const [imgUpload, setImgUpload] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState(auth.data || {});
  const dispatch = useDispatch();

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPayload((prev) => {
        return { ...prev, avatar: URL.createObjectURL(file) };
      });
      setImgUpload(file);
    }
  };

  const handleClickSubmit = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let linkImg = payload?.linkImg || payload?.avatar; // Giữ nguyên ảnh cũ nếu ko up mới

      if (imgUpload) {
        let formData = new FormData();
        formData.append("file", imgUpload);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        try {
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        } catch (error) {
          toast.error("Lỗi tải ảnh lên hệ thống!");
          setIsLoading(false);
          return;
        }
      }

      const { id, ...rest } = _.cloneDeep(payload);
      const newPayload = { idUser: id, ...rest };
      const res = await updateUser({ ...newPayload, avatar: linkImg });

      if (res.err === 0) {
        toast.success(res.message || "Cập nhật thành công!");
        await dispatch(getUserRedux(id));
      } else {
        toast.error(res.message || "Đã có lỗi xảy ra!");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header & Avatar Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 text-white relative">
            <h1 className="text-2xl font-bold mb-1">Hồ sơ cá nhân</h1>
            <p className="text-blue-100 text-sm">
              Quản lý thông tin để bảo mật tài khoản
            </p>

            {/* Avatar Upload Container */}
            <div className="absolute -bottom-12 right-8 sm:right-auto sm:left-8">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                  <img
                    className="w-full h-full object-cover object-center"
                    alt="Avatar"
                    src={payload?.avatar || defaultAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>
                {/* Nút thay đổi ảnh (nổi lên trên avatar) */}
                <label
                  htmlFor="uploadAvatar"
                  className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 hover:text-blue-700 transition-colors"
                  title="Thay đổi ảnh đại diện"
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
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-10 pt-20 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.firstName ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors`}
                  value={payload.firstName || ""}
                  placeholder="VD: Nguyễn Văn"
                  onChange={(e) => {
                    setPayload({ ...payload, firstName: e.target.value });
                    setErrors({ ...errors, firstName: "" });
                  }}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Tên */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.lastName ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors`}
                  value={payload.lastName || ""}
                  placeholder="VD: A"
                  onChange={(e) => {
                    setPayload({ ...payload, lastName: e.target.value });
                    setErrors({ ...errors, lastName: "" });
                  }}
                />
                {errors.lastName && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.lastName}
                  </span>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors`}
                  value={payload.phone || ""}
                  placeholder="0987654321"
                  onChange={(e) => {
                    setPayload({ ...payload, phone: e.target.value });
                    setErrors({ ...errors, phone: "" });
                  }}
                />
                {errors.phone && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`border ${errors.email ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors`}
                  value={payload.email || ""}
                  placeholder="example@gmail.com"
                  onChange={(e) => {
                    setPayload({ ...payload, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Ngày sinh */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="border border-slate-300 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  value={
                    payload.dateOfBirth
                      ? dayjs(payload.dateOfBirth).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    setPayload({ ...payload, dateOfBirth: e.target.value });
                  }}
                />
              </div>

              {/* Giới tính */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6 h-full pb-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={payload.gender === "male"}
                      onChange={(e) => {
                        setPayload({ ...payload, gender: e.target.value });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors">
                      Nam
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={payload.gender === "female"}
                      onChange={(e) => {
                        setPayload({ ...payload, gender: e.target.value });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors">
                      Nữ
                    </span>
                  </label>
                </div>
              </div>

              {/* Địa chỉ (Chiếm 2 cột trên Desktop) */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Địa chỉ liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  className={`border ${errors.address ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors`}
                  value={payload.address || ""}
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                  onChange={(e) => {
                    setPayload({ ...payload, address: e.target.value });
                    setErrors({ ...errors, address: "" });
                  }}
                />
                {errors.address && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.address}
                  </span>
                )}
              </div>
            </div>

            <hr className="my-8 border-slate-100" />

            {/* Khu vực Bảo mật & Mật khẩu */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800">Bảo mật tài khoản</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Nên cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.
                </p>
              </div>
              <button className="whitespace-nowrap px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold transition-colors active:scale-95">
                Đổi mật khẩu
              </button>
            </div>

            {/* Nút Submit */}
            <div className="mt-8 flex justify-end">
              <button
                className="w-full sm:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleClickSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters
                      className="animate-spin"
                      size="1.25rem"
                    />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <IoIosSave size={"1.25rem"} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
