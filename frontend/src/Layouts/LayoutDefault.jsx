import { Outlet } from "react-router-dom";
import { Header } from "../components";

function LayoutDefault() {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}

export default LayoutDefault;