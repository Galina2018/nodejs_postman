setReqCur(1)
async function getReqs() {
  const response = await fetch('/getReqs', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  return await response.json();
}

async function saveReqs(reqs) {
  await fetch('/saveReqs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqs)
  })
}

async function saveReq(form) {
  const formData = new FormData(form);
  await fetch('/saveReq', {
    method: "POST",
    body: formData
  },
  );
  form.submit();
}

async function setReqCur(reqId) {
  const requests = await getReqs();
  const reqItem = requests.find((item) => item.id == reqId);
  const reqIdTag = document.getElementById('reqId');
  reqIdTag.value = reqId;
  const select = document.getElementById('select');
  select.value = reqItem.method;
  const urlCur = document.getElementById('url');
  urlCur.value = reqItem.url;
  const bodyCur = document.getElementById('bodyReq');
  bodyCur.value = reqItem.body ? JSON.stringify(reqItem.body) : '';
  let paramsTag = document.getElementById('params');
  paramsTag.innerHTML = '';
  if (reqItem.headers) {
    Object.entries(reqItem.params).forEach(item => {
      paramsTag.innerHTML += `<input name="paramKey" value='${item[0]}' /><input name="paramValue" value='${item[1]}' /><button type='button' onclick='deleteParam({reqId:${reqId},paramKey:"${item[0]}"})'>Удалить</button><br />`;
    })
  }
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML = '';
  if (reqItem.headers) {
    Object.entries(reqItem.headers).forEach(item => {
      headersTag.innerHTML += `<input name="headerKey" value='${item[0]}' /><input name="headerValue" value='${item[1]}' /><button type='button' onclick='deleteHeader({reqId:${reqId},headerType:"${item[0]}"})'>Удалить</button><br />`;
    })
  }
  const resStatus = document.getElementById('resStatus');
  resStatus.innerHTML = '';
  const resHeaders = document.getElementById('resHeaders');
  resHeaders.innerHTML = '';
  const resbody = document.getElementById('resBody');
  resbody.innerHTML = '';
  const previewBody = document.getElementById('previewBody');
  previewBody.innerHTML = '';
}


async function sendRequest(form) {
  const response = await fetch('/sendReq', {
    method: "POST",
    body: new FormData(form)
  })
  const result = await response.text();
  const resStatus = document.getElementById('resStatus');
  const resHeaders = document.getElementById('resHeaders');
  const resBody = document.getElementById('resBody');
  resStatus.innerText = JSON.parse(result).status;
  const resultHeaders = JSON.parse(result).headers
  for (let el in resultHeaders) {
    resHeaders.innerHTML += el + ': ' + resultHeaders[el] + '<br />'
  }
  resBody.innerText = JSON.parse(result).body;
  const previewBody = document.getElementById('previewBody');
  const contentType = resultHeaders['content-type']
  if (contentType[0].includes('text/html')) {
    previewBody.innerHTML = JSON.parse(result).body;
  }
  if (contentType[0].includes('application/json')) {
    const bodyObj = JSON.parse(JSON.parse(result).body)
    previewBody.innerHTML = `<pre>${JSON.stringify(bodyObj, undefined, '\t')}</pre>`
  }
  if (contentType[0].includes('image/png')) {
    const urlImg = Object.fromEntries(new FormData(form).entries()).url
    previewBody.innerHTML = `<img src=${urlImg} />`
  }
}

function addHeader({ reqId }) {
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML += `<input name='headerKey' /><input name='headerValue' /><button type="button" onclick='deleteHeader({reqId:${reqId}})'>Удалить</button><br />`;
}

async function deleteHeader({ reqId, headerType }) {
  const requests = await getReqs();
  const reqCurrentIndex = requests.findIndex((item) => item.id == reqId);
  if (reqCurrentIndex >= 0) {
    const reqCurrent = requests[reqCurrentIndex];
    delete reqCurrent.headers[headerType]
  }
  await saveReqs(requests);
  setReqCur(reqId)
}

function addParam({ reqId }) {
  let headersTag = document.getElementById('params');
  headersTag.innerHTML += `<input name='paramKey' /><input name='paramValue' /><button type="button" onclick='deleteParam({reqId:${reqId}})'>Удалить</button><br />`;
}

async function deleteParam({ reqId, paramKey }) {
  const requests = await getReqs();
  const reqCurrentIndex = requests.findIndex((item) => item.id == reqId);
  if (reqCurrentIndex >= 0) {
    const reqCurrent = requests[reqCurrentIndex];
    delete reqCurrent.params[paramKey]
  }
  await saveReqs(requests);
  setReqCur(reqId)
}

function clearForm(form) {
  form.reset();
  let paramsTag = document.getElementById('params');
  paramsTag.innerHTML = '';
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML = '';
}
