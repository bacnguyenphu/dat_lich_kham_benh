import { useEffect } from "react";
import { useState } from "react";
import { getTimeFrames } from "../../services/timeFrameService";
import _ from 'lodash'
import Select from 'react-select';
import { getDoctorById, getDoctors } from "../../services/doctorService";
import { createOrUpdateSchedule } from "../../services/scheduleService";
import { getScheduleFollowDate } from "../../services/scheduleService";
import { toast } from "react-toastify";
import { getMedicalPackage } from "../../services/medicalPackageService";
import { useSelector } from 'react-redux'

// type có 3 loại DOCTOR, MEDICAL_PACKAGE, DOCTOR_ONLY=> cái DOCTOR_ONLY mình dành cho trang quản lý của riêng bác sĩ 
function MedicalExaminationPlan({ type }) {

    const [timeFrames, setTimeFrames] = useState([])
    const [listItems, setListItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

    const classNormal = "px-10 py-2.5 border rounded-lg text-center cursor-pointer"
    const classActive = "px-10 py-2.5 border font-semibold text-white bg-primary-100 rounded-lg text-center cursor-pointer"

    const idDoctor = useSelector(state => state?.authDoctor?.data?.id) // dành cho trang quản lý của riêng bác sĩ 

    useEffect(() => {
        const fetchTimeFrames = async () => {
            const res = await getTimeFrames()
            // console.log('check res: ', res);
            if (res.err === 0) {
                let temp = []
                temp = res.data.map(item => {
                    return {
                        ...item,
                        selected: false
                    }
                })
                setTimeFrames(temp)
            }
        }
        fetchTimeFrames()
    }, [])

    useEffect(() => {
        if (type === "DOCTOR") {
            const fetchDoctors = async () => {
                const res = await getDoctors()
                if (res.err === 0 && res.data.length > 0) {
                    let temp = res.data.map(item => {
                        return {
                            value: item?.id,
                            label: `${item?.user?.firstName} ${item?.user?.lastName} - Chuyên khoa: ${item?.specialty
                                .map(spe => spe?.name)}`
                        }
                    })
                    setListItems(temp)
                }
            }
            fetchDoctors()
        }

        if (type === "MEDICAL_PACKAGE") {
            const fetchMedicalPackage = async () => {
                const res = await getMedicalPackage()
                if (res.err === 0 && res.data.length > 0) {
                    let temp = res.data.map(item => {
                        return {
                            value: item?.id,
                            label: `${item?.name} - Danh mục: ${item?.category_package?.name}`
                        }
                    })
                    setListItems(temp)
                }
            }
            fetchMedicalPackage()
        }

        if (type === "DOCTOR_ONLY" && idDoctor) {
            const fetchDoctor = async () => {
                const item = await getDoctorById(idDoctor)
                let temp = [{
                    value: item?.data?.id,
                    label: `${item?.data?.user?.firstName} ${item?.data?.user?.lastName} - Chuyên khoa: ${item?.data?.specialty.map(spe => spe?.name)}`
                }]
                setListItems(temp)
            }
            fetchDoctor()
        }

    }, [type])

    // cái này để load các timeFrame được select
    useEffect(() => {
        if (selectedItem != null) {
            const tses = {
                [type === "DOCTOR" ? "id_doctor" : "idMedicalPackage"]: selectedItem.value,
                appointment_date: selectedDate
            }

            const fetchScheduleFollowDate = async () => {
                const res = await getScheduleFollowDate({
                    [type === "MEDICAL_PACKAGE" ? "idMedicalPackage" : "id_doctor"]: selectedItem.value,
                    appointment_date: selectedDate
                })
                // console.log('check res:   ', res);
                if (res.err === 0 && res.data !== null) {
                    let temp = _.cloneDeep(timeFrames).map(item => {
                        return {
                            ...item,
                            selected: res.data.time_frame.some(item2 => item2.id === item.id)
                        }
                    })
                    setTimeFrames(temp)
                }
                else {
                    let temp = _.cloneDeep(timeFrames).map(item => {
                        return {
                            ...item,
                            selected: false
                        }
                    })
                    setTimeFrames(temp)
                }

            }
            fetchScheduleFollowDate()
        }

    }, [selectedItem, selectedDate])

    const handleSelectTimeFrame = (id) => {
        let temp = _.cloneDeep(timeFrames)
        let index = temp.findIndex(item => item.id === id)
        if (index !== -1) {
            temp[index].selected = !temp[index].selected
            setTimeFrames(temp)
        }
    }

    const handleClickSave = async () => {
        if (selectedDate && selectedItem && timeFrames.length > 0) {
            let payload = {
                [type === "MEDICAL_PACKAGE" ? "idMedicalPackage" : "idDoctor"]: selectedItem.value,
                appointment_date: selectedDate,
                time_frame: timeFrames.filter(item => item.selected === true).map(item => item.id)
            }
            const res = await createOrUpdateSchedule(payload)
            console.log(payload);

            if (res.err === 0) {
                toast.success(res.message)
            }
            else {
                toast.error(res.message)
            }
        }
    }

    return (
        <div className="mt-10 w-5xl mx-auto shadow-item px-4 pb-5">
            {(type === "DOCTOR" || type === "DOCTOR_ONLY") && <h3 className="font-semibold text-2xl text-center text-[#0106B4] border-b border-gray-400 py-5">Kế Hoạch Khám Bệnh Của Bác Sĩ</h3>}
            {type === "MEDICAL_PACKAGE" && <h3 className="font-semibold text-2xl text-center text-[#0106B4] border-b border-gray-400 py-5">Kế Hoạch Khám Bệnh Của Gói Khám</h3>}
            <div className="mt-10 flex items-center gap-5">
                <div className="w-9/12">
                    {type === "MEDICAL_PACKAGE" && <p className="mb-1">Tên gói khám và danh mục <span className="text-red-500">*</span></p>}
                    {(type === "DOCTOR" || type === "DOCTOR_ONLY") && <p className="mb-1">Tên bác sĩ và chuyên khoa <span className="text-red-500">*</span></p>}
                    <Select
                        defaultValue={selectedItem}
                        onChange={setSelectedItem}
                        options={listItems}
                    />
                </div>
                <div className="w-3/12">
                    <p className="mb-1">Chọn ngày <span className="text-red-500">*</span></p>
                    <input type="date" className="border border-gray-300 rounded-md p-1.5 w-full" value={selectedDate} min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => { setSelectedDate(e.target.value) }} />
                </div>
            </div>
            <div className="grid grid-cols-5 gap-4 mt-10">
                {timeFrames.length > 0 &&
                    timeFrames.map(item => {
                        return (
                            <div key={item.id} className={item.selected ? classActive : classNormal} onClick={() => { handleSelectTimeFrame(item.id) }}>{item?.time_frame}</div>
                        )
                    })}
            </div>
            <div className="flex justify-center items-center mt-10">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    onClick={() => { handleClickSave() }}
                >Lưu lại</button>
            </div>
        </div>
    );
}

export default MedicalExaminationPlan;