const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

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
    
    socket.on('join', ({username, room}) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome'))

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter

        if (filter.isProfane(message)) {
            return callback('Profantiy is not allowed')
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.lat},${location.long}`))
        callback('Location Sent!')
    })

   

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left.'))
    })
})

server.listen(port, () => {
    console.log('Server is running port: ', port)
})