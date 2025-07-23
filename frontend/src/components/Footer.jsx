import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";
import logo from '../assets/logo.png'
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

function Footer() {

    const navigate = useNavigate()

    return (
        <div className="bg-[#EFEFEF] lg:px-40 md:px-20 px-5 py-5 flex gap-5">
            <div className="w-1/2">
                <div className='flex items-center cursor-pointer'
                    onClick={() => { navigate(HOMEPAGE) }}
                >
                    <div className='h-[60px] w-[60px]'>
                        <img className='object-center object-cover size-full scale-125' src={logo} />
                    </div>
                    <p className='text-xl font-semibold font-Lobster'>Nger Hospital</p>
                </div>
                <p className="font-semibold">Đặt lịch dễ dàng – Khám bệnh an toàn</p>
                <p className="mt-4">Sức khỏe là hành trình cần sự chủ động. Với nền tảng đặt lịch khám tiện lợi, bạn tiết kiệm thời gian và yên tâm chăm sóc bản thân mỗi ngày. Đặt lịch ngay hôm nay để bắt đầu sống khỏe mạnh hơn!</p>
            </div>
            <div className="w-1/2">
                <h4 className="font-semibold">Công ty trách nhiệm hữu hạn một thành viên MMT.</h4>
                <div className="flex gap-1 items-center mt-2">
                    <span><IoLocationOutline/></span>
                    <p>Thôn Tây Xuân Vy, xã Hoằng Thanh, tỉnh Thanh Hóa.</p>
                </div>
                <div className="flex gap-1 items-center mt-2">
                    <span><FaPhoneAlt/></span>
                    <p>+84 865351909</p>
                </div>
                <div className="flex gap-1 items-center mt-2">
                    <span><CiMail/></span>
                    <p>bac03906@gmail.com</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;