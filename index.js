const express = require('express')
const UserRouter = require('./router/userRouter')
const bodyParser = require('body-parser')
const app = express()
const port = 5002
const cors = require('cors')
const { conductTournament } = require('./controllers/ConductTournament')
const conductTournamentRouter = require('./router/ConductTournamentRouter')
const cookieParser = require('cookie-parser')
require('./config/Config')()
require ("dotenv").config()

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors(
    
))

app.use('/',UserRouter)
app.use('/conductTournament',conductTournamentRouter)

app.listen(port,() => {
    console.log('server is running:',port)
})

