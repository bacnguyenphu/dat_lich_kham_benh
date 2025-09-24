import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getInfoToMakeAppointment } from "../services/appointment";
import { useState } from "react";
import defaultAvatar from '../assets/defaultAvatar.png'
import { RiCalendarScheduleLine } from "react-icons/ri";
import dayjs from 'dayjs';
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { IoPricetagOutline } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
import { FaTransgender } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { GiPositionMarker } from "react-icons/gi";
dayjs.locale('vi')

function MakeAppointment() {
    const [searchParams] = useSearchParams();

    const idDoctor = searchParams.get("idDoctor");
    const idMedicalPackage = searchParams.get("idMedicalPackage");
    const appointment_date = searchParams.get("date");
    const time_frame = searchParams.get("tf");

    const [infoAppointment, setInfoAppointment] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getInfoToMakeAppointment({ idDoctor, idMedicalPackage, time_frame, appointment_date })
            console.log(res);
            if (res.err == 0) {
                setInfoAppointment(res?.data)
            }
        }
        if (appointment_date && time_frame && (idDoctor || idMedicalPackage)) {
            fetchData()
        }
    }, [idDoctor, idMedicalPackage, time_frame, appointment_date])

    return (
        <div>
            <div className="h-36 bg-[#F6F6F6] px-96 flex items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <div className="rounded-full overflow-hidden size-24">
                        <img className="object-center object-cover size-full" src={(infoAppointment?.doctor?.user?.avatar) ? infoAppointment?.doctor?.user?.avatar : defaultAvatar} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl text-[#5F5F55]">Đặt lịch khám</h3>
                        <div className="flex items-center gap-2 font-semibold text-[#337AB7] text-xl">
                            {infoAppointment?.doctor?.position.map(item => {
                                return (
                                    <p key={`pos-${item.id}`} className="">{item.name}{""}</p>
                                )
                            })}
                            <p className="font-semibold">{infoAppointment?.doctor?.user?.firstName} {infoAppointment?.doctor?.user?.lastName}</p>
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
                            <p className="text-red-500">{infoAppointment?.doctor?.price.toLocaleString('vi-VN')} VND</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-96 pt-10">
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <ImUser className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Họ tên bệnh nhân" />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <FaPhone className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Số điện thoại liên hệ" />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <FaTransgender className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Giới tính" />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <CiCalendarDate className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Ngày tháng năm sinh" />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <GiPositionMarker className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Địa chỉ" />
                </div>
                <div className="mb-6">
                    <p className="text-[#337AB7] text-sm font-semibold">Hình thức thanh toán</p>
                    <div className="my-2">
                        <input type="radio" checked />
                        <label className="text-gray-500"> Thanh toán sau tại cơ sở y tế</label>
                    </div>
                    <div className="bg-[#F6F6F6] rounded-lg p-5">
                        <div className="flex justify-between mb-2">
                            <p>Giá khám</p>
                            <p>{infoAppointment?.doctor?.price.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Phí đặt dịch vụ</p>
                            <p>Miễn phí</p>
                        </div>
                        <hr className="border border-gray-400 mb-3" />
                        <div className="flex justify-between mb-2">
                            <p>Tổng cộng</p>
                            <p className="text-red-600">{infoAppointment?.doctor?.price.toLocaleString('vi-VN')} VND</p>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <p className="text-xs text-gray-400 text-center mb-1">Quý khách vui lòng đảm bảo đầy đủ thông tin để tiết kiệm thời gian làm thủ tục khám</p>
                    <div className="rounded-lg bg-[#D4EFFC] p-4">
                        <h3 className="text-xl font-semibold">LƯU Ý :</h3>
                        <p>Thông tin được lấy từ tài khoản, vui lòng cập nhập đầy đủ thông tin trước khi làm thủ tục. Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh, khi điền thông tin anh/chị vui lòng:</p>
                        <ul className="list-disc list-inside">
                            <li>
                                Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên, ví dụ: Trần Văn Phú
                            </li>
                            <li>
                                Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin trước khi ấn "Xác nhận"
                            </li>
                        </ul>
                    </div>
                </div>
                <button className="text-white bg-yellow-400 font-semibold text-xl w-full rounded-lg py-2 mb-6 cursor-pointer">Xác nhận đặt khám</button>
            </div>
        </div>

    );
}

export default MakeAppointment;