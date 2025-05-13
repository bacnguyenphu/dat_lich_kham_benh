import auth from './auth'
import insert from './insert'
import specialty from './specialty'
import category_package from './categoryPackage'
import position from './position'

const initRoutes = (app)=>{

    app.use('/api',auth)
    app.use('/api',specialty)
    app.use('/api',category_package)
    app.use('/api',position)

    app.use('/api',insert)

     return app.use('/', (req, res) => {
        res.send('Server on !')
      })
}

export default initRoutes