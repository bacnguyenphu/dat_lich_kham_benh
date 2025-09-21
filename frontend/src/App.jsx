import { Routes, Route } from 'react-router-dom'
import { Doctor, ListMedicalPackgeFollowCategory, Specialty } from './components'
import {
  ADMIN, CATEGORY_PACKAGE, DOCTORS, INFORMATION_DOCTOR, INFORMATION_PAKAGE, LOGIN,
  MAKE_APPOINTMENT, MANAGE_APPOINTMENT, MANAGE_DOCTOR, MANAGE_MEDICAL,
  MANAGE_PACKAGE,
  MANAGE_POSITION, MANAGE_SPECIALTY, MANAGE_USERS, MEDICAL_EXAMINATION_PLAN, MEDICAL_PACKAGE,
  PACKAGE_PLAN,
  REGISTER, SPECIALTY, STATISTICAL
} from './utils/path'
import { LayoutAdmin, LayoutDefault } from './Layouts'
import Category_Package from './components/Category_Package'
import {
  CategoriesPackage,
  InformationDoctor, InformationPackage, ManageSpecialty,
  ManageUsers,
  MedicalExaminationPlan, Position, Statistical
} from './components/Admin'
import ManageAppointment from './components/Admin/ManageAppointment'
import { ToastContainer } from 'react-toastify';
import {
  DetailDoctor, DetailMedicalPackage, DetailSpecialty,
  HomePage, Login, MakeAppointment, Register
} from './pages'

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
          <Route path={`${MEDICAL_PACKAGE}/:slug`} element={<ListMedicalPackgeFollowCategory />} />
          <Route path={`${MEDICAL_PACKAGE}/:slug/:id`} element={<DetailMedicalPackage />} />
          <Route path={MAKE_APPOINTMENT} element={<MakeAppointment/>} />
        </Route>

        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />

        <Route path={ADMIN} element={<LayoutAdmin />}>
          <Route path={STATISTICAL} element={<Statistical />} />
          <Route path={MANAGE_DOCTOR} element={null}>
            <Route path={INFORMATION_DOCTOR} element={<InformationDoctor />} />
            <Route path={MEDICAL_EXAMINATION_PLAN} element={<MedicalExaminationPlan type={'DOCTOR'} />} />
          </Route>
          <Route path={MANAGE_PACKAGE} element={null}>
            <Route path={INFORMATION_PAKAGE} element={<InformationPackage />} />
            <Route path={PACKAGE_PLAN} element={<MedicalExaminationPlan type={'MEDICAL_PACKAGE'} />} />
            <Route path={CATEGORY_PACKAGE} element={<CategoriesPackage />} />
          </Route>
          <Route path={MANAGE_MEDICAL} element={null}>
            <Route path={MANAGE_POSITION} element={<Position />} />
            <Route path={MANAGE_SPECIALTY} element={<ManageSpecialty />} />
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
