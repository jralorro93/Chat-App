const path = require('path')
const express = require('express')

const app = express()

//Sets up public directory
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

//Express middle that serves up static files, takes in a root argument, which specifies the root directory from which to serve static files
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server is running port: ', port)
})