const express = require('express');
const axios = require('axios')
const {getNewToken} = require("./tools.js");
const router = express.Router();

/**
 * Axios request to get playlist image urls.
 * @param playlistId id of playlist
 * @param accessToken access token of user
 * @returns {Promise<AxiosResponse<any>>} promise of the request
 */
async function getPlaylist(playlistId, accessToken) {
    return await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/images`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
}

/**
 * Attempt to retrieve image (size: 300x300) url of a playlist. Will send new token if has expired.
 */
router.post('/playlist', async (req, res) => {
    const playlistId = req.body.playlistId
    const accessToken = req.body.accessToken
    const refreshToken = req.body.refreshToken

    try {
        const response = await getPlaylist(playlistId, accessToken);
        res.send(response.data[2].url);
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.error.message

            switch (errorMessage) {
                // Send new access token if has expired
                case 'The access token expired':
                    const newToken = await getNewToken(refreshToken)
                    res.send(newToken)
                    break;
                default:
                    res.send(error.response.data.error.message)
            }

        } else res.send(error.message);
    }
})

/**
 * Source https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
 * @param error
 */
function onError(error) {
    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);
}

module.exports = router;
