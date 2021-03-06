const express = require('express');
const axios = require("axios");
const querystring = require('querystring')
const {getNewToken} = require("./tools.js");
const router = express.Router();

/**
 * Redirect to authorization.
 */
router.get('/', (req, res) => {
    res.redirect('/auth')
})

/**
 * Ask for authorization.
 */
router.get('/auth', (req, res) => {
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
router.get('/auth/spotify/callback', (req, res) => {
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
router.get('/refresh/:token', (req, res) => {
    // TODO Maybe create new page for this
    res.send(getNewToken(req.params.token));
});


module.exports = router;
