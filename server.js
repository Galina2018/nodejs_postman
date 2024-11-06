const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const http = require('http');

const webserver = express();
const upload = multer();
const port = 7380;
// const resultFN = path.resolve(__dirname, 'result.json', 'utf8');

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.static(path.resolve(__dirname, 'public')));
webserver.use(bodyParser.text({}));
// webserver.use(bodyParser.json({}));

webserver.get('/', (req, res) => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  res.send(html);
});

webserver.post('/getReqs', (req, res) => {
  const reqs = fs.readFileSync(
    path.resolve(__dirname, './public', 'reqs.json'),
    'utf8'
  );
  res.send(reqs);
});

webserver.post('/', upload.none(), (req, res) => {
  let dataJson = fs.readFileSync(
    path.resolve(__dirname, './public', 'reqs.json'),
    'utf8'
  );
  console.log('dataJson', dataJson);
  let data = JSON.parse(dataJson);
  if (req.body && req.body.method && req.body.url) {
    req.body.id = Math.random();
    req.body.bodyReq = JSON.parse(req.body.bodyReq);

    data.push(req.body);
  }
  fs.writeFileSync(
    path.resolve(__dirname, './public', 'reqs.json'),
    JSON.stringify(data),
    'utf8'
  );
  res.redirect('/');
});

webserver.post('/sendReq', async (req, res) => {
  const body = JSON.parse(req.body);
  const response = await fetch(body.url, {
    method: body.method,
  });
  const resBody = await response.json();
  const resHeaders = new Map();
  for (const header of response.headers) {
    resHeaders.set(header[0], header[1]);
  }
  // res.send({
  //   status: response.status,
  //   headers: resHeaders,
  //   body: resBody,
  // });
  console.log(111);
  let result = '';
  res.on('data', (chunk) => {
    console.log(333);
    result += chunk; // chunk - это Buffer, но при склейке со строкой он автоматом преобразуется к строке
  });

  res.on('end', () => {
    // всё загружено
    console.log('loaded:', JSON.parse(result));
  });
  console.log(222);
  res.send({
    body: resBody,
  });
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
