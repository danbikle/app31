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

console.log('ngetGSPC.js done for now.')
