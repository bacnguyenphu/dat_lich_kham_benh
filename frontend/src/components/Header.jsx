import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { HOMEPAGE, LOGIN, REGISTER } from "../utils/path";
import { navs } from "../utils/navs";
import { useSelector } from "react-redux";
import UserDropdown from "./UserDropdown";
import InputSearch from "./InputSearch";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[80px] bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 xl:gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => navigate(HOMEPAGE)}
          >
            <div className="h-[50px] w-[50px] rounded-full bg-blue-50 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105">
              <img
                className="object-cover h-full w-full"
                src={logo}
                alt="Nger Hospital"
              />
            </div>
            <p className="text-[28px] font-bold text-blue-600 font-Lobster tracking-wide mt-1">
              Nger Hospital
            </p>
          </div>

          <nav className="hidden xl:flex items-center gap-7">
            {navs.map((nav, i) => (
              <div
                key={`nav-${i}`}
                className="cursor-pointer flex flex-col group"
                onClick={() => navigate(nav.path)}
              >
                <p className="font-bold text-[#334155] group-hover:text-blue-600 transition-colors text-[15px]">
                  {nav.name}
                </p>
                <p className="text-[11px] text-slate-400 group-hover:text-blue-400 transition-colors uppercase font-medium mt-[2px] whitespace-nowrap">
                  {nav.title}
                </p>
              </div>
            ))}
          </nav>

          <div className="hidden xl:block min-w-[250px] shrink-0">
            <InputSearch />
          </div>

          <div className="hidden xl:flex items-center justify-end gap-3 shrink-0">
            {auth && auth?.token ? (
              <UserDropdown />
            ) : (
              <>
                <button
                  className="px-6 py-2.5 text-sm font-semibold text-blue-600 bg-transparent border border-blue-600 rounded-full hover:bg-blue-50 transition-colors active:scale-95 whitespace-nowrap"
                  onClick={() => navigate(LOGIN)}
                >
                  Đăng nhập
                </button>
                <button
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
                  onClick={() => navigate(REGISTER)}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>

          <div className="xl:hidden flex items-center shrink-0">
            <button
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <FiMenu size={28} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm xl:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <p className="text-2xl font-bold text-blue-600 font-Lobster">
                Menu
              </p>
              <button
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {auth && auth?.token ? (
                <div className="pb-4 border-b border-slate-100">
                  <UserDropdown />
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-6 border-b border-slate-100">
                  <button
                    className="w-full py-3 font-semibold text-blue-600 border border-blue-600 rounded-xl active:bg-blue-50"
                    onClick={() => {
                      navigate(LOGIN);
                      setIsMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </button>
                  <button
                    className="w-full py-3 font-semibold text-white bg-blue-600 rounded-xl shadow-md active:bg-blue-700"
                    onClick={() => {
                      navigate(REGISTER);
                      setIsMenuOpen(false);
                    }}
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {/* Search Mobile */}
              <div className="w-full">
                <InputSearch />
              </div>

              {/* Nav Links Mobile */}
              <div className="flex flex-col gap-5 mt-2">
                {navs.map((nav, i) => (
                  <div
                    key={`nav-mobile-${i}`}
                    className="flex flex-col cursor-pointer active:opacity-70"
                    onClick={() => {
                      navigate(nav.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    <p className="font-bold text-slate-800 text-lg">
                      {nav.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">
                      {nav.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
