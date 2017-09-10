const fs = require('fs');
const input = require('./src/input.js');
const lexer =  require('./src/lexer.js');
const parser =  require('./src/parser.js');

var i = new input.stream('import("general"); if (true) { println("Hello world!"); }');
var ls = new lexer.stream(i);
var p = new parser.parse(ls);

console.log(JSON.stringify(p));
