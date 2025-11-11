import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";
import { getPatientOfDoctor } from "../../services/doctorService";
import Pagination from "../../components/Pagination";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaRegEye } from "react-icons/fa6";
import { AppointmentsOfPatient } from "../../components/Doctor";
import { useNavigate } from "react-router-dom";

function MyPatient() {
    const navigate = useNavigate()
    const [value, setValue] = useState("")
    const [debouncedValue, setDebouncedValue] = useState("")
    const [patients, setPatients] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const limit = 5
    const [page, setPage] = useState(1)

    const [isShow, setIsShow] = useState(false) //cái này là trạng thái để hiện các lịch khám của bệnh nhân

    const authDoctor = useSelector(state => state?.authDoctor?.data)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, 500); // chờ 0.5s sau khi ngừng gõ

        return () => clearTimeout(handler);
    }, [value])

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await getPatientOfDoctor(authDoctor?.id, limit, 1, debouncedValue.trim())
            if (res.err === 0) {
                setPatients(res?.data)
                setTotalPages(res?.totalPage)
            }
        }
        fetchPatients()
    }, [page, debouncedValue])

    const handleShowAppointmentOfPatient = async (id_patient) => {
        navigate(`?id_patient=${id_patient}`)
        setIsShow(true)
    }
    return (
        <>
            <div>
                <h3 className="text-2xl font-semibold">Bệnh nhân của tôi</h3>
                <div className="mt-5">
                    <div className="flex items-center border border-gray-400 rounded-md grow overflow-hidden">
                        <input className="grow outline-none px-1" placeholder="Tìm kiếm bệnh nhân theo tên hoặc số điện thoại "
                            value={value} onChange={(e) => { setValue(e.target.value) }} />
                        <span className="p-2 bg-blue-700 h-full cursor-pointer"><IoIosSearch size={"1.5rem"} color="white" /></span>
                    </div>
                </div>
                <div className="mt-5">
                    {patients.length>0?
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50">
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">STT</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Bệnh nhân</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Số lần khám</th>
                                <th className="p-4 text-sm font-normal leading-none text-slate-500">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length > 0 &&
                                patients.map((patient, index) => {
                                    return (
                                        <tr className="hover:bg-slate-50" key={patient?.id_patient}>
                                            <td className="p-3 border-b border-slate-200">
                                                <p className="block font-semibold text-sm text-slate-800">{(page - 1) * limit + index + 1}</p>
                                            </td>
                                            <td className="p-3 border-b border-slate-200">
                                                <p className="text-sm text-slate-800 flex flex-col gap-1">
                                                    <span className="font-semibold">{patient?.user?.firstName} {patient?.user?.lastName}</span>
                                                    <span className="">SDT: {patient?.user?.phone}</span>
                                                    <span>Địa chỉ: {patient?.user?.address}</span>
                                                </p>
                                            </td>
                                            <td className="p-3 border-b border-slate-200">
                                                <p className="text-sm font-semibold text-slate-800 flex flex-col">
                                                    {patient?.visitCount}
                                                </p>
                                            </td>
                                            <td className="p-3 border-b border-slate-200">
                                                <p className="text-slate-500 flex">
                                                    <Tippy content="Xem chi tiết">
                                                        <span className="cursor-pointer"
                                                            onClick={() => { handleShowAppointmentOfPatient(patient?.id_patient) }}
                                                        >
                                                            <FaRegEye size={"1.25rem"} color="green" />
                                                        </span>
                                                    </Tippy>
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <div className="font-semibold">
                        Không có bệnh nhân nào !
                    </div>
                }
                    
                </div>
                {patients.length > 5 &&
                    <div>
                        <Pagination setPage={setPage} totalPages={totalPages} />
                    </div>
                }
            </div>
            {isShow && <AppointmentsOfPatient setIsShow={setIsShow} />}
        </>

    );
}

export default MyPatient;  