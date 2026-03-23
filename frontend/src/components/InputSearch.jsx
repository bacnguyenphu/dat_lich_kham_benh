import { useNavigate } from "react-router-dom";
import { SEARCH } from "../utils/path";
import { FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

function InputSearch() {
  const navigate = useNavigate();

  const texts = ["Tìm kiếm...", "Bác sĩ...", "Chuyên khoa...", "Gói khám..."];

  const [placeHolder, setPlaceHolder] = useState(texts[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % texts.length;
      setPlaceHolder(texts[indexRef.current]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="group flex items-center gap-3 bg-slate-100 hover:bg-white border border-transparent hover:border-blue-400 rounded-full px-4 py-2.5 cursor-pointer w-full transition-all duration-300 shadow-sm hover:shadow-md"
      onClick={() => navigate(SEARCH)}
    >
      <FiSearch
        className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0"
        size={"1.2rem"}
      />

      <span className="text-[14px] font-medium text-slate-500 group-hover:text-slate-700 whitespace-nowrap overflow-hidden transition-colors">
        {placeHolder}
      </span>

      <div className="ml-auto hidden sm:flex items-center justify-center bg-white rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500 transition-all shrink-0">
        ⌘ K
      </div>
    </div>
  );
}

export default InputSearch;
