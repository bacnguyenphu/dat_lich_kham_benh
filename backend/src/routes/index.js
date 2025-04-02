

const initRoutes = (app)=>{
     return app.get('/', (req, res) => {
        res.send('Server on !')
      })
}

export default initRoutes