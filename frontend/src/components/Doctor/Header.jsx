import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { useSelector } from "react-redux";
import { FaBell, FaRegCircleUser } from "react-icons/fa6";

function Header() {
  const authDoctor = useSelector((state) => state?.authDoctor?.data);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-14 w-14 overflow-hidden rounded-xl bg-blue-50 flex items-center justify-center p-1 transition-transform group-hover:scale-105">
            <img
              className="object-contain h-full w-full"
              src={logo}
              alt="Logo"
            />
          </div>
          <div>
            <p className="text-2xl font-bold font-Lobster text-slate-800 leading-none">
              Nger Doctor
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 mt-1">
              Medical Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer">
            <FaBell size="1.2rem" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-800 leading-none">
                BS. {authDoctor?.firstName} {authDoctor?.lastName}
              </p>
              <p className="text-[11px] text-green-500 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>

            <div className="w-10 h-10 rounded-full border-2 border-blue-100 p-0.5 overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover rounded-full bg-slate-100"
                src={authDoctor?.avatar || defaultAvatar}
                alt="Doctor Avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
