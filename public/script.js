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
  const newReq = await fetch('/saveReq', {
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
  const response = document.getElementById('response');
  response.innerHTML = '';
  const resbody = document.getElementById('resbody');
  resbody.innerHTML = '';
}


async function sendRequest(form) {
  const response = await fetch('/sendReq', {
    method: "POST",
    body: new FormData(form)
  })
  console.log(123, response)
  const res = document.getElementById('response');
  const resbody = document.getElementById('resbody');
  res.innerHTML = 'Status: ' + response.status + '<br />';
  res.innerHTML += 'Headers: ' + response.headers + '<br />';
  resbody.innerHTML += 'Body: ' + response.body;
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
