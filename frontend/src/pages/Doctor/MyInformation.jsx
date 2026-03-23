import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormInfoDoctor } from "../../components";
import { Validation } from "../../utils/validation";
import { uploadImgCloudinary } from "../../services/uploadImgCloudinary";
import { updateDoctor } from "../../services/doctorService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosSave } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";

function MY_INFORMATION() {
  const [imgUpload, setImgUpload] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const authDoctor = useSelector((state) => state?.authDoctor?.data);
  const idDoctor = authDoctor?.id;

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

  const handleClickUpdate = async () => {
    // Loại bỏ password khỏi validation khi update
    const { password, ...other } = payload;

    if (Validation(other, setErrors)) {
      setIsLoading(true);
      // Giữ link ảnh cũ nếu không upload ảnh mới
      let linkImg = payload?.avatar;

      if (imgUpload) {
        try {
          let formData = new FormData();
          formData.append("file", imgUpload);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          const res = await uploadImgCloudinary(formData);
          linkImg = res.data.url;
        } catch (error) {
          toast.error("Lỗi khi tải ảnh lên hệ thống");
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await updateDoctor({
          idDoctor,
          ...payload,
          avatar: linkImg,
        });

        if (res.err === 0) {
          toast.success("Cập nhật hồ sơ chuyên môn thành công!");
        } else {
          toast.error(res.message || "Cập nhật thất bại");
        }
      } catch (error) {
        toast.error("Bạn không có quyền thực hiện thao tác này");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-10 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <FaUserEdit className="text-blue-400" />
            Hồ sơ của tôi
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Cập nhật thông tin cá nhân và bằng cấp chuyên môn
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Bác sĩ hệ thống
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        <div className="mb-10">
          <FormInfoDoctor
            payload={payload}
            setPayload={setPayload}
            idDoctor={idDoctor}
            setImgUpload={setImgUpload}
            errors={errors}
            type="UPDATE" // Truyền type để FormInfoDoctor biết đang ở mode chỉnh sửa
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            className={`
              flex items-center justify-center gap-2 px-10 py-3 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95
              ${isLoading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200"}
            `}
            onClick={handleClickUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <IoIosSave size="1.4rem" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MY_INFORMATION;
