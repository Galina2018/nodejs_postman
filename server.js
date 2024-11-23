const express = require('express');
const exphbs = require('express-handlebars');
const fetch = require('isomorphic-fetch');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const multer = require('multer');
const { randomUUID } = require('crypto');

const webserver = express();

webserver.engine('handlebars', exphbs());
webserver.set('view engine', 'handlebars');
webserver.set('views', path.join(__dirname, 'views'));

const upload = multer();
const port = 7380;

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.json());
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.get('/', async (req, res) => {
  const reqs = await fsp.readFile(
    path.resolve(__dirname, './public', 'reqs.json'),
    'utf8'
  );
  res.render('requests', {
    layout: 'base_layout',
    requests: JSON.parse(reqs),
  });
});

// webserver.get('/:id', (req, res) => {
//   console.log('id', req.params)
// })

webserver.post('/getReqs', (req, res) => {
  const reqs = fs.readFileSync(
    path.resolve(__dirname, './public', 'reqs.json'),
    'utf8'
  );
  res.send(reqs);
});

webserver.post('/saveReq', upload.none(), (req, res) => {
  req.body.headers = {}
  if (req.body.headerKey && req.body.headerValue) {
    if (Array.isArray(req.body.headerKey) && Array.isArray(req.body.headerValue)) {
      req.body.headerKey.forEach((el, idx) => {
        req.body.headers[el] = req.body.headerValue[idx]
      });
    } else req.body.headers[req.body.headerKey] = req.body.headerValue
  }
  delete req.body.headerKey
  delete req.body.headerValue
  const reqs = fs.readFileSync(path.resolve(__dirname, './public', 'reqs.json'), 'utf8')
  let reqsArr = JSON.parse(reqs);
  const reqCurrentIndex = reqsArr.findIndex(e => e.id == req.body.reqId)
  req.body.id = req.body.reqId;
  delete req.body.reqId
  reqsArr.splice(reqCurrentIndex, 1, req.body);
  fs.writeFileSync(path.resolve(__dirname, './public', 'reqs.json'), JSON.stringify(reqsArr), 'utf8')
  res.send('ok')
})

webserver.post('/saveReqs', (req, res) => {
  fs.writeFileSync(path.resolve(__dirname, './public', 'reqs.json'), JSON.stringify(req.body), 'utf8')
  res.send('');
})

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

webserver.post('/sendReq', upload.none(), async (req, res) => {
  const body = req.body;
  const response = await fetch(`${body.url}`, {
    method: `${body.method}`,
  });
  res.send({
    status: response.status,
    headers: response.headers.raw(),
    body: await response.text(),
  });
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
