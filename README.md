# Salticidae

> The jumping spider family (Salticidae) contains over 500 described genera and more than 5800 described species, making it the largest family of spiders with about 13% of all species. Jumping spiders have some of the best vision among arthropods and use it in courtship, hunting, and navigation. Although they normally move unobtrusively and fairly slowly, most species are capable of very agile jumps, notably when hunting, but sometimes in response to sudden threats or crossing long gaps. *~ from [Wikipedia](https://en.wikipedia.org/wiki/Jumping_spider)*

This is a utility for use in spidering specific content from a webpage. It is named after the jumping spider family because spiders are terrifying, doubly so if they can attack at range.

## Usage

```js
const { spider } = require( 'salticidae' );

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
