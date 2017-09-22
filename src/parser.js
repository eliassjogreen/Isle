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
      "*": 11, "/": 11, "%": 11
    };
    
    var FALSE = { type: "bool", value: false };
    var TRUE = { type: "bool", value: true };

    return parseToplevel();

    function isPunc(ch) {
      var tok = input.peek();
      return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }

    function isKw(kw) {
      var tok = input.peek();
      return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }

    function isOp(op) {
      var tok = input.peek();
      return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }

    function skipPunc(ch) {
      if (isPunc(ch)) input.next();
      else input.croak("Expected punctuation: \"" + ch + "\"");
    }

    function skipKw(kw) {
      if (isKw(kw)) input.next();
      else input.croak("Expected keyword: \"" + kw + "\"");
    }

    function skipOp(op) {
      if (isOp(op)) input.next();
      else input.croak("Expected operator: \"" + op + "\"");
    }

    function unexpected() {
      input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }

    function parseVarname() {
      var name = input.next();
      if (name.type != "var") input.croak("Expected variable name");
      return name.value;
    }

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

    function parseBool() {
      return {
        type: "bool",
        value: input.next().value == "true"
      };
    }

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

    function parseFunction() {
    skipKw("function");
      return {
        type: "func",
        name: parseVarname(),
        params: delimited("(", ")", ",", parseVarname),
        body: parseProg()
      };
    }

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
        if (tok.type == "var" || tok.type == "number" || tok.type == "str")
          return tok;
        unexpected();
      });
    }

    function parseProg() {
      var prog = delimited("{", "}", ";", parseExpression);
      if (prog.length == 0) return FALSE;
      if (prog.length == 1) return prog[0];
      return { type: "prog", prog: prog };
    }

    function parseExpression() {
      return maybeCall(function() {
        return maybeBinary(parseAtom(), 0);
      });
    }

    function maybeCall(expr) {
      expr = expr();
      return isPunc("(") ? parseCall(expr) : expr;
    }

    function maybeBinary(left, myPrec) {
      var tok = isOp();
      if (tok) {
        var hisPrec = PRECEDENCE[tok.value];
        if (hisPrec > myPrec) {
          input.next();
          var right = maybeBinary(parseAtom(), hisPrec);
          var binary = {
            type     : tok.value == "=" ? "assign" : "binary",
            operator : tok.value,
            left     : left,
            right    : right
          };
          return maybeBinary(binary, myPrec);
        }
      }
      return left;
    }

    function parseCall(func) {
      return {
        type: "call",
        func: func,
        args: delimited("(", ")", ",", parseExpression)
      };
    }

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
    stream: stream
};
