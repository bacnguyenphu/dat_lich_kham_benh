import auth from './auth'
import insert from './insert'
import specialty from './specialty'

const initRoutes = (app)=>{

    app.use('/api',auth)
    app.use('/api',specialty)

    app.use('/api',insert)

     return app.use('/', (req, res) => {
        res.send('Server on !')
      })
}

export default initRoutes