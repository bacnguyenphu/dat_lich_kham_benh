import logo from '../../assets/logo.png'

function Header() {
    return (
        <div className=''>
            <div className='px-20 py-4 bg-[#D1DFC4] flex justify-between items-center'>
                <div className='flex items-center cursor-pointer'>
                    <div className='h-[80px] w-[80px]'>
                        <img className='object-center object-cover size-full scale-125' src={logo} />
                    </div>
                    <p className='text-2xl font-semibold font-Lobster'>Nger Doctor</p>
                </div>
                <p>Xin chào bác sĩ, Nguyễn Phú Bắc!</p>
            </div>
        </div>
    );
}

export default Header;