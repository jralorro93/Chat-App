const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
//Created server because socketio() needs to pass in a raw http server in the argument
const server = http.createServer(app)
const io = socketio(server)

//Sets up public directory
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

//Express middle that serves up static files, takes in a root argument, which specifies the root directory from which to serve static files
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

server.listen(port, () => {
    console.log('Server is running port: ', port)
})