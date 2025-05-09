const express = require('express');
const userRoute = require('./src/routes/user.route')
const otherRoute = require('./src/routes/other.route')
const imgManiulateRoute = require('./src/routes/img-manip.route')
const db = require('./src/db/db-conn')
const parser = require('body-parser');
const cookie = require("cookie-parser");
const verifyToken = require('./src/middlewares/authentication')
require('dotenv').config();

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(cookie());

app.use('/',userRoute)
app.use('/protected',verifyToken,otherRoute)
app.use('/convert',imgManiulateRoute)


app.listen(process.env.PORT, () => {
    console.log("Port listing in ", process.env.PORT)
})