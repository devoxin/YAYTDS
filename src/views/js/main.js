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
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        }
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    xhr.send(JSON.stringify(content));
  });
}

function readURL () {
  setTimeout(() => {
    const url = document.getElementById('urlBox').value;
    if (ytrx.test(url)) {
      readInfo(url);
    }
  }, 100);
}

async function readInfo (url) {
  document.getElementById('urlDiv').className = 'slideout';
  const res = JSON.parse(await post('/getVideo', { url }));
  const thumbs = res.player_response.videoDetails.thumbnail.thumbnails;
  const t = thumbs[thumbs.length - 1];
  const thumb = t ? t.url : res.thumbnail_url;
  
  const videoDiv = document.createElement('div');
  videoDiv.setAttribute('id', 'videoDiv');

  const text = document.createElement('h1');
  text.innerHTML = 'Video Found';

  videoDiv.appendChild(text);

  const videoInfo = document.createElement('div');
  videoInfo.id = 'videoInfo';

  const image = document.createElement('img');
  image.setAttribute('src', thumb);
  videoInfo.appendChild(image);

  const info = document.createElement('div');
  info.id = 'videoInfoText';

  const items = [
    `Title: ${res.title}`,
    `Average rating: ${parseFloat(res.avg_rating).toFixed(2)}/5`,
    `Views: ${res.view_count.toLocaleString()}`,
    `Length: ${parseTime(res.length_seconds)}`
  ];

  for (const item of items) {
    info.appendChild(document.createTextNode(item));
    info.appendChild(document.createElement('br'));
  }

  const authorStr = document.createElement('div');
  authorStr.appendChild(document.createTextNode('Uploaded by '));
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

}