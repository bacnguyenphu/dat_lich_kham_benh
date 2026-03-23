import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";
import logo from "../assets/logo.png";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:w-3/5 flex flex-col gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer w-fit group"
              onClick={() => navigate(HOMEPAGE)}
            >
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
                <img
                  className="object-cover h-full w-full"
                  src={logo}
                  alt="Nger Hospital Logo"
                />
              </div>
              <p className="text-3xl font-bold text-blue-700 font-Lobster tracking-wide">
                Nger Hospital
              </p>
            </div>

            <div className="mt-2">
              <p className="font-bold text-lg text-slate-800">
                Đặt lịch dễ dàng – Khám bệnh an toàn
              </p>
              <p className="mt-3 text-slate-500 leading-relaxed text-[15px] lg:text-base text-justify lg:pr-10">
                Sức khỏe là hành trình cần sự chủ động. Với nền tảng đặt lịch
                khám tiện lợi, bạn tiết kiệm thời gian và yên tâm chăm sóc bản
                thân mỗi ngày. Đặt lịch ngay hôm nay để bắt đầu sống khỏe mạnh
                hơn!
              </p>
            </div>
          </div>

          <div className="lg:w-2/5 flex flex-col gap-4">
            <h4 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-3 mb-2">
              Công ty TNHH Một thành viên MMT.
            </h4>

            <div className="flex items-start gap-3 mt-1 group">
              <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <IoLocationOutline size={18} />
              </div>
              <p className="text-slate-600 text-[15px] lg:text-base leading-relaxed pt-0.5">
                Thôn Tây Xuân Vy, xã Hoằng Thanh, tỉnh Thanh Hóa.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 group">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <FaPhoneAlt size={16} />
              </div>
              <p className="text-slate-600 text-[15px] lg:text-base font-medium">
                +84 865 351 909
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 group">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <CiMail size={18} strokeWidth={1} />
              </div>
              <p className="text-slate-600 text-[15px] lg:text-base">
                bac03906@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Nger Hospital. Đã đăng ký bản quyền.
          </p>
          <div className="flex gap-6 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Điều khoản sử dụng
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Chính sách bảo mật
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
