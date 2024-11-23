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
  setReqCur(form.reqId.value)
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
  const startHeaders = result.indexOf('headers') + 9;
  const startBody = result.indexOf('body');
  const resultHeaders = result.slice(startHeaders, startBody - 2)
  for (let el in JSON.parse(resultHeaders)) {
    resHeaders.innerHTML += el + ': ' + JSON.parse(resultHeaders)[el] + '<br />'
  }
  resBody.innerText = result.slice(startBody + 6);
  // const previewBody = document.getElementById('previewBody');
  // if (result.slice(startBody+6).includes('html')) 
  // previewBody.innerHTML = result.slice(startBody+6)
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

function clearForm(form) {
  form.reset();
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML = '';
}
