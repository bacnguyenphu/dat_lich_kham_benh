import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createPosition,
  deletePosition,
  getPositionById,
  updatePosition,
} from "../../services/positionService";
import { Validation } from "../../utils/validation";
import { toast } from "react-toastify";
import { FaTrashAlt, FaSave, FaPlus } from "react-icons/fa";

function ModalCRUDposition({ setIsShowModal, type, fetchPositions }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({ name: "" });

  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  useEffect(() => {
    if (type !== "ADD" && id) {
      const fetchPositionById = async () => {
        const res = await getPositionById(id);
        if (res.err === 0) {
          setPayload({ name: res.data?.name || "" });
        }
      };
      fetchPositionById();
    }
  }, [id, type]);

  const handleClickClose = () => {
    setIsShowModal(false);
    if (type !== "ADD") {
      navigate(location.pathname);
    }
  };

  const handleClickAdd = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      const res = await createPosition(payload);
      if (res.err === 0) {
        toast.success(res.message || "Thêm chức vụ thành công!");
        fetchPositions();
        handleClickClose();
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickUpdate = async () => {
    if (Validation(payload, setErrors)) {
      setIsLoading(true);
      const res = await updatePosition({ ...payload, id: id });
      if (res.err === 0) {
        toast.success(res.message || "Cập nhật thành công!");
        fetchPositions();
        handleClickClose();
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }
  };

  const handleClickDelete = async () => {
    setIsLoading(true);
    const res = await deletePosition(id);
    if (res.err === 0) {
      toast.success(res.message || "Đã xóa chức vụ!");
      fetchPositions();
      handleClickClose();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">
            {type === "ADD" && "Thêm chức vụ mới"}
            {type === "UPDATE" && "Chỉnh sửa chức vụ"}
            {type === "DELETE" && "Xác nhận xóa"}
          </h3>
          <button
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            onClick={handleClickClose}
          >
            <IoMdClose size={"1.5rem"} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {type !== "DELETE" ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Tên chức vụ <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
                value={payload.name}
                placeholder="Ví dụ: Giáo sư, Tiến sĩ..."
                onChange={(e) => {
                  setPayload({ ...payload, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <small className="text-red-500 font-medium">
                  {errors.name}
                </small>
              )}
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <FaTrashAlt size="1.8rem" />
              </div>
              <p className="text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa chức vụ: <br />
                <span className="font-bold text-slate-800 text-lg">
                  "{payload.name}"
                </span>
                ?
              </p>
              <p className="text-xs text-slate-400">
                Lưu ý: Các bác sĩ đang giữ chức vụ này sẽ bị ảnh hưởng.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            className="px-6 py-2.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={handleClickClose}
          >
            Hủy
          </button>

          {type === "ADD" && (
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickAdd}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaPlus size="0.9rem" />
              )}
              <span>Thêm mới</span>
            </button>
          )}

          {type === "UPDATE" && (
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaSave />
              )}
              <span>Lưu thay đổi</span>
            </button>
          )}

          {type === "DELETE" && (
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70"
              onClick={handleClickDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaTrashAlt />
              )}
              <span>Đồng ý xóa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCRUDposition;
