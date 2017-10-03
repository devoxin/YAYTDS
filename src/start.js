const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')();
const port = 42069;
const ytdl = require('ytdl-core')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Web server listening on port ${port}.`);
});

app.use(express.static(`${__dirname}/views`));

app.post('/api/getInfo/', multer.array(), async (req, res) => {
    res.send(await ytdl.getInfo(req.body.url));
});

app.post('/api/getContent/', async (req, res) => {
    res.set({
        'Content-Disposition': 'attachment; filename="song.mp3"',
        'Content-Type': 'application/mp3'
    });
    ytdl('https://www.youtube.com/watch?v=WkV0jnWbTFw').pipe(res);
});