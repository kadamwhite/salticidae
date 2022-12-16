const cheerio = require( 'cheerio' );

/**
 * Parse HTML with Cheerio, en masse or with several functions.
 *
 * @param {string}              html            HTML to parse.
 * @param {Function|Function[]} selectorMethods Methods to run on HTML.
 * @returns {*} Results of the provided functions.
 */
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
