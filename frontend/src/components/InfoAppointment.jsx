import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import defaultAvatar from '../assets/defaultAvatar.png'

dayjs.locale('vi')

function InfoAppointment({ infoAppointment }) {
    return (
        <div className="flex items-center gap-6">
            <div className="rounded-full overflow-hidden size-24">
                <img className="object-center object-cover size-full" src={(infoAppointment?.image) ? infoAppointment?.image : defaultAvatar} />
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-xl text-[#5F5F55]">Lịch khám</h3>
                <div className=" gap-2 font-semibold text-[#337AB7] text-xl">
                    {infoAppointment.name}
                </div>
                <div className="flex items-center text-[#FEC206] font-semibold gap-2">
                    <span>
                        <RiCalendarScheduleLine color="#909092" />
                    </span>
                    <span className="ml-2">
                        {infoAppointment?.time_frame}
                    </span>
                    <span>|</span>
                    <span>{capitalizeFirstLetter(dayjs(`${infoAppointment?.appointment_date}`).format("dddd - DD/MM/YYYY"))}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className=""><IoPricetagOutline color="#909092" /></span>
                    <span className="ml-2">Giá khám: </span>
                    <p className="text-red-500">{infoAppointment?.price} VND</p>
                </div>
            </div>
        </div>
    );
}

export default InfoAppointment;