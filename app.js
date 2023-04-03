require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const conectDB = require('./db')
const express = require('express')
const server = express() 


const router = require('./router')

const port = process.env.PORT

server.use(express.static(path.join(__dirname, 'public')));

server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs');



server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use('/', router)

conectDB().then(() => {
    server.listen(port);
   }).catch((err) => {
    console.log('DB Error', err)
   })
