import { Outlet } from "react-router-dom";
import { Header, SideBar } from "../components/Doctor";

function LayoutDoctor() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex mt-6 gap-6 lg:gap-10 pb-10">
        <aside className="hidden md:block w-3/12 shrink-0">
          <div className="sticky top-24 transition-all duration-300">
            <SideBar />
          </div>
        </aside>

        <main className="w-full md:w-9/12 flex flex-col min-h-[calc(100vh-120px)]">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-4 sm:p-6 lg:p-8 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LayoutDoctor;
