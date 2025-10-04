import { useNavigate } from "react-router-dom";
import { SEARCH } from "../utils/path";
import { FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

function InputSearch() {

    const navigate = useNavigate()
    const [placeHolder, setPlaceHolder] = useState("")
    const texts = ["Tìm kiếm...", "Bác sĩ...", "Chuyên khoa...", "Gói khám..."]
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            indexRef.current = (indexRef.current + 1) % texts.length;
            setPlaceHolder(texts[indexRef.current]);
        }, 2000); // đổi mỗi 2 giây
        
        return () => clearInterval(interval); // dọn sạch khi component unmount
    }, []);

    return (
        <div className='flex items-center gap-2 border border-gray-400 rounded-2xl px-2 cursor-pointer'
            onClick={() => { navigate(SEARCH) }}
        >
            <FiSearch size={'1.25rem'} />
            <input className='outline-none cursor-pointer' placeholder={placeHolder} disabled />
        </div>
    );
}

export default InputSearch;