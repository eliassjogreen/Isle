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

function applyOp(op, a, b) {
  function num(x) {
    if (typeof x != "number")
      throw new Error(`Expected number but got ${x}`);
    return x;
  }

  function div(x) {
    if (num(x) == 0)
      throw new Error(`Divide by zero`);
    return x;
  }

  switch (op) {
    // Arithmetic operators
    case "+" : return num(a) + num(b);
    case "-" : return num(a) - num(b);
    case "*"  : return num(a) * num(b);
    case "/"  : return num(a) / div(b);
    case "%"  : return num(a) % div(b);
    // Bitwise operators
    case "<<"  : return num(a) << num(b);
    case ">>"  : return num(a) >> num(b);
    case "&"  : return num(a) & num(b);
    case "|"  : return num(a) | num(b);
    case "^"  : return num(a) ^ num(b);
    // Boolean operators
    case "&&" : return a !== false && b;
    case "||" : return a !== false ? a : b;
    case "<"  : return num(a) < num(b);
    case ">"  : return num(a) > num(b);
    case "<=" : return num(a) <= num(b);
    case ">=" : return num(a) >= num(b);
    case "==" : return a === b;
    case "!=" : return a !== b;
  }
  throw new Error(`Can't apply operator ${op}`);
}

function evaluate(exp, env, callback) {
  switch (exp.type) {
  case "number":
  case "str":
  case "bool":
    callback(exp.value);
    return;

  case "var":
    callback(env.get(exp.value));
    return;

  case "assign":
    if (exp.left.type != "var")
      throw new Error("Cannot assign to " + JSON.stringify(exp.left));
    evaluate(exp.right, env, function(right) {
      callback(env.set(exp.left.value, right));
    });
    return;

    case "binary":
    evaluate(exp.left, env, function(left) {
      evaluate(exp.right, env, function(right) {
        callback(applyOp(exp.operator, left, right));
      });
    });
    return;

  case "if":
    evaluate(exp.cond, env, function(cond) {
      if (cond !== false) evaluate(exp.then, env, callback);
      else if (exp.else) evaluate(exp.else, env, callback);
      else callback(false);
    });
    return;

  case "prog":
    (function loop(last, i) {
      if (i < exp.prog.length) {
        evaluate(exp.prog[i], env, function(val) {
          loop(val, i+1);
        });
      } else {
        callback(last);
      }
    })(null, 0);
    return ;

  case "call":
    evaluate(exp.func, env, function(func) {
      (function loop(args, i) {
        if (i < exp.args.length) {
          evaluate(exp.args[i], env, function(v) {
            args[i + 1] = v;
            loop(args, i+1);
          });
      } else { func.apply(null, args); }
      })([ callback ], 0);
    });
    return;

  default:
    throw new Error("I don't know how to evaluate " + exp.type);
  }
}

module.exports = {
    evaluate : evaluate
};
