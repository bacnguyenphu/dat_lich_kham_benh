import { Routes, Route } from 'react-router-dom'
import { DetailDoctor, DetailSpecialty, Doctor, HomePage, Login, Register, Specialty } from './components'
import {
  ADMIN, DOCTORS, INFORMATION_DOCTOR, LOGIN, MANAGE_APPOINTMENT, MANAGE_DOCTOR, MANAGE_MEDICAL,
  MANAGE_PACKAGE,
  MANAGE_POSITION, MANAGE_SPECIALTY, MANAGE_USERS, MEDICAL_EXAMINATION_PLAN, MEDICAL_PACKAGE,
  REGISTER, SPECIALTY, STATISTICAL
} from './utils/path'
import { LayoutAdmin, LayoutDefault } from './Layouts'
import Category_Package from './components/Category_Package'
import {
  InformationDoctor, ManagePackage, ManageSpecialty,
  ManageUsers,
  MedicalExaminationPlan, Position, Statistical
} from './components/Admin'
import ManageAppointment from './components/Admin/ManageAppointment'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutDefault />}>
          <Route index element={<HomePage />} />
          <Route path={SPECIALTY} element={<Specialty />} ></Route>
          <Route path={`${SPECIALTY}/:slug`} element={<DetailSpecialty />} />
          <Route path={DOCTORS} element={<Doctor />} />
          <Route path={`${DOCTORS}/chi-tiet/:idDoctor`} element={<DetailDoctor />} />
          <Route path={MEDICAL_PACKAGE} element={<Category_Package />} />
        </Route>

        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />

        <Route path={ADMIN} element={<LayoutAdmin />}>
          <Route path={STATISTICAL} element={<Statistical />} />
          <Route path={MANAGE_DOCTOR} element={null}>
            <Route path={INFORMATION_DOCTOR} element={<InformationDoctor />} />
            <Route path={MEDICAL_EXAMINATION_PLAN} element={<MedicalExaminationPlan />} />
          </Route>
          <Route path={MANAGE_MEDICAL} element={null}>
            <Route path={MANAGE_POSITION} element={<Position />} />
            <Route path={MANAGE_SPECIALTY} element={<ManageSpecialty />} />
            <Route path={MANAGE_PACKAGE} element={<ManagePackage />} />
          </Route>
          <Route path={MANAGE_APPOINTMENT} element={<ManageAppointment />} />
          <Route path={MANAGE_USERS} element={<ManageUsers />} />
        </Route>

      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
