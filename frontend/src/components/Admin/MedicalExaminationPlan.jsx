import { useEffect } from "react";
import { useState } from "react";
import { getTimeFrames } from "../../services/timeFrameService";
import _ from 'lodash'
import Select from 'react-select';
import { getDoctors } from "../../services/doctorService";
import { createOrUpdateSchedule } from "../../services/scheduleService";
import { getScheduleFollowDate } from "../../services/scheduleService";
import { toast } from "react-toastify";

function MedicalExaminationPlan() {

    const [timeFrames, setTimeFrames] = useState([])
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

    const classNormal = "px-12 py-2.5 border rounded-lg text-center cursor-pointer"
    const classActive = "px-12 py-2.5 border font-semibold text-white bg-primary-100 rounded-lg text-center cursor-pointer"

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
                setDoctors(temp)
            }
        }
        if (timeFrames.length > 0) {
            fetchDoctors()
        }
    }, [timeFrames])

    useEffect(() => {
        if (selectedDoctor != null) {
            const fetchScheduleFollowDate = async () => {
                const res = await getScheduleFollowDate(selectedDoctor?.value, selectedDate)
                console.log('check res:   ', res);
                if (res.err === 0 && res.data !== null) {
                    let temp = _.cloneDeep(timeFrames).map(item => {
                        return {
                            ...item,
                            selected: res.data.time_frame.some(item2=>item2.id===item.id)
                        }
                    })
                    setTimeFrames(temp)
                }

            }
            fetchScheduleFollowDate()
        }

    }, [selectedDoctor, selectedDate])

    const handleSelectTimeFrame = (id) => {
        let temp = _.cloneDeep(timeFrames)
        let index = temp.findIndex(item => item.id === id)
        if (index !== -1) {
            temp[index].selected = !temp[index].selected
            setTimeFrames(temp)
        }
    }

    const handleClickSave = async () => {
        if (selectedDate && selectedDoctor && timeFrames.length > 0) {
            let payload = {
                idDoctor: selectedDoctor.value,
                appointment_date: selectedDate,
                time_frame: timeFrames.filter(item => item.selected === true).map(item => item.id)
            }
            const res = await createOrUpdateSchedule(payload)
            if (res.err === 0) {
                toast.success(res.message)
            }
            else {
                toast.error(res.message)
            }
        }
    }

    return (
        <div className="mt-10 w-6xl mx-auto shadow-item px-4 pb-5">
            <h3 className="font-semibold text-2xl text-center text-[#0106B4] border-b border-gray-400 py-5">Kế Hoạch Khám Bệnh Của Bác Sĩ</h3>
            <div className="mt-10 flex items-center gap-5">
                <div className="w-9/12">
                    <p className="mb-1">Họ tên bác sĩ và chuyên khoa <span className="text-red-500">*</span></p>
                    <Select
                        defaultValue={selectedDoctor}
                        onChange={setSelectedDoctor}
                        options={doctors}
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