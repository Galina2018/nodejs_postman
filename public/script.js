getPage();

async function getReqs() {
  const response = await fetch('/getReqs', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  return await response.json();
}

function sendR(data, evt) {
  evt.preventDefault();
  console.log('in sendR', data);
}

function setReqCur(req) {
  console.log('req', req);
  const select = document.getElementById('select');
  select.value = req.method;
  const urlCur = document.getElementById('url');
  urlCur.value = req.url;
  let bodyFormatCur = document.getElementById('bodyReqFormat');
  bodyFormatCur = req.headers[0].value
    ? JSON.stringify(req.headers[0].value)
    : '';
  const bodyCur = document.getElementById('bodyReq');
  bodyCur.value = req.body ? JSON.stringify(req.body) : '';
}

async function sendRequest() {
  const select = document.getElementById('select').value;
  const url = document.getElementById('url').value;
  const bodyReqFormat = document.getElementById('bodyReqFormat').value;
  const bodyReq = document.getElementById('bodyReq').value;

  const r = await fetch('/sendReq', {
    method: 'POST',
    body: JSON.stringify({
      url: url,
      method: select,
      headers:
        select === 'POST'
          ? {
              'Content-Type': bodyReqFormat,
            }
          : {},
      body: select === 'POST' ? bodyReq : '',
    }),
  });
  console.log('rrrr', r);
  const bodyRes = {};
  const headersRes = new Map();
  // fetch('/sendReq', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     method: 'GET',
  //     url: 'https://jsonplaceholder.typicode.com/users/1',
  //   }),
  // }).then((response) => {
  //   console.log('response***', response.headers.entries());
  //   for (h of response.headers) {
  //     console.log(h[0], ':', h[1]);
  //     headersRes.set(h[0], h[1]);
  //   }
  //   console.log('headersRes***', headersRes);
  //   resultBody.innerText = JSON.stringify(response.body);
  // });

  const resultBody = document.getElementById('resultBody');
  resultBody.innerText = JSON.stringify(r.body);

  resultBody.innerText = setTimeout(() => {
    JSON.stringify(headersRes);
  }, 10000);
}

async function getPage() {
  const reqsArr = await getReqs();
  let reqs = document.getElementById('reqs');
  // let headers = document.getElementById('headers');
  const arr = await reqsArr;
  arr.forEach((req) => {
    if (req.id) {
      let req_ = JSON.stringify(req);
      reqs.innerHTML += `<button onclick='setReqCur(${req_})' id="${req.id}" class="ta-left w100">Метод: ${req.method}<br />${req.url}</button>`;
    }
  });

  // const form = document.getElementById('form');
  // form.addEventListener('submit', sendRequest);
  // async function sendRequest(evt) {
  //   evt.preventDefault();
  //   console.log('in sendR******************************************');
  //   await fetch('/sendReq', {
  //     method: 'POST',
  //     body: new FormData(form),
  //   });
  // }
}
