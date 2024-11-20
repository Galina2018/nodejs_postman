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

webserver.use(express.urlencoded({extended:true}));
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
  console.log('body saveReq',req.body)
  res.send('ok')
})

webserver.post('/saveReqs', (req,res) => {
  console.log('body',req.body)
  fs.writeFileSync(path.resolve(__dirname, './public', 'reqs.json'),JSON.stringify(req.body), 'utf8')
  // res.setHeader("Content-Type", 'application/json');
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

webserver.post('/sendReq', async (req, res) => {
  const body = req.body;
  const response = await fetch(`${body.url}`, {
    method: `${body.method}`,
  });

  res.send({
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  });
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
