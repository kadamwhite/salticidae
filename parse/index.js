const cheerio = require( 'cheerio' );

const parse = ( html, selectorMethods ) => {
	const $ = cheerio.load( html );
	return Object.keys( selectorMethods ).reduce( ( results, key ) => ( {
		...results,
		[ key ]: selectorMethods[ key ]( $ ),
	} ), {} );
};

module.exports = parse;
