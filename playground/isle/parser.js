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
 * parse (parser.parse) - The parser
 *
 * @param  {object} input - Takes lexer stream as input
 * @return {Function} Returns function parseToplevel
 */
function parse(input) {
    var PRECEDENCE = {
      "=": 1,
      "||": 2,
      "&&": 3,
      "|": 4,
      "^": 5,
      "&": 6,
      "==": 7, "!=": 7,
      "<": 8, ">": 8, "<=": 8, ">=": 8,
      "<<": 9, ">>": 9,
      "+": 10, "-": 10,
      "*": 11, "/": 11, "%": 11,
      "**": 12, 
    };

    var FALSE = { type: "bool", value: false };
    var TRUE = { type: "bool", value: true };

    return parseToplevel();

    /**
     * isPunc - Is punctuation
     *
     * @param  {string} ch - The character to check if peek is punctuation
     * @return {boolean} Returns the true if param ch is punc
     */
    function isPunc(ch) {
      var tok = input.peek();
      return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }

    /**
     * isKw - Is keyword
     *
     * @param  {string} kw - The string to check if peek is keyword
     * @return {boolean} Returns true if param kw is keyword
     */
    function isKw(kw) {
      var tok = input.peek();
      return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }

    /**
     * isOp - Is operator
     *
     * @param  {string} op - The string to check if peek is operator
     * @return {boolean} Returns thrue if param op is operator
     */
    function isOp(op) {
      var tok = input.peek();
      return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }

    /**
     * skipPunc - Skips punctuation
     *
     * @param  {string} ch - The punctuation to be skipped
     */
    function skipPunc(ch) {
      if (isPunc(ch)) input.next();
      else input.croak("Expected punctuation: \"" + ch + "\"");
    }

    /**
     * skipKw - Skips keyword
     *
     * @param  {string} kw - The keyword to be skipped
     */
    function skipKw(kw) {
      if (isKw(kw)) input.next();
      else input.croak("Expected keyword: \"" + kw + "\"");
    }

    /**
     * skipOp - Skips operator
     *
     * @param  {string} op - The operator to be skipped
     */
    function skipOp(op) {
      if (isOp(op)) input.next();
      else input.croak("Expected operator: \"" + op + "\"");
    }

    /**
     * unexpected - Croaks a unexpected token error
     */
    function unexpected() {
      input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }


    /**
     * parseVarname - Parses variable name
     *
     * @return {string} - The variables name
     */
    function parseVarname() {
      var name = input.next();
      if (name.type != "var") input.croak("Expected variable name");
      return name.value;
    }

    /**
     * delimited - Reads delimited
     *
     * @param  {string}   start     - The start of delimited
     * @param  {string}   stop      - The end of delimited
     * @param  {string}   separator - What separates the items
     * @param  {Function} parser    - The parser of the delimited items
     * @return {Array.<Object>} An array of the delimited objects
     */
    function delimited(start, stop, separator, parser) {
      var a = [], first = true;
      skipPunc(start);
      while (!input.eof()) {
        if (isPunc(stop)) break;
        if (first) { first = false; } else { skipPunc(separator); }
        if (isPunc(stop)) break;
        a.push(parser());
      }
      skipPunc(stop);
      return a;
    }


    /**
     * parseBool - Parses boolean values
     *
     * @return {object} Returns a bool node
     */
    function parseBool() {
      return {
        type: "bool",
        value: input.next().value == "true"
      };
    }


    /**
     * parseIf - Parses if statements
     *
     * @return {object} Returns a if statement action tree node
     */
    function parseIf() {
      skipKw("if");
      var cond = parseExpression();
      var then = parseExpression();
      var ret = { type: "if", cond: cond, then: then };
      if (isKw("else")) {
        input.next();
        ret.else = parseExpression();
      }
      return ret;
    }

    /**
     * parseFunction - Parses functions
     *
     * @return {object} Returns a function action tree node
     */
    function parseFunction() {
    skipKw("function");
      return {
        type: "func",
        name: parseVarname(),
        params: delimited("(", ")", ",", parseVarname),
        body: parseProg()
      };
    }

    /**
     * parseAtom - does the main dispatching job, depending on the current token
     *
     * @return {object} Returns action tree nodes
     */
    function parseAtom() {
      return maybeCall(function() {
        if (isPunc("(")) {
          input.next();
          var exp = parseExpression();
          skipPunc(")");
          return exp;
        }

        if (isPunc("{")) return parseProg();
        if (isKw("function")) return parseFunction();
        if (isKw("if")) return parseIf();
        if (isKw("true") || isKw("false")) return parseBool();
        var tok = input.next();
        if (tok.type == "var" || tok.type == "num" || tok.type == "str")
          return tok;
        unexpected();
      });
    }

    /**
     * parseProg - Parses programs
     *
     * @return {object} Returns a action tree node for programs
     */
    function parseProg() {
      var prog = delimited("{", "}", ";", parseExpression);
      if (prog.length == 0) return FALSE;
      if (prog.length == 1) return prog[0];
      return { type: "prog", prog: prog };
    }

    /**
     * parseExpression - Parses expressions
     *
     * @return {function} Return function maybeCall
     */
    function parseExpression() {
      return maybeCall(function() {
        return maybeBinary(parseAtom(), 0);
      });
    }

    /**
     * maybeCall - Checks if expressions is a call
     *
     * @param  {Function} expr - The expression to be tested
     * @return {Function} Returns either parsecall(expression) or the expression depending on if it is a call
     */
    function maybeCall(expr) {
      expr = expr();
      return isPunc("(") ? parseCall(expr) : expr;
    }

    /**
     * maybeBinary - Checks if binary and parses
     *
     * @param  {object} left - The left value
     * @param  {object} myPrec - My precedence
     * @return {object} Returns action tree node
     */
    function maybeBinary(left, myPrec) {
      var tok = isOp();
      if (tok) {
        var hisPrec = PRECEDENCE[tok.value];
        if (hisPrec > myPrec) {
          input.next();
          var right = maybeBinary(parseAtom(), hisPrec);
          var binary = {
            type     : tok.value === "=" ? "assign" : "binary",
            operator : tok.value,
            left     : left,
            right    : right
          };
          return maybeBinary(binary, myPrec);
        }
      }
      return left;
    }

    /**
     * parseCall - Parses calls
     *
     * @param  {Function} func - The function to be used for the call
     * @return {object} Returns action tree node for the call
     */
    function parseCall(func) {
      return {
        type: "call",
        func: func,
        args: delimited("(", ")", ",", parseExpression)
      };
    }

    /**
     * parseToplevel - The function that parses the whole program is probably the simplest
     *
     * @return {object} Returns a program action tree node
     */
    function parseToplevel() {
      var prog = [];
      while (!input.eof()) {
        prog.push(parseExpression());
        if (!input.eof()) skipPunc(";");
      }
      return { type: "prog", prog: prog };
    }
}

module.exports = {
    parse: parse
};
