import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";
import { GoHome } from "react-icons/go";

function Doctors() {

    const naviagte =useNavigate();

    return (
        <div className="lg:px-40 md:px-20 px-5 py-5">
            <div className="flex items-center">
                <span className="cursor-pointer"
                    onClick={() => { naviagte(HOMEPAGE) }}
                >
                    <GoHome color="#00A2A1" size={'1.25rem'} />
                </span>
                <span>/</span>
                <span className="ml-2">Bác sĩ</span>
            </div>
        </div>
    );
}

export default Doctors;