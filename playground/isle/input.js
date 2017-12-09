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


/**
 * stream (input.stream) - Takes a string and creates a input stream
 *
 * @param  {string} input - The code to be processed
 * @return {object} Returns all input stream functions
 */
function stream(input) {
    let pos = 0,
        line = 1,
        col = 0;

    /**
     * Returns all stream functions
     */
    return {
        next,
        peek,
        eof,
        croak
    };


    /**
     * next - Reads next character and changes variables pos, line and col
     *
     * @return {string} - Returns the next character
     */
    function next() {
        const ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0;
        else col++;
        return ch;
    }


    /**
     * peek - Reads the current character
     *
     * @return {string} - Returns current character
     */
    function peek() {
        return input.charAt(pos);
    }


    /**
     * eof - Returns true when we reached end of file (eof)
     *
     * @return {boolean} Returns true if we reached eof
     */
    function eof() {
        return peek() === "";
    }

    /**
     * croak - Throws error message with line and column info
     *
     * @param {string} msg - The error message
     */
    function croak(msg) {
        throw new Error(`(${line}:${col}) ${msg}`);
    }
}

module.exports = {
    stream: stream
};
