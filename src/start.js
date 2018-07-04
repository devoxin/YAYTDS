const ytdl = require('ytdl-core');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')();

const app = express();
const port = 42069;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Web server listening on port ${port}.`);
});

app.use(express.static(`${__dirname}/views`));

app.post('/getVideo', multer.single('url'), async (req, res) => {
  const info = await ytdl.getInfo(req.body.url).catch(() => null);

  if (!info) {
    return res.send('Video not available')
  } else {
    res.send(info);
  }
});

app.get('/download*', async (req, res) => {
  const url = req.query.url;

  if (!url) return;

  res.set({
    'Content-Disposition': `attachment; filename="song.opus"`,
    'Content-Type': "audio/ogg"
  });

  ytdl(url, opts).pipe(res);
});