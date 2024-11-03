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
  const select = document.getElementById('select');
  select.options[select.selectedIndex].text = req.method
  const urlCur = document.getElementById('url');
  urlCur.value = req.url
  const bodyCur = document.getElementById('bodyReq')
  bodyCur.value = req.body ? JSON.stringify(req.body) :''
}

async function sendRequest(form) {  
  form.action = '/sendReq'
  form.method = 'post'
  console.log('form', form)
  form.submit();
// const r = await fetch('/sendReq',{method:'post'})
// console.log('rrrr', r)
}

async function getPage() {
  const reqsArr = await getReqs();
  console.log(222, reqsArr);
  let reqs = document.getElementById('reqs');
  // let headers = document.getElementById('headers');
  const arr = await reqsArr;
  arr.forEach((req) => {
    if (req.id) {
      let req_ = JSON.stringify(req)
      reqs.innerHTML += `<button onclick='setReqCur(${req_})' id="${req.id}" class="ta-left w100">Метод: ${req.method}<br />${
        req.url
      }</button>`;
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
