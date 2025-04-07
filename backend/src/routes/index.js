import auth from './auth'

const initRoutes = (app)=>{

    app.use('/api',auth)

     return app.use('/', (req, res) => {
        res.send('Server on !')
      })
}

export default initRoutes