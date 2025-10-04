import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import { HOMEPAGE, LOGIN, REGISTER, SEARCH } from '../utils/path';
import { navs } from '../utils/navs';
import { useSelector } from 'react-redux';
import UserDropdown from './UserDropdown';
import InputSearch from './InputSearch';

function Header() {

    const navigate = useNavigate()
    const auth = useSelector(state => state.auth)

    return (
        <div className="h-[80px] lg:px-40 md:px-20 px-5 bg-[#EAFBFB] flex items-center">
            <div className='flex items-center cursor-pointer lg:w-1/5'
                onClick={() => { navigate(HOMEPAGE) }}
            >
                <div className='h-[80px] w-[80px]'>
                    <img className='object-center object-cover size-full scale-125' src={logo} />
                </div>
                <p className='text-2xl font-semibold font-Lobster'>Nger Hospital</p>
            </div>
            <div className='hidden gap-7 w-3/5 xl:flex'>
                {navs.map((nav, i) => {
                    return (
                        <div key={`nav-${i}`} className='cursor-pointer'
                            onClick={() => { navigate(nav.path) }}
                        >
                            <p className='font-semibold'>{nav.name}</p>
                            <p className='text-xs text-nowrap'>{nav.title}</p>
                        </div>
                    )
                })}
                <InputSearch/>
            </div>
            {auth && auth?.token ?
                <div className='w-1/5 hidden xl:block'>
                    <UserDropdown auth={auth} />
                </div>
                :
                <div className='w-1/5 text-white hidden xl:flex xl:justify-end gap-4'>
                    <button className='rounded-lg bg-primary-50 px-2 py-1 cursor-pointer'
                        onClick={() => { navigate(LOGIN) }}
                    >Đăng nhập</button>

                    <button className='rounded-lg bg-primary-50 px-2 py-1 cursor-pointer'
                        onClick={() => { navigate(REGISTER) }}
                    >Đăng ký</button>
                </div>
            }
        </div>
    );
}

export default Header;