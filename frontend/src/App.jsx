import {Routes, Route} from 'react-router-dom'
import { Login, Register } from './components'
import { LOGIN, REGISTER } from './utils/path'

function App() {

  return (
    <>
      <Routes>
        <Route path={LOGIN} element={<Login/>}/>
        <Route path={REGISTER} element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
