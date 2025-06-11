import { useEffect } from "react";
import { useState } from "react";
import { getTimeFrames } from "../../services/timeFrameService";
import _ from 'lodash'

function MedicalExaminationPlan() {

    const [timeFrames, setTimeFrames] = useState([])
    const classNormal = "px-12 py-2.5 border rounded-lg text-center cursor-pointer"
    const classActive = "px-12 py-2.5 font-semibold text-white bg-primary-100 rounded-lg text-center cursor-pointer"

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

    const handleSelectTimeFrame = (id) => {
        let temp = _.cloneDeep(timeFrames)
        let index = temp.findIndex(item=>item.id===id)
        if(index!==-1){
            temp[index].selected=!temp[index].selected
            setTimeFrames(temp)
        }
    }

    return (
        <div className="mt-10 w-6xl mx-auto shadow-item px-4 pb-5">
            <h3 className="font-semibold text-2xl text-center text-[#0106B4] border-b border-gray-400 py-5">Kế Hoạch Khám Bệnh Của Bác Sĩ</h3>
            <div className="grid grid-cols-5 gap-4 mt-10">
                {timeFrames.length > 0 &&
                    timeFrames.map(item => {
                        return (
                            <div key={item.id} className={item.selected ? classActive : classNormal} onClick={() => { handleSelectTimeFrame(item.id) }}>{item?.time_frame}</div>
                        )
                    })}
            </div>
            <div className="flex justify-center items-center mt-10">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Lưu lại</button>
            </div>
        </div>
    );
}

export default MedicalExaminationPlan;