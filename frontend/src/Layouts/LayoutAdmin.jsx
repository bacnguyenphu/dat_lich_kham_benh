import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Admin";

function LayoutAdmin() {
    return ( 
        <div className="flex h-screen">
            <div className="w-1/5 border border-amber-300">
                <Sidebar/>
            </div>
            <div className="w-4/5 border border-red-400">
                <Outlet/>
            </div>
        </div>
     );
}

export default LayoutAdmin;