import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE } from "../utils/path";

function AdminRoute(props) {
    
    const navigate = useNavigate()
    const auth = useSelector(state => state.auth?.data)
    useEffect(() => {
        if (!auth&&auth?.role!=="R1") {
            navigate(HOMEPAGE)
        }
    }, [])
    

    return (
        <>
            {props.children}
        </>
    );
}

export default AdminRoute;