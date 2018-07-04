const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');

function parseTime (s) {
  if (isNaN(s)) {
    s = parseInt(s);
  }
  return `${parseInt(s / 60)}:${parseInt(s % 60)}`;
}

function post (url, content) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200)
        resolve(xhr.responseText);
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(JSON.stringify(content));
  });
}

async function readURL () {
  await sleep(100);
  const url = document.getElementById('urlBox').value;
  if (ytrx.test(url)) {
    readInfo(url);
  }
}

async function readInfo (url) {
  document.getElementById('urlDiv').remove();
  const res = JSON.parse(await post('/getVideo', { url }));
  const thumbs = res.player_response.videoDetails.thumbnail.thumbnails;
  const t = thumbs[thumbs.length - 1];
  const thumb = t ? t.url : res.thumbnail_url;
  
  const videoDiv = document.createElement('div');
  videoDiv.setAttribute('id', 'videoDiv');

  const text = document.createElement('h1');
  text.setAttribute('class', 'videoTitle')
  text.innerHTML = res.title;

  videoDiv.appendChild(text);

  const videoInfo = document.createElement('div');
  videoInfo.id = 'videoInfo';

  const info = document.createElement('div');
  info.id = 'videoInfoText';

  const items = [
    `Average rating: ${parseFloat(res.avg_rating).toFixed(2)}/5`,
    `Views: ${res.view_count.toLocaleString()}`,
    `Length: ${parseTime(res.length_seconds)}`
  ];

  for (const item of items) {
    info.appendChild(document.createTextNode(item));
    info.appendChild(document.createElement('br'));
  }

  const authorStr = document.createElement('div');
  authorStr.appendChild(document.createTextNode('Uploader: '));
  const hyper = document.createElement('a');
  hyper.appendChild(document.createTextNode(res.author.name));
  hyper.setAttribute('href', res.author.channel_url);
  authorStr.appendChild(hyper);
  info.appendChild(authorStr);


  const downloadBtn = document.createElement('button');
  downloadBtn.setAttribute('type', 'button');
  downloadBtn.setAttribute('class', 'btn btn-primary');
  downloadBtn.innerHTML = 'Click to download';
  downloadBtn.onclick = async () => window.location.href = `/download?url=${url}`;

  const downloadBtns = document.createElement('div');
  const formatPickBtns = document.createElement('div');

  formatPickBtns.setAttribute('class', 'btn-group');
  formatPickBtns.setAttribute('data-toggle', 'buttons');

  downloadBtns.appendChild(formatPickBtns);
  downloadBtns.appendChild(document.createElement('br'));
  downloadBtns.id = 'downloadInfo'
  downloadBtns.appendChild(downloadBtn);

  videoInfo.appendChild(info);  
  videoInfo.appendChild(downloadBtns);
  videoDiv.appendChild(videoInfo);
  videoDiv.className = 'fadein';
  document.body.appendChild(videoDiv);

  const cover = document.getElementById('cover');
  cover.style.backgroundImage = `url('${thumb}')`;
  for (let i = 0; i < 1; i += 0.1) {
    cover.style.opacity = i;
    await sleep(25);
  }

}

function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
