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
    info.appendChild(document.createElement('br'));
    info.appendChild(document.createTextNode(item));
  }

  info.appendChild(document.createElement('br'));
  const authorStr = document.createElement('div');
  authorStr.appendChild(document.createTextNode('Uploaded by '));
  const hyper = document.createElement('a');
  hyper.appendChild(document.createTextNode(res.author.name));
  hyper.setAttribute('href', res.author.channel_url);
  authorStr.appendChild(hyper);
  info.appendChild(authorStr);





  /*for (const key of Object.keys(res)) {
    if (['short_view_count_text', 'length_seconds', 'title', 'avg_rating'].includes(key)) {
      info.appendChild(document.createElement('br'));
      info.appendChild(document.createTextNode(`${key}: ${res[key]}`));
    }
  }*/
  videoInfo.appendChild(info);

  videoDiv.appendChild(videoInfo);
  videoDiv.className = 'fadein';
  document.body.appendChild(videoDiv);
}

/*
  const loadingMessage = document.createElement('div');
  loadingMessage.style.display = 'inline-block';

  const text = document.createElement('span');

  const spinnerWrapper = document.createElement('div');
  const doubleSpinner1 = document.createElement('div');
  const doubleSpinner2 = document.createElement('div');

  text.innerHTML = 'Loading...';
  text.style.fontSize = '150%';
  text.style.lineHeight = '50px';
  loadingMessage.className = 'fadein';

  text.setAttribute('class', 'inner');
  spinnerWrapper.setAttribute('class', 'spinner inner');
  doubleSpinner1.setAttribute('class', 'double-bounce1');
  doubleSpinner2.setAttribute('class', 'double-bounce2');

  spinnerWrapper.appendChild(doubleSpinner1);
  spinnerWrapper.appendChild(doubleSpinner2);

  loadingMessage.appendChild(spinnerWrapper);
  loadingMessage.appendChild(text);
  setTimeout(() => {
    document.body.appendChild(loadingMessage);
    const res = await postShit('/api/getInfo', { url });
    loadingMessage.parentNode.removeChild(loadingMessage);
    console.log(res);
  }, 200);
*/