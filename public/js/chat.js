const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('form#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    console.log(message)
    socket.emit('sendMessage', message)
})

document.querySelector('button#sendLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=> {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    })
})
