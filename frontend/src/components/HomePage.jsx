import family from '../assets/familyImage.jpeg'
import { navs } from '../utils/navs';

function HomePage() {
    return (
        <div>
            <div className="h-[465px]">
                <img className="object-center object-cover size-full" src={family} />
            </div>
            <div className='px-40 mt-10'>
                <p className='text-2xl font-semibold'>Dành cho bạn</p>
                <div className='flex gap-20 mt-10'>
                    {navs.map((nav, index) => {
                        return (
                            <div key={`nav-${index}-hp`} className='cursor-pointer'>
                                <div className='size-56 rounded-full overflow-hidden'>
                                    <img className='object-cover object-center size-full' src={nav.image} />
                                </div>
                                <p className='text-xl text-center mt-4'>{nav.name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default HomePage;