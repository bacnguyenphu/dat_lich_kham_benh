import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { search } from "../services/search";
import { useEffect } from "react";
import default_image from '../assets/default_image.webp'
import defaultAvatar from '../assets/defaultAvatar.png'

function InputSearch() {

    const ALL = "all"
    const DOCTOR = "doctor"
    const SPECIALTY = "specialty"
    const PACKAGE = "package"

    const [value, setValue] = useState("")
    const [filter, setFilter] = useState(ALL)

    const [doctors, setDoctors] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [packages, setPackages] = useState([])

    useEffect(() => {
        const fetchDataSearch = async () => {
            const res = await search(value, filter)
            console.log(res);
            if (res.err === 0 && res?.data && res.data.length > 0) {
                let dataDoctors = res.data.find(item => item?.name === DOCTOR)
                if (dataDoctors) {
                    setDoctors(dataDoctors.data)
                }
                else {
                    setDoctors([])
                }

                let dataSpecialties = res.data.find(item => item?.name === SPECIALTY)
                if (dataSpecialties) {
                    setSpecialties(dataSpecialties.data)
                }
                else {
                    setSpecialties([])
                }

                let dataPackages = res.data.find(item => item.name === PACKAGE)
                if (dataPackages) {
                    setPackages(dataPackages.data)
                }
                else {
                    setPackages([])
                }
            }
        }

        fetchDataSearch()
    }, [filter])

    // console.log('check doctor', doctors);
    // console.log('check specialty', specialties);
    // console.log('check package', packages);

    return (
        <div className="lg:px-40 md:px-20 px-5">
            <div className="flex items-center w-full border border-gray-400 rounded-4xl px-4 py-2 mt-10">
                <span className="">
                    <FiSearch />
                </span>
                <input className="grow p-1 mx-3 outline-none" value={value} onChange={(e) => { setValue(e.target.value) }} />
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
            <div className="mt-10">
                {specialties.length > 0 &&
                    <div>
                        <p className="font-semibold bg-[#F3F4F6] py-1 px-2">Chuyên khoa</p>
                        {specialties.map((item, i) => {
                            const length = specialties.length
                            return (
                                <div key={item.id}>
                                    <div className="flex items-center gap-4 py-3">
                                        <img className="size-9 object-center object-cover" src={(item?.images) ? item?.images : default_image} />
                                        <p>{item?.name}</p>
                                    </div>
                                    {i !== length - 1 && <hr className="border- border-gray-300" />}
                                </div>
                            )
                        })}
                    </div>
                }
                {doctors.length > 0 &&
                    <div>
                        <p className="font-semibold bg-[#F3F4F6] py-1 px-2">Bác sĩ</p>
                        {doctors.map((item, i) => {
                            const length = doctors.length
                            return (
                                <div key={item.id}>
                                    <div className="flex items-center gap-4 py-3">
                                        <img className="size-9 object-center object-cover" src={(item?.user?.avatar) ? item?.user?.avatar : defaultAvatar} />
                                        <div className="">
                                            <p>{item?.position.map(pos => pos.name).join(" ")} {item?.user?.firstName} {item?.user?.lastName}</p>
                                            <p className="text-sm text-gray-500">{item?.specialty.map(spe => spe.name).join(" - ")}</p>
                                        </div>
                                    </div>
                                    {i !== length - 1 && <hr className="border- border-gray-300" />}
                                </div>
                            )
                        })}
                    </div>
                }
                {packages.length > 0 &&
                    <div>
                        <p className="font-semibold bg-[#F3F4F6] py-1 px-2">Gói khám</p>
                        {packages.map((item, i) => {
                            const length = packages.length
                            return (
                                <div key={item.id}>
                                    <div className="flex items-center gap-4 py-3">
                                        <img className="size-9 object-center object-cover" src={(item?.image) ? item?.image : default_image} />
                                        <div>
                                            <p>{item?.name}</p>
                                            <p className="text-sm text-gray-500">{item?.category_package?.name}</p>
                                        </div>
                                    </div>
                                    {i !== length - 1 && <hr className="border- border-gray-300" />}
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    );
}

export default InputSearch;