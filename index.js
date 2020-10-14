// Import yg dubutuhkan
const express = require('express')
const axios = require('axios')
const https = require('https')
const fs = require('fs')

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = '155e3744b9c02706e642'
const clientSecret = '7c6cec7b3997df19ad889e4a838da2c710e03923'

//tambahan untuk enable https:

const port = 9000;
var key = fs.readFileSync('selfsigned.key');
var cert = fs.readFileSync('selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express()
app.use(express.static(__dirname + '/public'))

app.get('/oauth/redirect', (req, res) => {
	// res.redirect(`/coba.html`)
	
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  })
})

var server = https.createServer(options, app);

// Start the server on your chosen port
server.listen(port, () => {
  console.log("server starting on port : " + port)
});
