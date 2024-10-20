getReqs();
function test() {
    console.log('in test')
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
          type: 'Accpept',
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
      reqs.innerHTML += `<td><button onclick="test()" style="text-align:left">Метод: ${e.method}<br /></div>${e.url}</button></td>`;
    }
  });
  
}
