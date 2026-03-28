import { Outlet } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io"; // Import icon đóng
import UserDropdown from "../components/UserDropdown";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Receptionist/SideBar";

function LayoutReceptionist() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-[76px] bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HiOutlineMenuAlt2 size="1.5rem" />
            </button>
          </div>

          {/* <div className="flex items-center gap-4">
            <UserDropdown />
          </div> */}
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative scroll-smooth bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutReceptionist;
