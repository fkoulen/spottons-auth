require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')
const app = express()
const port = 3000

/**
 * Ask for authorization.
 */
app.get('/auth', function (req, res) {
    // Scopes must be separated by spaces
    const scopes = 'user-modify-playback-state'

    res.redirect(`https://accounts.spotify.com/authorize?` +
        querystring.encode({
            client_id: process.env.CLIENT_ID,
            response_type: 'code',
            redirect_uri: process.env.redirect_uri,
            scope: scopes,
            show_dialog: true
        }))

});

/**
 * Get access token if request is accepted. Show information if not.
 */
app.get('/auth/spotify/callback', function (req, res) {
    if (req.query.error) {
        // TODO - Show info about why permission necessary
        return res.send("You need to accept if you want to use Spottons.")
    }

    axios.post('https://accounts.spotify.com/api/token', querystring.encode({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.redirect_uri,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }))
        .then(function (response) {
            console.log(response.data)
            res.send(response.data.access_token)
        })
        .catch(function (error) {
            console.log(error);
            res.end()
        });
});



app.listen(process.env.PORT || port, () => {
    console.log(`You can now access http://localhost:${port}/auth`)
})