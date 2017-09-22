const fs = require('fs');
const env = require('./src/env.js');
const input = require('./src/input.js');
const lexer =  require('./src/lexer.js');
const parser =  require('./src/parser.js');
const eval = require('./src/eval.js');

var environment = new env.environment();
var lexerStream = new lexer.stream(new input.stream('if (true) { x = "hello world!"; x; }'));
var ast = new parser.stream(lexerStream);

eval.evaluate(ast, environment, function (result) {
    console.log(result);
});
