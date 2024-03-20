// Import custome modules
require('./config/Config')();

// Import third-party modules
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

// Import all routes here
const UserRouter = require('./router/userRouter');
// eslint-disable-next-line max-len
const conductTournamentRouter = require('./router/userRouter'); // Add this line
const adminRoutes=require('./router/adminRoutes');

const app = express();
const port = process.env.PORT;
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: ['http://localhost:5173'], credentials: true}));

app.use('/conductTournament', conductTournamentRouter); // Update this line
app.use('/admin', adminRoutes);
app.use('/', UserRouter);


app.listen(port, () => {
  console.log('server is running:', port);
});
