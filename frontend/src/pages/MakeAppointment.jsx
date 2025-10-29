import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppointment, getInfoToMakeAppointment } from "../services/appointment";
import { useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { ImUser } from "react-icons/im";
import { FaTransgender } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { GiPositionMarker } from "react-icons/gi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { APPOINTMENT } from "../utils/path";
import { InfoAppointment } from "../components";
import dayjs from 'dayjs';
dayjs.locale('vi')

function MakeAppointment() {

    const auth = useSelector(state => state.auth?.data)
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const idDoctor = searchParams.get("idDoctor");
    const idMedicalPackage = searchParams.get("idMedicalPackage");
    const appointment_date = searchParams.get("date");
    const time_frame = searchParams.get("tf");

    const [infoAppointment, setInfoAppointment] = useState({
        name:'',
        price:'',
        image:'',
        time_frame:'',
        appointment_date:''
    })

    useEffect(() => {
        const fetchData = async () => {
            const res = await getInfoToMakeAppointment({ idDoctor, idMedicalPackage, time_frame, appointment_date })
            if (res.err == 0) {
                setInfoAppointment(res?.data)
                if(idDoctor){
                    setInfoAppointment({
                        name: res.data?.doctor?.position.map(item=>item.name).join(" ") +" "+ res.data?.doctor?.user?.firstName + res.data?.doctor?.user?.lastName,
                        price: res.data?.doctor?.price.toLocaleString('vi-VN'),
                        image: res?.data?.doctor?.user?.avatar,
                        time_frame: res?.data?.time_frame,
                        appointment_date:res?.data?.appointment_date,
                    })
                }
                if(idMedicalPackage){
                    setInfoAppointment({
                        name: res.data?.Medical_package?.name,
                        price: res.data?.Medical_package?.price,
                        image: res?.data?.Medical_package?.image,
                        time_frame: res?.data?.time_frame,
                        appointment_date:res?.data?.appointment_date,
                    })
                }
            }
        }
        if (appointment_date && time_frame && (idDoctor || idMedicalPackage)) {
            fetchData()
        }
    }, [idDoctor, idMedicalPackage, time_frame, appointment_date])
    console.log(infoAppointment);
    

    const handleClickSubmit = async () => {
        const payload = {
            idDoctor,
            idPatient: auth?.id,
            idMedicalPackage,
            appointment_date,
            time_frame: infoAppointment?.time_frame
        }
        Swal.fire({
            title: "Bạn chắc muốn đặt lịch khám ?",
            showDenyButton: true,
            confirmButtonText: "Đặt lịch",
            denyButtonText: "Thoát"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await createAppointment(payload)
                if (res.err == 0) {
                    Swal.fire({
                        title: "Đặt lịch thành công"
                    }).then(() => {
                        navigate(APPOINTMENT)
                    });
                }
                else if (res.err === 5) {
                    Swal.fire({
                        title: "Đăng ký lịch hẹn không thành công !",
                        icon: "error",
                        text: "Bạn có lịch hẹn khác vào khung giờ này !"
                    });
                }
                else {
                    Swal.fire({
                        title: "Đăng ký lịch hẹn không thành công !",
                        icon: "error",
                    });
                }
            }
        });
    }

    return (
        <div>
            <div className="h-36 bg-[#F6F6F6] xl:px-96 lg:px-40 md:px-20 flex items-center sticky top-0 z-10">
                <InfoAppointment infoAppointment={infoAppointment}/>
            </div>
            <div className="xl:px-96 lg:px-40 md:px-20 pt-10">
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <ImUser className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Họ tên bệnh nhân"
                        value={`${auth?.firstName} ${auth?.lastName}`}
                        disabled
                    />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <FaPhone className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Số điện thoại liên hệ"
                        value={auth?.phone}
                        disabled
                    />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <FaTransgender className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Giới tính"
                        value={`${auth?.gender === "male" ? "Nam" : "Nữ"}`}
                        disabled
                    />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <CiCalendarDate className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Ngày tháng năm sinh"
                        value={auth?.dateOfBirth ? dayjs(auth?.dateOfBirth).format("DD-MM-YYYY") : ""}
                        disabled
                    />
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <GiPositionMarker className="text-[#666666]" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 outline-none" placeholder="Địa chỉ"
                        value={auth?.address}
                        disabled
                    />
                </div>
                <div className="mb-6">
                    <p className="text-[#337AB7] text-sm font-semibold">Hình thức thanh toán</p>
                    <div className="my-2">
                        <input type="radio" checked disabled />
                        <label className="text-gray-500"> Thanh toán sau tại cơ sở y tế</label>
                    </div>
                    <div className="bg-[#F6F6F6] rounded-lg p-5">
                        <div className="flex justify-between mb-2">
                            <p>Giá khám</p>
                            <p>{infoAppointment?.price.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Phí đặt dịch vụ</p>
                            <p>Miễn phí</p>
                        </div>
                        <hr className="border border-gray-400 mb-3" />
                        <div className="flex justify-between mb-2">
                            <p>Tổng cộng</p>
                            <p className="text-red-600">{infoAppointment?.price.toLocaleString('vi-VN')} VND</p>
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
                <button className="text-white bg-yellow-400 font-semibold text-xl w-full rounded-lg py-2 mb-6 cursor-pointer"
                    onClick={() => { handleClickSubmit() }}
                >Xác nhận đặt khám
                </button>
            </div>
        </div>

    );
}

export default MakeAppointment;