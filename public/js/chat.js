const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

const form = document.querySelector('form#message-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    console.log(message)
    socket.emit('sendMessage', message)
})