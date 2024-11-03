const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { randomUUID } = require('crypto');

const webserver = express();
const upload = multer();
const port = 7380;
// const resultFN = path.resolve(__dirname, 'result.json', 'utf8');

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.static(path.resolve(__dirname, 'public')));

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
  let data = JSON.parse(dataJson);
  if (req.body && req.body.method && req.body.url) {
    req.body.id = randomUUID();
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
  const body = req.body;
  const response = await fetch(`${body.url}`, {
    method: `${body.method}`,
  });

  // fs.writeFileSync(resultFN, result);

  res.send({
    status: response.status,
    headers:  response.headers,
    body: await response.text(),
  });
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
