const axios = require( 'axios' );
const cheerio = require( 'cheerio' );

/**
 * Load a URL, and return an object with the results of running one or many
 * cheerio.js expressions against it
 *
 * @param {string} url A string URL pointing to an HTML page
 * @param {Object} selectorMethods An object of keys and the functions that
 * should be used to populate those keys: each function takes one argument,
 * "$", corresponding to the loaded cheerio instance.
 * @returns {Object} An object of the results of each method
 */
const spider = ( url, selectorMethods ) => axios
	.get( url )
	.then( results => results.data )
	.then( html => {
		const $ = cheerio.load( html );

		return Object.keys( selectorMethods ).reduce( ( results, key ) => {
			const selectorMethod = selectorMethods[ key ];
			results[ key ] = selectorMethod( $ );
			return results;
		}, {} );
	} );

module.exports = {
	spider,
};
