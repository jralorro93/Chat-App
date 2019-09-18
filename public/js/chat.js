const socket = io()

//Elements - Allows manipulation
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    //First argument renders the  script#messageTemplate
    //Second argument renders the innerHTML of p
    const html = Mustache.render(messageTemplate, { 
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML ('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
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

socket.emit('join', {username, room}, (error) => {
     if (error) {
         alert(error)
         location.href = '/'
     }
})