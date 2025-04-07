import {Routes, Route} from 'react-router-dom'
import { Login, Register } from './components'
import { LOGIN, REGISTER } from './utils/path'
import { LayoutDefault } from './Layouts'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutDefault/>}></Route>
        <Route path={LOGIN} element={<Login/>}/>
        <Route path={REGISTER} element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
