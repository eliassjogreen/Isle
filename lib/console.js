this.functions = function() {
    return {
        "console.print": function(callback, ...text) {
            text = text.toString().replace(/\,/g, '');
            process.stdout.write(text);
            callback(text);
        },
        "console.println": function(callback, ...text) {
            text = text.toString().replace(/\,/g, '');
            process.stdout.write(text + "\n");
            callback(text);
        },
    }
}
