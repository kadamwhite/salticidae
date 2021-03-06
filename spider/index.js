const axios = require( 'axios' );

const parse = require( '../parse' );
const { debug, error } = require( '../log' );

/**
 * Load a URL, and return an object with the results of running one or many
 * cheerio.js expressions against it.
 *
 * @param {string} url A string URL pointing to an HTML page.
 * @param {Object} selectorMethods An object of keys and the functions that
 * should be used to populate those keys: each function takes one argument,
 * "$", corresponding to the loaded cheerio instance.
 * @returns {Object} An object of the results of each method.
 */
const spider = async ( url, selectorMethods ) => {
	debug( `salticidae.spider: requesting ${ url }` );

	try {
		const html = await axios.get( url ).then( results => results.data );

		return parse( html, selectorMethods );
	} catch ( err ) {
		error( `salticidae.spider: error downloading ${ url }!` );
		throw err;
	}
}

module.exports = spider;
