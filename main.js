const fs = require('fs');
const env = require('./src/env.js');
const input = require('./src/input.js');
const lexer =  require('./src/lexer.js');
const parser =  require('./src/parser.js');
const eval = require('./src/eval.js');
const Import = require('./src/import.js');

let code;

if (process.argv[0] === 'isle') {
    code = fs.readFileSync(process.argv[1], 'utf8');
} else {
    code = fs.readFileSync(process.argv[2], 'utf8');
}

//for (var i = 0; i < process.argv.length; i++) {
//    console.log(i + ': ' + process.argv[i]);
//}

code = code.toString();

//console.log(code);

let environment = new env.environment();
let lexerStream = new lexer.stream(new input.stream(code));

environment.def('import', function (callback, ...libs) {
    let success = true;
    let defaultDir = "C:\\Users\\Elias\\Desktop\\kod\\Isle\\Github\\lib";
    try {
        for (let i = 0; i < libs.length; i++) {
            Import.importLib(environment, libs[i], defaultDir);
        }
    } catch (e) {
        success = false;
    }

    callback(success);
});

//while (!lexerStream.eof()) {
//    console.log(lexerStream.next());
//}

let ast = new parser.parse(lexerStream);

console.log(JSON.stringify(ast));

eval.evaluate(ast, environment, function (result) {
    //console.log(result);
});
