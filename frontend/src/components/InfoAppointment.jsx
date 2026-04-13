import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import defaultAvatar from "../assets/defaultAvatar.png";

dayjs.locale("vi");

function InfoAppointment({ infoAppointment }) {
  if (!infoAppointment) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-8 py-4 w-full">
      <div className="shrink-0 relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm bg-white">
          <img
            className="w-full h-full object-cover object-top"
            src={infoAppointment?.image || defaultAvatar}
            alt={infoAppointment?.name || "Hình ảnh"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col gap-2 text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider rounded-md">
            Thông tin lịch hẹn
          </span>
        </div>

        {/* Tên Bác sĩ / Gói khám */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
          {infoAppointment?.name || "Đang cập nhật..."}
        </h2>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[15px] font-medium mt-1">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm">
            <RiCalendarScheduleLine size="1.2rem" />
            <span>{infoAppointment?.time_frame || "Chưa rõ giờ"}</span>
            <span className="text-amber-300">|</span>
            <span>
              {infoAppointment?.appointment_date
                ? capitalizeFirstLetter(
                    dayjs(infoAppointment.appointment_date).format(
                      "dddd - DD/MM/YYYY",
                    ),
                  )
                : "Chưa chọn ngày"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-600 font-medium mt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <IoPricetagOutline className="text-slate-400" size="1.1rem" />
            <span>Chi phí dự kiến:</span>
            <span className="text-blue-600 font-bold text-base ml-1">
              {infoAppointment?.price.toLocaleString("vi-VN")}{" "}
              <span className="text-xs text-slate-500 font-normal">VNĐ</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoAppointment;
