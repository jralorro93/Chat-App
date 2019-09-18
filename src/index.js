const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser} = require('./utils/users')

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
    
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser( {id: socket.id, username, room} )

        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome'))

        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter
        const user = getUser(socket.id)

        if (filter.isProfane(message)) {
            return callback('Profantiy is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.lat},${location.long}`, user.username ))
        callback('Location Sent!')
    })

   

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
    })
})

server.listen(port, () => {
    console.log('Server is running port: ', port)
})