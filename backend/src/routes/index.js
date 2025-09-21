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

const initRoutes = (app) => {

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

  app.use('/api', insert)

  return app.use('/', (req, res) => {
    res.send('Server on !')
  })
}

export default initRoutes