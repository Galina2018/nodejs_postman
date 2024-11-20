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
  console.log('ffoorrmm', form)
  await fetch('/saveReq', {
    method: "POST",
    headers: {
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
  },
    body: new FormData(form)
  }, 
  )
}

function sendR(data, evt) {
  evt.preventDefault();
  console.log('in sendR', data);
}

async function setReqCur(reqId) {
  const requests = await getReqs();
  const reqItem = requests.find((item) => item.id === reqId);
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
  if (reqItem.headers && reqItem.headers.length) {
    const myHeaders = new Headers(reqItem.headers);
    myHeaders.forEach((value, key) => {
      headersTag.innerHTML += `<input id="headerKey" name="headerKey" value='${key}' /><input id="headerValue" name="headerValue" value='${value}' /><button type='button' onclick='deleteHeader({reqId:${reqId},type:"${key}"})'>Удалить</button><br />`;
    });
  }
}


async function sendRequest(form) {
  form.action = '/sendReq';
  form.method = 'POST';
  console.log('form', form);
  form.submit();
}

function addHeader() {
  let headersTag = document.getElementById('headers');
  headersTag.innerHTML += `<input name='headerType' /><input name='headerValue' /><button type="button" >Удалить</button><br />`;
}
async function deleteHeader({ reqId, type }) {
  const requests = await getReqs();
  const reqCurrentIndex = requests.findIndex((item) => item.id === reqId);
  if (reqCurrentIndex >= 0) {
    const reqCurrent = requests[reqCurrentIndex];
    const headerForDelIndex = reqCurrent.headers.findIndex(
      (e) => e[0].toLowerCase() == type
    );
    requests[reqCurrentIndex].headers.splice(headerForDelIndex, 1);
    console.log(200, requests);
    await saveReqs(requests);
    setReqCur(reqId)
  }
}
