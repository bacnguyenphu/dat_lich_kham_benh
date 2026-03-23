import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ totalPages, setPage, currentPage }) {
  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="w-full flex justify-center mt-8 mb-4">
      <ReactPaginate
        onPageChange={handlePageClick}
        pageCount={+totalPages}
        pageRangeDisplayed={3} // Số trang hiển thị ở giữa
        marginPagesDisplayed={1} // Số trang hiển thị ở 2 đầu (VD: 1 ... 4 5 6 ... 10)
        // Đồng bộ trang hiện tại với State của Component cha
        forcePage={currentPage ? currentPage - 1 : undefined}
        // Icon Next / Prev
        previousLabel={<FiChevronLeft size={20} />}
        nextLabel={<FiChevronRight size={20} />}
        breakLabel="..."
        // CSS Container (Khối bao ngoài cùng)
        containerClassName="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2"
        // CSS Nút số trang bình thường
        pageLinkClassName="flex items-center justify-center min-w-[36px] h-[36px] sm:min-w-[40px] sm:h-[40px] px-2 border border-slate-200 rounded-xl font-semibold text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 cursor-pointer select-none"
        // CSS Nút trang đang Active
        activeLinkClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md pointer-events-none"
        // CSS Nút Lùi / Tiến
        previousLinkClassName="flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 cursor-pointer"
        nextLinkClassName="flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 cursor-pointer"
        // CSS khi Nút Lùi / Tiến bị vô hiệu hóa (VD: đang ở trang 1 thì ko lùi được)
        disabledLinkClassName="!opacity-40 !cursor-not-allowed hover:!bg-white hover:!text-slate-600 hover:!border-slate-200"
        // CSS dấu "..."
        breakLinkClassName="flex items-center justify-center min-w-[36px] h-[36px] sm:min-w-[40px] sm:h-[40px] text-slate-400 font-bold select-none cursor-default tracking-widest"
      />
    </div>
  );
}

export default Pagination;
