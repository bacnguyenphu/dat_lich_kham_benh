import { useState } from "react";

function MY_INFORMATION() {
    const [postions, setPositions] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [payload, setPayload] = useState({
        firstName: "",
        lastName: '',
        role: 'R2',
        phone: '',
        email: '',
        password: '',
        dateOfBirth: new Date().toISOString().split("T")[0],
        gender: 'male',
        address: '',
        avatar: null,
        price: '',
        description: '',
        id_specialty: [],
        id_position: [],
        description_detail: '',
    })
    return (
        <div>
            my information
        </div>
    );
}

export default MY_INFORMATION;