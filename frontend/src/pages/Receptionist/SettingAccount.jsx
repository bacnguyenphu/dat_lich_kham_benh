import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import _ from "lodash";
import { updateUser } from "../../services/userService";
import { getUserRedux } from "../../redux/authSlice";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

function SettingAccount() {
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

  const handleOnChange = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng bắt đầu gõ lại
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClickSubmit = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      let linkImg = payload?.linkImg || payload?.avatar;

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

  // Xử lý hiển thị ngày sinh cho thẻ input type="date"
  const formattedDateOfBirth = payload.dateOfBirth
    ? payload.dateOfBirth.split("T")[0]
    : "";

  return (
    <div className="max-w-4xl mx-auto  animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-800">
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-10">
          {/* ===== BÊN TRÁI: AVATAR ===== */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-1/3">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                {payload.avatar ? (
                  <img
                    src={payload.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-slate-300 font-bold">
                    {payload.firstName?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              {/* Nút Upload ẩn */}
              <label
                htmlFor="upload-avatar"
                className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95 group-hover:scale-110"
                title="Thay đổi ảnh đại diện"
              >
                <FaCamera size="1.1rem" />
                <input
                  type="file"
                  id="upload-avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImg}
                />
              </label>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Dung lượng file tối đa 1MB
              <br />
              Định dạng: .JPEG, .PNG
            </p>
          </div>

          {/* ===== BÊN PHẢI: FORM THÔNG TIN ===== */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Họ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50 focus:bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                value={payload.firstName || ""}
                onChange={(e) => handleOnChange("firstName", e.target.value)}
                placeholder="VD: Nguyễn"
              />
              {errors.firstName && (
                <span className="text-[11px] text-red-500 italic">
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
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50 focus:bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                value={payload.lastName || ""}
                onChange={(e) => handleOnChange("lastName", e.target.value)}
                placeholder="VD: Văn A"
              />
              {errors.lastName && (
                <span className="text-[11px] text-red-500 italic">
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
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50 focus:bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                value={payload.phone || ""}
                onChange={(e) => handleOnChange("phone", e.target.value)}
              />
              {errors.phone && (
                <span className="text-[11px] text-red-500 italic">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Email (Thường để readonly ở trang Profile, mở nếu hệ thống cho đổi) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50 focus:bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                value={payload.email || ""}
                title="Email không thể thay đổi"
                onChange={(e) => handleOnChange("email", e.target.value)}
              />
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.dateOfBirth ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50 focus:bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                value={formattedDateOfBirth}
                onChange={(e) => handleOnChange("dateOfBirth", e.target.value)}
              />
              {errors.dateOfBirth && (
                <span className="text-[11px] text-red-500 italic">
                  {errors.dateOfBirth}
                </span>
              )}
            </div>

            {/* Giới tính */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Giới tính
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                value={payload.gender || ""}
                onChange={(e) => handleOnChange("gender", e.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Địa chỉ (Chiếm trọn 2 cột) */}
            <div className="flex flex-col gap-1.5 col-span-full">
              <label className="text-sm font-semibold text-slate-700">
                Địa chỉ
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={payload.address || ""}
                onChange={(e) => handleOnChange("address", e.target.value)}
                placeholder="Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
              />
            </div>

            {/* Nút Submit */}
            <div className="col-span-full flex justify-end">
              <button
                onClick={handleClickSubmit}
                disabled={isLoading}
                className="flex items-center justify-center min-w-[160px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <CgSpinner className="animate-spin mr-2" size="1.2rem" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingAccount;
