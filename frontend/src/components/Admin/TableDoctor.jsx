function TableDoctor() {
    return (
        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table className="w-full text-left table-auto min-w-max">
                <thead>
                    <tr className="border-b border-slate-300 bg-slate-50">
                        <th className="p-4 text-sm font-normal leading-none text-slate-500">Product</th>
                        <th className="p-4 text-sm font-normal leading-none text-slate-500">Name</th>
                        <th className="p-4 text-sm font-normal leading-none text-slate-500">Quantity</th>
                        <th className="p-4 text-sm font-normal leading-none text-slate-500">Price per Item</th>
                        <th className="p-4 text-sm font-normal leading-none text-slate-500">Total Price</th>
                        <th className="p-4 text-sm font-normal leading-none text-slate-500"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200 py-5">
                            <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/kam-idris-_HqHX3LBN18-unsplash.jpg" alt="Product 1" className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="block font-semibold text-sm text-slate-800">Beautiful Chair</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">2</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$500</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$1,000</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <button type="button" className="text-slate-500 hover:text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200 py-5">
                            <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/spacejoy-NpF_OYE301E-unsplash.jpg" alt="Product 2" className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="block font-semibold text-sm text-slate-800">Little Sofa</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">1</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$750</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$750</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <button type="button" className="text-slate-500 hover:text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200 py-5">
                            <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/michael-oxendine-GHCVUtBECuY-unsplash.jpg" alt="Product 3" className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="block font-semibold text-sm text-slate-800">Brown Coach</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">3</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$3,000</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <p className="text-sm text-slate-500">$9,000</p>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                            <button type="button" className="text-slate-500 hover:text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default TableDoctor;