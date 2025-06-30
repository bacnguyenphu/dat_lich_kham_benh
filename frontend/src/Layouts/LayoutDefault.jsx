import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";

function LayoutDefault() {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div>
                <Outlet/>
            </div>
            <div className="bg-primary-50 h-12"></div>
            <div>
                <Footer/>
            </div>
        </div>
    );
}

export default LayoutDefault;