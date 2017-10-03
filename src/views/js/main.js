const ytrx = new RegExp("(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)");

function postShit (url, content) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');    
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        }
      }
    };
    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };
    xhr.send(JSON.stringify(content));
  })
}

function readURL () {
  setTimeout(() => {
    const url = document.getElementById('urlBox').value;
    if (ytrx.test(url)) {
      readInfo(url);
    }
  }, 100)
}

async function readInfo (url) {
  const res = await postShit('/api/getInfo', { url });
}