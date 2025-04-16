import {Routes, Route} from 'react-router-dom'
import { HomePage, Login, Register, Specialty } from './components'
import { LOGIN, REGISTER, SPECIALTY } from './utils/path'
import { LayoutDefault } from './Layouts'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutDefault/>}>
          <Route index element={<HomePage/>}/>
          <Route path={SPECIALTY} element ={<Specialty/>}/>
        </Route>
        <Route path={LOGIN} element={<Login/>}/>
        <Route path={REGISTER} element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
