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

async function setReqCur(reqId) {
  const requests = await getReqs();
  const reqItem = requests.find(item => item.id === reqId)
  const select = document.getElementById('select');
  select.value = reqItem.method
  const urlCur = document.getElementById('url');
  urlCur.value = reqItem.url
  const bodyCur = document.getElementById('bodyReq')
  bodyCur.value = reqItem.body ? JSON.stringify(reqItem.body) : ''
}

async function sendRequest(form) {  
  form.action = '/sendReq'
  form.method = 'POST'
  console.log('form', form)
  form.submit();
}

async function getPage() {
  // let reqs = document.getElementById('reqs');
  // const arr = await reqsArr;
  // arr.forEach((req) => {
  //   if (req.id) {
  //     let req_ = JSON.stringify(req)
  //     reqs.innerHTML += `<button onclick='setReqCur(${req_})' id="${req.id}" class="ta-left w100">Метод: ${req.method}<br />${
  //       req.url
  //     }</button>`;
  //   }
  // });

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
