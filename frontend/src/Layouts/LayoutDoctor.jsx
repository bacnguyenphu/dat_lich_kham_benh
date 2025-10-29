import { Outlet } from "react-router-dom";
import { Header, SideBar } from "../components/Doctor";

function LayoutDoctor() {
    return ( 
        <div>
            <Header/>
            <div className="px-20 flex mt-4 gap-20">
                <div className="w-3/12">
                    <SideBar/>
                </div>
                <div className="w-9/12">
                    <Outlet/>
                </div>
            </div>
        </div>
     );
}

export default LayoutDoctor;