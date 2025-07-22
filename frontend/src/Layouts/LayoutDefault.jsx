import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";

function LayoutDefault() {
    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <Header />
            </div>
            <div className="grow">
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