// staticFiles.js
const express = require('express');
const app = express();
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

var directory = __dirname;
console.log("FOUND SITE DIRECTORY")

console.log(`SITE DIRECTORY: ${directory}`)

app.get('/fonts/google-concertone.ttf', (req, res) => {
  res.sendFile(`${directory}\\views\\fonts\\google-concertone.ttf`);
});

app.get('/fonts/google-francoisone.ttf', (req, res) => {
  res.sendFile(`${directory}\\views\\fonts\\google-francoisone.ttf`);
});

app.get('/fonts/google-leaguespartan.ttf', (req, res) => {
  res.sendFile(`${directory}\\views\\fonts\\google-leaguespartan.ttf`);
});

app.get('/fonts/google-robotomono.ttf', (req, res) => {
  res.sendFile(`${directory}\\views\\fonts\\google-robotomono.ttf`);
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(`${directory}\\sockets\\socket.io.min.js`)
})

app.get('/css/allFrontend.css', (req, res) => {
  res.sendFile(`${directory}\\views\\css\\allFrontend.css`);
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${directory}\\views\\favicon.ico`);
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(`${directory}\\views\\manifest.json`)
})

app.get('/logo512.png', (req, res) => {
  res.sendFile(`${directory}\\views\\img\\logo512.png`);
});

app.get('/mainVideo.mp4', (req, res) => {
  res.sendFile(`${directory}\\videos\\introductory-video.mp4`)
})

app.get('/logos/Facebook-Banner.jpg', (req, res) => {
  res.sendFile(`${directory}\\logos\\Facebook-Banner.png`)
})
app.get('/logos/Social-Icon-BlackOnWhite.png', (req, res) => {
  res.sendFile(`${directory}\\logos\\Social-Icon-BlackOnWhite.png`)
})
app.get('/logos/Social-Icon-WhiteOnBlack.png', (req, res) => {
  res.sendFile(`${directory}\\logos\\Social-Icon-WhiteOnBlack.png`)
})
module.exports = app;
