import axios from '../utils/customAxios'

const getTimeFrames = ()=>{
    return axios.get('get-timeFrames')
}

export{getTimeFrames}