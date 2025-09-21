import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getInfoToMakeAppointment } from "../services/appointment";

function MakeAppointment() {
    const [searchParams] = useSearchParams();

    const idDoctor = searchParams.get("idDoctor");
    const idMedicalPackage = searchParams.get("idMedicalPackage");
    const appointment_date = searchParams.get("date");
    const time_frame = searchParams.get("tf");

    useEffect(() => {
        const fetchData = async () => {
            const res = await getInfoToMakeAppointment({ idDoctor, idMedicalPackage, time_frame, appointment_date })
            console.log(res);

        }
        if (appointment_date && time_frame && (idDoctor || idMedicalPackage)) {
            fetchData()
        }
    }, [idDoctor, idMedicalPackage, time_frame, appointment_date])

    return (
        <div>

        </div>
    );
}

export default MakeAppointment;