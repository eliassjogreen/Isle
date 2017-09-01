const fs = require('fs');
const input = require('./src/input.js');
const lexer =  require('./src/lexer.js');

var i = new input.stream('import("general"); if (true) { println("Hello world!"); }');
var ls = new lexer.stream(i);
while (!ls.eof()) {
    console.log(ls.next());
}
