const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const webserver = express();
const upload = multer();
const port = 7380;

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.get('/', (req, res) => {
  // console.log('get');
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  res.send(html);
});

webserver.get('/getReqs', (req, res) => {
  const reqs = fs.readFileSync(
    path.resolve(__dirname, './public', 'reqs.json'),
    'utf8'
  );
  res.send(reqs);
});

webserver.post('/sendReq', async (req, res) => {
  const body = req.body;
  console.log('body:', body);
  const response = await fetch(body.url, { method: body.method, 
  //   headers: {
  //   ContentType: 'text/html'
  // }
 });
  const html = await response
  console.log(html)
  res.setHeader('Content-Type','text/html')
  res.send(html)
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
