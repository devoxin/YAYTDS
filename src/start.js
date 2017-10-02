const express = require('express');
const app = express();
const port = 42069;
const ytdl = require('ytdl-core')

app.listen(port, () => {
    console.log(`Web server listening on port ${port}.`);
});

app.use(express.static('./views'));

app.get('/api/info/', async (req, res) => {
     
})

app.get('/api/getContent/', async (req, res) => {
    ytdl('https://www.youtube.com/watch?v=WkV0jnWbTFw').pipe(res);
});