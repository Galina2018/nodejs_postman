getReqs();

function test() {
  console.log('in test');
}

function getReqs() {
  const reqsArr = [
    {
      id: 0,
      method: '',
      url: '',
      headers: [
        {
          type: '',
          value: '',
        },
      ],
    },
    {
      id: 1,
      method: 'GET',
      url: 'http1',
      headers: [
        {
          type: 'Accept',
          value: '*/*',
        },
      ],
    },
    {
      id: 2,
      method: 'POST',
      url: 'http2',
      headers: [
        {
          type: 'Content-type',
          value: 'application/json',
        },
      ],
    },
  ];

  let reqs = document.getElementById('reqs');
  let headers = document.getElementById('headers');
  reqsArr.forEach((e) => {
    if (e.id) {
      reqs.innerHTML += `<div><button onclick="test()" class="ta-left w100">Метод: ${e.method}<br />${e.url}</button></div>`;
    }
  });

  const form = document.getElementById('form');
  form.addEventListener('submit', sendRequest);
  async function sendRequest() {
    await fetch('/sendReq', {
      method: post,
    });
  }
}
