const express = require('express')
const UserRouter = require('./router/userRouter')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const cors = require('cors')
const { conductTournament } = require('./controllers/ConductTournament')
require('./config/Config')()
require ("dotenv").config()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors(
    
))

app.use('/',UserRouter)
app.use('/conductTournament',conductTournament)

app.listen(port,() => {
    console.log('server is running')
})

