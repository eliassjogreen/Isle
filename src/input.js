/*
         ___
        /. _\
.--.|/_/__
  ''.--o/___  \
/.'o|_o  '.|
  |/   |_|   '
  '    |_|
         |_|
      __.|_|.__
     /   |_|   ``""-..__
    .    |_| (¯)__|¯|___'-._
    |   ´"'"`|¯(_-< / -_)   \
    \        |_/__/_\___|   |
     '-.__.--._          .-'
               `--...--'`
*/

"use strict";

function stream(input) {
    let pos = 0,
        line = 1,
        col = 0;

    return {
        next,
        peek,
        eof,
        croak
    };

    function next() {
        const ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0;
        else col++;
        return ch;
    }

    function peek() {
        return input.charAt(pos);
    }

    function eof() {
        return peek() == "";
    }

    function croak(msg) {
        throw (`${msg} (${line}:${col})`);
    }
}

module.exports = {
    stream: stream
};
