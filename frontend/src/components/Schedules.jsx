import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { getScheduleFollowDate } from "../services/scheduleService";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useNavigate } from "react-router-dom";
import { LOGIN, MAKE_APPOINTMENT } from "../utils/path";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

function Schedules({ idDoctor, idMedicalPackage }) {
  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth?.data);

  // Tạo mảng 7 ngày tiếp theo
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dateObj = dayjs().add(i, "day");
    days.push({
      // Nếu là ngày đầu tiên (i=0) thì ghi là "Hôm nay", ngược lại ghi Thứ
      title:
        i === 0
          ? `Hôm nay - ${dateObj.format("DD/MM")}`
          : capitalizeFirstLetter(dateObj.format("dddd - DD/MM")),
      value: dateObj.format("YYYY-MM-DD"),
    });
  }

  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [timeFrames, setTimeFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true); // Bật loading khi đổi ngày
      let res;

      if (idDoctor) {
        res = await getScheduleFollowDate({
          id_doctor: idDoctor,
          appointment_date: selectedDate.value,
        });
      } else if (idMedicalPackage) {
        res = await getScheduleFollowDate({
          idMedicalPackage: idMedicalPackage,
          appointment_date: selectedDate.value,
        });
      }

      if (res && res.err === 0) {
        setTimeFrames(res?.data?.time_frame || []);
      } else {
        setTimeFrames([]);
      }
      setIsLoading(false); // Tắt loading
    };

    if (idDoctor || idMedicalPackage) {
      fetchSchedule();
    }
  }, [selectedDate, idDoctor, idMedicalPackage]);

  const handleNavigateMakeAppointment = (idTimeFrame) => {
    if (auth) {
      if (idDoctor) {
        navigate(
          `${MAKE_APPOINTMENT}?idDoctor=${idDoctor}&date=${selectedDate?.value}&tf=${idTimeFrame}`,
        );
      }
      if (idMedicalPackage) {
        navigate(
          `${MAKE_APPOINTMENT}?idMedicalPackage=${idMedicalPackage}&date=${selectedDate?.value}&tf=${idTimeFrame}`,
        );
      }
    } else {
      Swal.fire({
        title: "Yêu cầu đăng nhập",
        text: "Bạn cần đăng nhập tài khoản để thực hiện đặt lịch khám!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3B82F6",
        cancelButtonColor: "#94A3B8",
        confirmButtonText: "Đăng nhập ngay",
        cancelButtonText: "Đóng",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(LOGIN);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative mb-6 w-fit">
        <select
          className="appearance-none bg-transparent border-b-2 border-blue-600 text-blue-700 font-bold text-lg md:text-xl pb-1.5 pr-8 outline-none cursor-pointer focus:border-blue-800 transition-colors"
          value={selectedDate.value}
          onChange={(e) => {
            const selected = days.find((d) => d.value === e.target.value);
            setSelectedDate(selected);
          }}
        >
          {days.map((day) => (
            <option
              key={day.value}
              value={day.value}
              className="text-slate-700 text-base font-medium"
            >
              {day.title}
            </option>
          ))}
        </select>
        {/* Icon mũi tên thả xuống */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 pb-1.5">
          <FaChevronDown size="1rem" />
        </div>
      </div>

      {/* Header Lịch Khám */}
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <RiCalendarScheduleLine size={"1.4rem"} className="text-blue-600" />
        <span className="font-bold uppercase tracking-wide text-[15px]">
          Lịch khám
        </span>
      </div>

      {/* Khung hiển thị Giờ khám */}
      <div className="min-h-[120px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-24 text-slate-400 animate-pulse font-medium">
            Đang tải lịch khám...
          </div>
        ) : timeFrames && timeFrames.length > 0 ? (
          <>
            {/* Grid linh hoạt: Mobile 3 cột, Tablet 4 cột, PC 5 cột */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {timeFrames.map((item) => (
                <div
                  key={item?.id}
                  className="bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-xl font-bold text-[15px] cursor-pointer shadow-sm hover:shadow-md hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-200 select-none"
                  onClick={() => handleNavigateMakeAppointment(item?.id)}
                >
                  {item?.time_frame}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              <span>Chọn vào khung giờ để đặt lịch</span>
            </div>
          </>
        ) : (
          /* Trạng thái trống (Hết lịch / Không có lịch) */
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <RiCalendarScheduleLine
              size="2.5rem"
              className="text-slate-300 mb-2"
            />
            <p className="text-slate-600 font-medium">
              <span className="font-bold">{selectedDate.title}</span> không có
              lịch khám!
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Vui lòng chọn một ngày khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedules;
