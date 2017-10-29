
// TODO isle.js with cross browser compatability and stuff. Kill me alredy
const isle = require('./src/isle.js');

let interpreter = new isle();

console.log(isle.interpret('"Hello world!"'));
