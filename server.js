const express = require('express')
const path = require('path')

const webserver = express()

webserver.use(express.static(path.resolve(__dirname,'public')))