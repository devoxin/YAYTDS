const ytdl = require('ytdl-core');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')();

const app = express();
const port = 42069;
const getVideo = multer.fields([{ name: 'url', maxCount: 1 }, { name: 'format', maxCount: 1 }]);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Web server listening on port ${port}.`);
});

app.use(express.static(`${__dirname}/views`));

app.post('/api/getInfo/', multer.single('url'), async (req, res) => {
  const info = await ytdl.getInfo(req.body.url).catch(() => null);

  if (!info) {
    return res.send('Video not available')
  } else {
    res.send(info);
  }
});

app.get('/api/download*', async (req, res) => {
  const url = req.query.url;
  const format = req.query.format || 'mp3';

  if (!url) return;

  const type = format === 'mp3' ? 'application/mp3' : 'video/mp4';
  const opts = format === 'mp3' ? { filter: 'audioonly' } : {};

  res.set({
    'Content-Disposition': `attachment; filename="song.${format}"`,
    'Content-Type': type
  });

  ytdl(url, opts).pipe(res);
});