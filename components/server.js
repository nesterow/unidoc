/*
███████╗██████╗  ██████╗ ███╗   ██╗████████╗██╗     ███████╗███████╗███████╗
██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██║     ██╔════╝██╔════╝██╔════╝
█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   ██║     █████╗  ███████╗███████╗
██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██║     ██╔══╝  ╚════██║╚════██║
██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗███████╗███████║███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝
<<<<<<<<<<<<   FeathersJS - RiotJS - Turbolinks - Express    >>>>>>>>>>>>>>> 
----------------------------------------------------------------------------
@GitHub: https://github.com/nesterow/frontless
@License: MIT
@Author: Anton Nesterov <arch.nesterov@gmail.com>
*/


import register from '@riotjs/ssr/register'
register()

import serverConfig from 'config/server'
import browserConfig from 'config/browser'

const {CACHE_PAGES, IS_PWA} = browserConfig;
global.CACHE_PAGES = CACHE_PAGES
global.IS_PWA = IS_PWA

const xss = require("xss")
const xssOptions = {}
global.XSS = new xss.FilterXSS(xssOptions)


import cookieParser from 'cookie-parser'
import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'
import session from 'express-session'
import cors from 'cors'
import socketio from '@feathersjs/socketio'
import FrontlessMiddleware from './utils/middleware'
import 'plugins'


const sessionMiddleware = session({
  secret: process.env.HTTP_SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: process.env.HTTP_SESSION_SECURE === 'yes'},
});


const corsMiddleware = cors({
  origin: serverConfig.corsResolver,
});


const api = feathers()
const app = express(api)


app.emit('setup', app)

app.use(cookieParser())
app.use(corsMiddleware)
app.use(sessionMiddleware)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.configure(express.rest())

app.use('/docs', express.static('docs'))
app.use('/assets', express.static('assets'))
app.use('/worker.js', express.static('assets/worker.js'))
app.use('/boot.js', express.static('assets/boot.js'))


app.configure(socketio({}, function(io) {
  io.origins(serverConfig.corsResolver)
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next)
  });
  io.use(function(socket, next) {
    socket.feathers.request = socket.request
    next();
  });
}));


const path = __dirname + '/..';
app.emit('setup:ssr', app)
app.use('/*@:args',  FrontlessMiddleware(path, ['styles']))
app.use('/*',  FrontlessMiddleware(path, ['styles']))

app.setState = (id, data) => {
  return {
    opts: {
      _t: '/m/',
      _id: id,
    },
    data,
  }
}


let Resolve = () => 0
let Reject = () => 0 
const ReadyPromise = new Promise((resolve, reject) => {
  Resolve = resolve;
  Reject = reject;
})  

const start = (mongo) => {
  app.emit('connected', app, mongo)
  require('../services')(app, mongo)
  app.mongo = mongo;
  let server = app.listen(6767, (err) => {
    console.log(`👍  app is listening on ${6767} \r\n`)
    Resolve({app, mongo, server})
  }).
  on('error', (error) => {
    console.log(`❌ ${error} \r\n`)
    Reject(error)
  })
}


start()


module.exports = ReadyPromise