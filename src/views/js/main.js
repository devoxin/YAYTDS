const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');

function parseTime (s) {
  if (isNaN(s)) {
    s = parseInt(s);
  }
  return `${parseInt(s / 60)}:${parseInt(s % 60)}`;
}

function postShit (url, content) {
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
  let res = await postShit('/api/getInfo', { url });
  res = JSON.parse(res);


  const videoDiv = document.createElement('div');
  videoDiv.setAttribute('id', 'videoDiv');

  const text = document.createElement('h1');
  text.innerHTML = 'Video Found';

  videoDiv.appendChild(text);

  const videoInfo = document.createElement('div');
  videoInfo.id = 'videoInfo';

  const image = document.createElement('img');
  image.setAttribute('src', res.iurlmaxres);
  videoInfo.appendChild(image);

  const info = document.createElement('div');
  info.id = 'videoInfoText';

  const items = [
    `Title: ${res.title}`,
    `Average rating: ${parseFloat(res.avg_rating).toFixed(2)}/5`,
    `Views: ${res.short_view_count_text}`,
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
  downloadBtn.onclick = () => {
    const selectedFormat = document.querySelector('.btn-group > .active');
    if (!selectedFormat) {
      return alert('You haven\'t picked a format.');
    }

    alert(`Downloading ${selectedFormat.innerHTML.slice(0, 3)} [placeholder]`);
  }



  const downloadBtns = document.createElement('div');
  const formatPickBtns = document.createElement('div');

  formatPickBtns.setAttribute('class', 'btn-group');
  formatPickBtns.setAttribute('data-toggle', 'buttons');

  const formats = ['mp3', 'mp4'];
  for (const format of formats) {
    const label = document.createElement('label');
    label.setAttribute('class', 'btn btn-primary');
    const innerInput = document.createElement('input');
    label.appendChild(document.createTextNode(format));
    innerInput.setAttribute('type', 'radio');
    innerInput.setAttribute('name', 'options');
    innerInput.setAttribute('id', `option${formats.indexOf(format) + 1}`);
    innerInput.setAttribute('autocomplete', 'off');
    label.appendChild(innerInput);
    formatPickBtns.appendChild(label);
  }

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