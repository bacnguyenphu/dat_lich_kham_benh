import {register,login} from '../services/authServices'

const handleRegister = async(req,res)=>{
    try {
        const data = req.body
        const message = await register(data)

        return res.status(200).json(message)
        
    } catch (error) {
        console.log(`Lỗi ở handleRegister: `, error);
    }
}

const handleLogin = async(req,res)=>{
    try {
        const data = req.body
        const message = await login(data)
        return res.status(200).json(message)
        
    } catch (error) {
        console.log("Lỗi ở handleLogin: ",error);
        
    }
}

export{handleRegister, handleLogin}