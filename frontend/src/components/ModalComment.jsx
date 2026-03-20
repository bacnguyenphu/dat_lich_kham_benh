import { IoMdClose } from "react-icons/io";
import InfoAppointment from "./InfoAppointment";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  deleteComment,
  getCommentsbyAppointmentId,
  postComment,
  updateComment,
} from "../services/commentService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Swal from "sweetalert2";

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
    if (!contentCmt.trim()) {
      return;
    }
    // Logic to post the comment
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
        toast.success("Đăng nhận xét thành công!");
      } else {
        toast.error(res.message || "Đăng nhận xét thất bại!");
      }
      setIsLoadingPostCmt(false);
    } catch (error) {
      toast.error("Đăng nhận xét thất bại!");
      setIsLoadingPostCmt(false);
    }
  };

  const handleClickUpdateComment = async () => {
    if (!contentCmtUpdate.trim()) {
      return;
    }
    // Logic to update the comment
    setIsLoadingPostCmt(true);
    try {
      const res = await updateComment({
        id: commentsBefore?.id,
        content: contentCmtUpdate,
      });
      if (res.err === 0) {
        setCommentsBefore({ id: res.data.id, content: res.data.content });
        toast.success("Sửa nhận xét thành công!");
      } else {
        toast.error(res.message || "Sửa nhận xét thất bại!");
      }
      setIsLoadingPostCmt(false);
      setIsUpdateCmt(false);
    } catch (error) {
      toast.error("Sửa nhận xét thất bại!");
      setIsLoadingPostCmt(false);
    }
  };

  const handleClickDeleteComment = async () => {
    Swal.fire({
      title: "Bạn có muốn xóa nhận xét ?",
      showDenyButton: true,
      confirmButtonText: "Xóa",
      denyButtonText: "Thoát",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteComment(commentsBefore?.id);
          if (res.err === 0) {
            setCommentsBefore(null);
            setContentCmtUpdate("");
            toast.success("Xóa nhận xét thành công!");
          } else {
            toast.error(res.message || "Xóa nhận xét thất bại!");
          }
        } catch (error) {
          toast.error("Xóa nhận xét thất bại!");
        }
      }
    });
  };

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/40">
      <div className="w-3xl bg-white min-h-6 rounded-2xl mx-auto mt-16 px-5">
        <div className="flex justify-between py-3 border-b border-gray-300">
          <p className="text-xl font-semibold">Nhận xét buổi khám</p>
          <span
            className="cursor-pointer"
            onClick={() => setIsShowModalCmt(false)}
          >
            <IoMdClose size={"1.5rem"} />
          </span>
        </div>
        <div>
          <div className="py-4">
            <InfoAppointment infoAppointment={infoAppointmentCmt} />
          </div>
          <div className="py-4">
            <p className="text-lg font-semibold">Nhận xét của bạn: </p>
            {!commentsBefore ? (
              <p className="text-gray-500">Bạn chưa có nhận xét!</p>
            ) : (
              <div className="flex gap-3">
                <p className="text-gray-700">{commentsBefore.content}</p>{" "}
                <span
                  className="text-red-500 cursor-pointer italic hover:underline"
                  onClick={() => handleClickDeleteComment()}
                >
                  Xóa
                </span>
              </div>
            )}
          </div>
        </div>
        <hr className="border border-gray-300 mt-3" />
        <div className="py-5">
          {!commentsBefore ? (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Nhập nhận xét của bạn về buổi khám này..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={contentCmt}
                onChange={(e) => setContentCmt(e.target.value)}
              />
              <div>
                {isLoadingPostCmt ? (
                  <button className="animate-rotate-center inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    <AiOutlineLoading3Quarters />
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleClickPostComment}
                  >
                    <IoSend />
                  </button>
                )}
              </div>
            </div>
          ) : !isUpdateCmt ? (
            <button
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={() => setIsUpdateCmt(true)}
            >
              Sửa nhận xét
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Nhập nhận xét bạn muốn sửa..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={contentCmtUpdate}
                onChange={(e) => setContentCmtUpdate(e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setIsUpdateCmt(false)}
              >
                Hủy
              </button>
              <div>
                {isLoadingPostCmt ? (
                  <button className="animate-rotate-center inline-block bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600">
                    <AiOutlineLoading3Quarters />
                  </button>
                ) : (
                  <button
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                    onClick={handleClickUpdateComment}
                  >
                    Sửa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalComment;
