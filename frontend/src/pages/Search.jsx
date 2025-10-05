import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { search } from "../services/search";

function InputSearch() {

    const ALL = "all"
    const DOCTOR = "doctor"
    const SPECIALTY = "specialty"
    const PACKAGE = "package"

    const [value, setValue] = useState("")
    const [filter, setFilter] = useState(ALL)

    const handleSearch = async () => {
        const res = await search(value,filter)
        console.log("check res>>>",res);
                
    }

    return (
        <div className="lg:px-40 md:px-20 px-5">
            <div className="flex items-center w-full border border-gray-400 rounded-4xl px-4 py-2 mt-10">
                <span className="">
                    <FiSearch />
                </span>
                <input className="grow p-1 mx-3 outline-none" value={value} onChange={(e)=>{setValue(e.target.value)}} />
                <select className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
                    defaultValue={ALL}
                    onChange={(e) => { setFilter(e.target.value) }}
                >
                    <option value={ALL}>Tất cả</option>
                    <option value={DOCTOR}>Bác sĩ</option>
                    <option value={SPECIALTY}>Chuyên khoa</option>
                    <option value={PACKAGE}>Gói khám</option>
                </select>
            </div>
            <button onClick={() => { handleSearch() }}>search</button>
        </div>
    );
}

export default InputSearch;