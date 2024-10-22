const express = require('express');
const path = require('path');
const fs = require('fs')

const webserver = express();
const port = 7380;
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.get('/', (req,res) => {
  console.log('get');
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8')
  res.send(html)
})
webserver.post('/sendReq', (req, res) => {
  const url = req.url;
  console.log('url', url);
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
