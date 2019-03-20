# Salticidae

**Requires Node v8.2.1 or greater.**

> The jumping spider family (Salticidae) contains over 500 described genera and more than 5800 described species, making it the largest family of spiders with about 13% of all species. Jumping spiders have some of the best vision among arthropods and use it in courtship, hunting, and navigation. Although they normally move unobtrusively and fairly slowly, most species are capable of very agile jumps, notably when hunting, but sometimes in response to sudden threats or crossing long gaps. *~ from [Wikipedia](https://en.wikipedia.org/wiki/Jumping_spider)*

This is a set of utilities to simplify common local scripting tasks. As the library originated as a utility for spidering specific content from a webpage, it is named after the jumping spider family — because spiders are terrifying, doubly so if they can attack at range.

[![Build Status](https://travis-ci.org/kadamwhite/salticidae.svg?branch=master)](https://travis-ci.org/kadamwhite/salticidae)

## Modules

### `spider`

Given a URL, download the URL's HTML and return an object of data extracted from the page content using a series of [Cheerio](https://github.com/cheeriojs/cheerio) selectors.

**Please Note:** The `spider` module has a peer dependency on [axios](https://github.com/axios/axios).

Run `npm install --save axios` to add this dependency to your project before you utilize this module.

```js
const spider = require( 'salticidae/spider' );
// Alternately: `const { spider } = require( 'salticidae' );`

spider( 'http://some.url/', {
	key: $ => $( '.some-selector' ).find( '.to #return' ).text(),
	otherKey: $ => $( '.another-selector' ).html(),
}).then( results => {
	console.log(results);
	// {
	//     key: 'Whatever the text of that node was',
	//     otherKey: '<p>The innerHTML of that other node</p>',
	// }
});
```

### `parse`

Works just like `spider`, but accepts HTML as string content instead of a remote URL.

```js
const parse = require( 'salticidae/parse' );

parse( `
<p>Some sort of text<sup>*</sup>, <em>etcetera</em>.</p>
<p><em>Declarative</em> final statement!</p>
`, {
	emphasizedText: $ => $( 'em' ).text(),
	lastParagraph: $ => $( 'p' ).last().html(),
} );
// {
//   emphasizedText: 'etcetera',
//   lastParagraph:  '<em>Declarative</em> final statement!',
// }
```

### `cp`

```js
exec( commandString ).then( () => 'done' );
```

Execute an arbitrary shell command string as a child process.

```js
spawn( command, argsArray ).then( () => 'done' );
```
Spawn a shell command as a child process and pass in provided arguments. The spawned process inherits the active `stdio` streams.


### `fs`

```js
download( absFilePath, uri ).then( () => 'done' );
```

Download the contents of `uri` and save them as `absFilePath`.

```js
ensureExists( absFolderPath ).then( () => 'exists' );
```

Ensure a folder path exists on disk using `mkdirp`.

```js
fileExists( absFilePath ).then( exists => {} );
```

Check whether a given file exists on disk.

```js
ls( absFolderPath, [options] ).then( files => {} );
```

Enumerate the files within the specified directory. If `{ absolute: true }` is passed in the options object, the promise will resolve to absolute file system paths.

```js
readFile( absFilePath ).then( fileContents => {} );
```

Read a file on disk and return its contents as a string.

```js
readJSON( absFilePath ).then( data => {} );
```

Read a file on disk and parse its contents as JSON. (Note that it is usually preferable to use `require` to read JSON files.)

```js
writeFile( absFilePath, contents ).then( () => 'done' );
```

Write string content to a file on disk.

```js
writeJSON( absFilePath, data ).then( () => 'done' );
```

Serialize a JS object to a file on disk as stringified JSON.

### `sequence`

```js
runInSequence( fns, [progressBar] ).then( () => 'done' );
```

Given an array of functions creating Promises, execute those functions one at a time and return a Promise that resolves when all functions have run. If a `progress` ProgressBar instance is provided as a second argument, `.tick()` will be called on that bar each time a function completes.

```js
runInBatches( fns, batchSize, [progressBar] ).then( () => 'done' );
```

Given an array of functions creating Promises, execute them in parallel batches of a specific size and return a Promise that resolves when all batches have run.

### `util`

```js
pad( 42, 4 ); // 0042
```

Pad a numeric string with leading zeroes until the string is a certain length.

```js
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
chunk( array, 4 );
// [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8 ] ]
```

Break an array into smaller arrays of a specific maximum length.

```js
Promise.resolve( input )
	.then( wait( 200 ) )
	.then( output => {
		// Approximately 200ms have passed.
		input === output
	} );
```

Return a function that waits for approximately the provided number of milliseconds (+/- 20%), then returns a promise resolving to the function's input.


### `log`


```js
verbose();
```

Set log level to Verbose. `debug()` messages will be displayed.

```js
quiet();
```

Set log level to Quiet. `debug()` messages will not be displayed.

```js
log( 'message' );
```

Output a message.

```js
debug( 'message' );
```

Output a message if the log level has been set to Verbose.

```js
error( 'error message' );
```

Output an error message.
