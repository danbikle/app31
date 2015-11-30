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
  path: '/table.csv?s=SQ'
};

callback = function(response) {
  var str = '';
  /* Hover debugger over response.
     I should see inside it. */
  response;

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log('response now on end.');
    console.log(str);
  });

}

http.request(options, callback).end();

console.log('ngetGSPC.js done for now.')
