const users = []

// Add user
const addUser = ({ id, username, room }) => {
    // Cleans the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }

    // Checks for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username already exists'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return { user }
}

// Remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1 ) {
        return users.splice(index, 1)[0]
    }
}

const newUser = addUser({
    id: 1,
    username: 'Jep',
    room: '201'
})
const newUser1 = addUser({
    id: 2,
    username: 'Hi',
    room: '201'
})


// Get user

// Get users in room