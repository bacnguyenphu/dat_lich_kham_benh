import auth from './auth'
import insert from './insert'
import specialty from './specialty'
import category_package from './categoryPackage'
import position from './position'
import doctor from './doctor'
import timeFrame from './timeFrame'
import schedule from './schedule'
import medical_package from './medicalPackage'
import user from './user'
import appointment from './appointment'
import search from './search'

const initRoutes = (app) => {

  // app.use((req, res, next) => {
  //   // Các route không cần xác thực
  //   const openRoutes = ["/api/login", "api/register"];

  //   if (openRoutes.includes(req.path)) {
  //     return next(); // bỏ qua kiểm tra token
  //   }

  //   checkUserJWT(req,res,next); // áp dụng kiểm tra token cho các route còn lại
  // });

  app.use('/api', auth)
  app.use('/api', specialty)
  app.use('/api', category_package)
  app.use('/api', position)
  app.use('/api', doctor)
  app.use('/api', timeFrame)
  app.use('/api', schedule)
  app.use('/api', medical_package)
  app.use('/api', user)
  app.use('/api', appointment)
  app.use('/api', search)

  app.use('/api', insert)

  return app.use('/', (req, res) => {
    res.send('Server on !')
  })
}

export default initRoutes