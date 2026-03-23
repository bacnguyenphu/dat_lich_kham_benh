import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Admin";
import { CiSearch } from "react-icons/ci";
import { HiOutlineMenuAlt2 } from "react-icons/hi"; // Icon menu cho Mobile
import UserDropdown from "../components/UserDropdown";

function LayoutAdmin() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* ===== CỘT TRÁI: SIDEBAR ===== */}
      {/* Ẩn trên Mobile/Tablet, cố định 280px trên Desktop */}
      <aside className="hidden lg:block w-[280px] h-full p-4 shrink-0 transition-all duration-300">
        {/* Component Sidebar (đã làm ở bước trước) sẽ tự lấp đầy khu vực này */}
        <Sidebar />
      </aside>

      {/* ===== CỘT PHẢI: HEADER & NỘI DUNG CHÍNH ===== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* --- HEADER --- */}
        <header className="h-[76px] bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          {/* Bên trái Header: Nút Menu Mobile & Thanh Tìm Kiếm */}
          <div className="flex items-center gap-4">
            {/* Nút Menu Mobile (Chỉ hiện khi màn hình nhỏ) */}
            <button className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              <HiOutlineMenuAlt2 size="1.5rem" />
            </button>

            {/* Box Tìm Kiếm (Ẩn trên màn hình quá nhỏ cho gọn) */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300 w-64 lg:w-80">
              <CiSearch
                className="text-slate-400 font-bold shrink-0"
                size="1.25rem"
              />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
                className="bg-transparent border-none outline-none text-[15px] w-full text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Bên phải Header: Cụm User Dropdown */}
          <div className="flex items-center gap-4">
            <UserDropdown />
          </div>
        </header>

        {/* --- MAIN CONTENT (OUTLET) --- */}
        {/* Khu vực duy nhất có thanh cuộn (overflow-y-auto) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8 relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutAdmin;
