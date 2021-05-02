require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000


app.get('/auth', function (req, res) {
    // Scopes must be separated by spaces
    const scopes = 'user-modify-playback-state'

    const redirect_uri = 'http://localhost:3000/auth/spotify/callback'

    res.redirect(`https://accounts.spotify.com/authorize` +
        `?client_id=${process.env.CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&show_dialog=true`)
});


app.listen(port, () => {
    console.log(`You can now access http://localhost:${port}/auth`)
})