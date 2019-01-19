const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');

const cors = require('cors');

const root = './';

console.log('args---', process.argv);

const app = express();

function initializeExpress() {

  var port =  getPort();//process.env.PORT || '3001'; //process.argv[0] ||
  if (!port) {
    port = '3001';
    console.log('using default port ' + port);
  }

  app.use(cors());
  app.options('*', cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(root, 'client')));
  app.use('/api', routes);
  app.get('*', (req, res) => {
    res.sendFile('./client/index.html', {root});
  });

  app.listen(port, () => console.log(`API running on localhost:${port}`));
}

function getPort() {
  var port = process.env.PORT;
  process.argv.forEach(a => {
    if (a.startsWith('port')) {
      let l  = a.split(':')[1];
      if ( l && !isNaN(l)) {
        port = l;
        console.log('got port from argument ' + port);
      }
    }
  });
  return port;
}

initializeExpress();