// ngetGSPC.js

var http = require('http');

http;

/*
I should GET this URL:
http://ichart.finance.yahoo.com/table.csv?s=%5EGSPC
*/
var options = {
  host: 'ichart.finance.yahoo.com',
  // path: '/table.csv?s=%5EGSPC'
  path: '/table.csv?s=FB'
};

callback = function(response) {
  var str = '';
  /* Hover debugger over response.
     I should see inside it. */
  response;
  
  response.on('end', function () {
    console.log('response now on end.');
  });

}

http.request(options, callback).end();

console.log('ngetGSPC.js done for now.')
