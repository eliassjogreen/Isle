```
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
```

# *Isle* Programming Language 🏝️


## Usage

TODO



## Examples

#### Hello world example:

```
import ("console");

console.println("hello world!");

# Prints "hello world!"
```

#### Fibonacci example:

```
import ("console");

function fibonacci(n) {
	if (n < 2){
		return 1;
	} else {
		return fibonacci(n-2) + fibonacci(n-1);
	}
}

console.println(fibonacci(7));

# Prints 21
```



## Helpful resources

#### Links

* [Language study](http://rigaux.org/language-study/)
    * [Syntax across languages](http://rigaux.org/language-study/syntax-across-languages/)
* [Lisperator.net](http://lisperator.net/)
    * [λanguage](http://lisperator.net/pltut/) (What *Isle* is based on)
