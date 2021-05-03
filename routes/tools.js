const axios = require('axios')
const querystring = require("querystring");

module.exports = {
    getNewToken: async function (refreshToken) {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', querystring.encode({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            }));
            console.log(response.data.access_token)
            return response.data.access_token
        } catch (error) {
            console.log(error)
            return error
        }
    }
}