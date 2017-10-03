const express = require('express');
const app = express();
const port = 42069;
const ytdl = require('ytdl-core')

app.listen(port, () => {
    console.log(`Web server listening on port ${port}.`);
});

app.use(express.static(`${__dirname}/views`));

app.get('/api/info/', async (req, res) => {
     
});

app.get('/api/getContent/', async (req, res) => {
    res.set({
        "Content-Disposition": 'attachment; filename="song.mp3"',
        "Content-Type": "application/mp3"
    });
    ytdl('https://www.youtube.com/watch?v=WkV0jnWbTFw').pipe(res);
});