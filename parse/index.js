const cheerio = require( 'cheerio' );

const parse = ( html, selectorMethods ) => {
	const $ = cheerio.load( html );
	if ( typeof selectorMethods === 'function' ) {
		return selectorMethods( $ );
	} else {
		return Object.keys( selectorMethods ).reduce( ( results, key ) => ( {
			...results,
			[ key ]: selectorMethods[ key ]( $ ),
		} ), {} );
	}
};

module.exports = parse;
