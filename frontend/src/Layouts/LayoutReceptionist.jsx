import { Outlet, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import Sidebar from "../components/Receptionist/SideBar";
import { useSelector } from "react-redux";

function LayoutReceptionist() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const isChatPage = location.pathname.includes("chat");

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800 relative">
      {/* Overlay cho Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-[70] w-[280px] h-full p-4 shrink-0 
          transition-transform duration-300 ease-in-out bg-slate-50 lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <button
          className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoMdClose size="1.8rem" />
        </button>

        <Sidebar />
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* HEADER */}
        <header className="h-[76px] bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HiOutlineMenuAlt2 size="1.5rem" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
              <img
                src={auth?.data?.avatar ? auth?.data?.avatar : defaultAvatar}
                alt="Avatar"
                className="w-full h-full object-center object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <p className="font-bold text-sm text-slate-700 leading-tight">
                {auth?.data?.firstName} {auth?.data?.lastName}
              </p>
            </div>
          </div>
        </header>

        {/* MAIN (Nơi render Outlet) */}
        <main
          className={`flex-1 relative bg-slate-50 transition-all duration-300
            ${
              isChatPage
                ? "p-0 overflow-hidden" // NẾU LÀ TRANG CHAT: Ép sát lề, bỏ cuộn ngoài để Chat tự xử lý cuộn trong
                : "p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden scroll-smooth" // CÁC TRANG KHÁC: Giữ nguyên padding như cũ
            }
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutReceptionist;
