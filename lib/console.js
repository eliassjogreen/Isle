this.functions = function() {
    return {
        print: function(callback, ...text) {
            text = text.toString().replace(/\,/g, '');
            process.stdout.write(text);
            callback(text);
        },
        println: function(callback, ...text) {
            text = text.toString().replace(/\,/g, '');
            process.stdout.write(text + "\n");
            callback(text);
        },
        readkey
    }
}
