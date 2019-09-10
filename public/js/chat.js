const socket = io()

//Elements - Allows manipulation
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#sendLocation')



socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value = ''
      $messageFormInput.focus()
      
        if (error) {
          return console.log(error)
      }

        console.log('The message was delivered')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=> {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, (message) => {
            console.log(message)
            $locationButton.removeAttribute('disabled')
        })
    })
})
