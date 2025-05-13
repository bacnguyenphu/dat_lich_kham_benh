import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Admin";
import { CiSearch } from "react-icons/ci";

function LayoutAdmin() {
    return (
        <div className="flex h-screen">
            <div className="w-1/5 shadow-[10px_0px_10px_0px_#e2e8f0]">
                <Sidebar />
            </div>
            <div className="w-4/5">
                <div className="bg-primary-100 h-20 flex items-center justify-end gap-10 px-10">
                    <div className="flex h-10 bg-white px-2.5 py-1 rounded-lg">
                        <input className="outline-0 p-1" />
                        <span className="flex items-center cursor-pointer">
                            <CiSearch size={"1.75rem"}/>
                        </span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="size-10 rounded-full overflow-hidden border-2 border-white">
                            <img className="object-center object-cover size-full" src="https://tse2.mm.bing.net/th/id/OIP.Fh1DHVtoCoFAOCuuv9-NcwHaGT?cb=iwp1&rs=1&pid=ImgDetMain" />
                        </div>
                        <p className="text-white font-semibold">Bac Nguyen</p>
                    </div>

                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default LayoutAdmin;