export const Validation=(values,setErrors)=>{
    let newErrors = {}
    if(values?.firstName===''){
        newErrors.firstName='Bạn phải điền họ !'
    }
    if(values?.lastName===""){
        newErrors.lastName='Bạn phải điền tên !'
    }
    if(values?.phone===""){
        newErrors.phone='Bạn phải điền số điện thoại !'
    }
    if(values?.email===""){
        newErrors.email='Bạn phải điền email !'
    }
    if(values?.password===""){
        newErrors.password='Bạn phải điền mật khẩu !'
    }
    if(values?.address===""){
        newErrors.address="Bạn phải điền địa chỉ !"
    }
    if(values?.price===""){
        newErrors.price="Bạn phải điền giá tiền !"
    }

    //chuyen khoa
    if(values?.name===""){
        newErrors.name="Bạn phải điền tên !"
    }

    //medical package
    if(values?.id_category_package===''){
        newErrors.id_category_package="Bạn phải chọn danh mục !"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
}