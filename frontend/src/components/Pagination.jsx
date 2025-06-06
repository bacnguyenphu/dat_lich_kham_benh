import ReactPaginate from 'react-paginate';

function Pagination({ totalPages, setPage }) {


    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    };

    return (
        <div>
            <ReactPaginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={+totalPages}
                // forcePage={currentPage - 1} // cái này giúp hiển thị page theo state react
                // initialPage={0}
                nextLabel=">"
                previousLabel="<"
                previousLinkClassName="block px-3 py-2 border border-gray-300 rounded hover:bg-primary-50 cursor-pointer"
                nextLinkClassName="block px-3 py-2 border border-gray-300 rounded hover:bg-primary-50 cursor-pointer"
                breakLabel="..."
                pageClassName="mx-1"
                pageLinkClassName="block px-3 py-2 overflow-hidden border border-gray-300 rounded hover:bg-primary-50 cursor-pointer"
                previousClassName="mx-1"
                nextClassName="mx-1"
                breakClassName="mx-1"
                breakLinkClassName="block px-3 py-2 border border-gray-300 rounded hover:bg-primary-50 cursor-pointer"
                containerClassName=" flex flex-wrap justify-center mt-4 items-center"
                activeClassName="bg-primary-50 cursor-pointer overflow-hidden text-white"
            // renderOnZeroPageCount={null}
            />
        </div>
     );
}

export default Pagination;