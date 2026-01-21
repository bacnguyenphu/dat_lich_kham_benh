import { useNavigate } from "react-router-dom";
import { LOGIN_DOCTOR } from "../utils/path";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function DoctorRoute(props) {
    const navigate = useNavigate()
    const auth = useSelector(state => state.authDoctor?.data)

    useEffect(() => {
        if (!auth && auth?.role !== "R2") {
            navigate(`/${LOGIN_DOCTOR}`)
        }
    }, [])


    return (
        <>
            {props.children}
        </>
    );
}

export default DoctorRoute;