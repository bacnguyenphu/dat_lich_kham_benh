import { IoMdClose } from "react-icons/io";
import InfoAppointment from "./InfoAppointment";
import { IoSend } from "react-icons/io5";
import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  deleteComment,
  getCommentsbyAppointmentId,
  postComment,
  updateComment,
} from "../services/commentService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

function ModalComment({ infoAppointmentCmt, setIsShowModalCmt }) {
  const authId = useSelector((state) => state?.auth?.data?.id);

  const [contentCmt, setContentCmt] = useState("");
  const [contentCmtUpdate, setContentCmtUpdate] = useState("");
  const [commentsBefore, setCommentsBefore] = useState(null);
  const [isLoadingPostCmt, setIsLoadingPostCmt] = useState(false);
  const [isUpdateCmt, setIsUpdateCmt] = useState(false);

  useEffect(() => {
    const fetchCmtOfAppointment = async () => {
      try {
        const res = await getCommentsbyAppointmentId(infoAppointmentCmt?.id);
        if (res.err === 0 && res.data) {
          setCommentsBefore({ id: res.data.id, content: res.data.content });
          setContentCmtUpdate(res.data.content);
        }
      } catch (error) {
        console.log("Lỗi khi lấy comments: ", error);
      }
    };
    if (infoAppointmentCmt?.id) {
      fetchCmtOfAppointment();
    }
  }, [infoAppointmentCmt]);

  const handleClickPostComment = async () => {
    if (!contentCmt.trim()) return;

    setIsLoadingPostCmt(true);
    try {
      const res = await postComment({
        content: contentCmt,
        userId: authId,
        appointmentId: infoAppointmentCmt?.id,
        targetId: infoAppointmentCmt?.doctorId
          ? infoAppointmentCmt?.doctorId
          : infoAppointmentCmt?.medicalPackageId,
        targetType: infoAppointmentCmt?.doctorId ? "doctor" : "package",
      });
      if (res.err === 0) {
        setContentCmt("");
        setCommentsBefore({ id: res.data.id, content: res.data.content });
        setContentCmtUpdate(res.data.content);
        toast.success("Gửi đánh giá thành công!");
      } else {
        toast.error(res.message || "Gửi đánh giá thất bại!");
      }
    } catch (error) {
      toast.error("Gửi đánh giá thất bại!");
    } finally {
      setIsLoadingPostCmt(false);
    }
  };

  const handleClickUpdateComment = async () => {
    if (!contentCmtUpdate.trim()) return;

    setIsLoadingPostCmt(true);
    try {
      const res = await updateComment({
        id: commentsBefore?.id,
        content: contentCmtUpdate,
      });
      if (res.err === 0) {
        setCommentsBefore({ id: res.data.id, content: res.data.content });
        toast.success("Cập nhật đánh giá thành công!");
        setIsUpdateCmt(false);
      } else {
        toast.error(res.message || "Cập nhật đánh giá thất bại!");
      }
    } catch (error) {
      toast.error("Cập nhật đánh giá thất bại!");
    } finally {
      setIsLoadingPostCmt(false);
    }
  };

  const handleClickDeleteComment = () => {
    Swal.fire({
      title: "Xóa đánh giá?",
      text: "Bạn có chắc chắn muốn xóa nhận xét này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Xóa đánh giá",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteComment(commentsBefore?.id);
          if (res.err === 0) {
            setCommentsBefore(null);
            setContentCmtUpdate("");
            toast.success("Đã xóa đánh giá!");
          } else {
            toast.error(res.message || "Xóa đánh giá thất bại!");
          }
        } catch (error) {
          toast.error("Xóa đánh giá thất bại!");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Khung Modal */}
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()} // Chặn click xuyên thủng
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            Đánh giá buổi khám
          </h2>
          <button
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            onClick={() => setIsShowModalCmt(false)}
          >
            <IoMdClose size={"1.5rem"} />
          </button>
        </div>

        {/* Nội dung (Có thể cuộn) */}
        <div className="overflow-y-auto px-6 py-6">
          {/* Thông tin buổi khám */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
            <InfoAppointment infoAppointment={infoAppointmentCmt} />
          </div>

          {/* Khu vực Nhận xét */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Nhận xét của bạn
            </h3>

            {!commentsBefore ? (
              /* Trạng thái 1: Chưa có nhận xét */
              <div className="flex flex-col gap-3">
                <textarea
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về buổi khám này nhé..."
                  className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y"
                  value={contentCmt}
                  onChange={(e) => setContentCmt(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70"
                    onClick={handleClickPostComment}
                    disabled={isLoadingPostCmt || !contentCmt.trim()}
                  >
                    {isLoadingPostCmt ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      <IoSend />
                    )}
                    <span>Gửi đánh giá</span>
                  </button>
                </div>
              </div>
            ) : !isUpdateCmt ? (
              /* Trạng thái 2: Đã có nhận xét (Xem) */
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                  <p className="text-slate-700 leading-relaxed italic">
                    "{commentsBefore.content}"
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                    onClick={() => setIsUpdateCmt(true)}
                  >
                    <FaRegEdit /> Sửa
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    onClick={handleClickDeleteComment}
                  >
                    <FaRegTrashAlt /> Xóa
                  </button>
                </div>
              </div>
            ) : (
              /* Trạng thái 3: Đang sửa nhận xét */
              <div className="flex flex-col gap-3">
                <textarea
                  placeholder="Sửa nhận xét của bạn..."
                  className="w-full min-h-[120px] bg-white border border-amber-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-y shadow-sm"
                  value={contentCmtUpdate}
                  onChange={(e) => setContentCmtUpdate(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    onClick={() => setIsUpdateCmt(false)}
                    disabled={isLoadingPostCmt}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-70"
                    onClick={handleClickUpdateComment}
                    disabled={isLoadingPostCmt || !contentCmtUpdate.trim()}
                  >
                    {isLoadingPostCmt ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : null}
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalComment;
