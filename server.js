require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT= process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')

// Database connection

const url = 'mongodb://localhost/pizza-test';
mongoose.connect(url);
const connection = mongoose.connection;
connection.once('open', () => {
console.log('Database connected...');
}).on('error',(error)=> {
    console.log('Connection failed...');
});



//Session Store
/*let mongoStore = new MongoDbStore({
    mongooseConnection: connection, //Connection will be established.
    collection: 'sessions'  //The table will be created in side as sessions. 
})*/

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        client: connection.getClient()
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}//Calculate in miliseconds and it will give the result of 24 hours, means the cookies will be available till 24 hours
}))

//Using flash
app.use(flash())

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//Set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})
module.exports = app;