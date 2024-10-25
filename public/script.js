getPage();

function test() {
  console.log('in test');
}
async function getReqs() {
  const response = await fetch('/getReqs', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  return await response.json();
}

async function getPage() {
  const reqsArr = await getReqs();
  console.log(222, reqsArr);
  let reqs = document.getElementById('reqs');
  let headers = document.getElementById('headers');

  reqsArr.forEach((e) => {
    if (e.id) {
      reqs.innerHTML += `<div><button onclick="test()" class="ta-left w100">Метод: ${e.method}<br />${e.url}</button></div>`;
    }
  });
  
  // const form = document.getElementById('form');
  // form.addEventListener('submit', sendRequest);
  // async function sendRequest(evt) {
  //   evt.preventDefault();
  //   await fetch('/sendReq', {
  //     method: 'POST',
  //     body: new FormData(form),
  //   });
  // }
}
