import { Routes, Route } from 'react-router-dom'
import { Doctor, ListMedicalPackgeFollowCategory, Specialty } from './components'
import {
  ADMIN, APPOINTMENT, CATEGORY_PACKAGE, CHANGE_PASSWORD, DOCTOR, DOCTORS, INFORMATION_DOCTOR, INFORMATION_PAKAGE, LOGIN,
  LOGIN_DOCTOR,
  MAKE_APPOINTMENT, MANAGE_APPOINTMENT, MANAGE_DOCTOR, MANAGE_MEDICAL,
  MANAGE_PACKAGE,
  MANAGE_POSITION, MANAGE_SPECIALTY, MANAGE_USERS, MEDICAL_EXAMINATION_PLAN, MEDICAL_PACKAGE,
  MY_APPOINTMENT,
  MY_INFORMATION,
  MY_PATIENT,
  MY_SCHEDULE,
  PACKAGE_PLAN,
  PROFILE,
  REGISTER, SEARCH, SPECIALTY, STATISTICAL
} from './utils/path'
import { LayoutAdmin, LayoutDefault, LayoutDoctor } from './Layouts'
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
  HomePage, ListAppointment, Login, MakeAppointment, Profile, Register,
  Search
} from './pages'
import AdminRoute from './routes/AdminRoute'
import {
  ChangePassword, LoginDoctor, MyAppointment,
  MyInformation, MyPatient, MySchedule
} from './pages/Doctor'
import DoctorRoute from './routes/DoctorRoute'

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
          <Route path={MAKE_APPOINTMENT} element={<MakeAppointment />} />
          <Route path={PROFILE} element={<Profile />} />
          <Route path={APPOINTMENT} element={<ListAppointment />} />
          <Route path={SEARCH} element={<Search />} />
        </Route>

        <Route path={LOGIN} element={<Login />} />
        <Route path={REGISTER} element={<Register />} />

        <Route path={ADMIN} element={<AdminRoute><LayoutAdmin /></AdminRoute>}>
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

        <Route path={LOGIN_DOCTOR} element={<LoginDoctor />} />
        <Route path={DOCTOR} element={<DoctorRoute><LayoutDoctor /></DoctorRoute>}>
          <Route path={MY_APPOINTMENT} element={<MyAppointment />} />
          <Route path={MY_PATIENT} element={<MyPatient />} />
          <Route path={MY_INFORMATION} element={<MyInformation />} />
          <Route path={MY_SCHEDULE} element={<MySchedule />} />
          <Route path={CHANGE_PASSWORD} element={<ChangePassword />} />
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
