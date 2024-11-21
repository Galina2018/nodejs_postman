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
  console.log('saveReqs()', reqs)
  await fetch('/saveReqs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqs)
  })
}

async function saveReq(form) {
  console.log('f', form)
  console.log('f id', form.reqId.value)
  const formData = new FormData(form);
  const newReq = await fetch('/saveReq', {
    method: "POST",
    body: formData
  },
  );
  setReqCur(form.reqId.value)
}

function sendR(data, evt) {
  evt.preventDefault();
  console.log('in sendR', data);
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
}


async function sendRequest(form) {
  form.action = '/sendReq';
  form.method = 'POST';
  console.log('form', form);
  form.submit();
}

function addHeader({reqId}) {
  console.log('reqId', reqId)
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML += `<input name='headerKey' /><input name='headerValue' /><button type="button" onclick='deleteHeader({reqId:${reqId}})'>Удалить</button><br />`;
}

async function deleteHeader({ reqId, headerType }) {

  console.log(9, reqId, headerType)
  const requests = await getReqs();
  const reqCurrentIndex = requests.findIndex((item) => item.id == reqId);

  if (reqCurrentIndex >= 0) {
    const reqCurrent = requests[reqCurrentIndex];
    delete reqCurrent.headers[headerType]
  }
    await saveReqs(requests);
    setReqCur(reqId)
}
