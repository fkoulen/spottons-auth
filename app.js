require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')
const path = require('path');
const app = express()
const port = 3000

app.set('view engine', 'pug')
/**
 * Redirect to authorization.
 */
app.get('/', function (req, res) {
    res.redirect('/auth')
})

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
            redirect_uri: process.env.REDIRECT_URI,
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
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }))
        .then(function (response) {
            console.log(response.data)
            res.render("tokens", {
                copy_js: path.join(__dirname, '/javascript/copy.js'),
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token
            })
        })
        .catch(function (error) {
            console.log(error);
            res.end()
        });
});

/**
 * Get access token through refresh.
 */
app.get('/refresh/:token', function (req, res) {
    axios.post('https://accounts.spotify.com/api/token', querystring.encode({
        grant_type: 'refresh_token',
        refresh_token: req.params.token,
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

/**
 * Get JS file (for copy button).
 */
app.get('/javascript/copy.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/javascript/copy.js'))
});

app.listen(process.env.PORT || port, () => {
    const env = process.env.ENVIRONMENT
    if (env === "LOCAL") {
        console.log(`You can now access http://localhost:${port}`)
    } else {
        console.log(`Hosted on port ${port}`)
    }
})