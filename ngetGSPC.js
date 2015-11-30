/* ngetGSPC.js
   This script should GET 
   http://ichart.finance.yahoo.com/table.csv?s=%5EGSPC
   and write it to GSPC.csv
   Demo:
   node ngetGSPC.js
   head GSPC.csv
*/

var http = require('http');
var fs   = require('fs');

var options = {
  host: 'ichart.finance.yahoo.com',
  // path: '/table.csv?s=%5EGSPC'
  path: '/table.csv?s=SQ'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    fs.writeFile('GSPC.csv', str);
  });

}

http.request(options, callback).end();

console.log('ngetGSPC.js done for now.')
