const axios = require( 'axios' );

const parse = require( '../parse' );

/**
 * Load a URL, and return an object with the results of running one or many
 * cheerio.js expressions against it.
 *
 * @param {string} url A string URL pointing to an HTML page.
 * @param {object} selectorMethods An object of keys and the functions that
 * should be used to populate those keys: each function takes one argument,
 * "$", corresponding to the loaded cheerio instance.
 * @returns {object} An object of the results of each method.
 */
const spider = async ( url, selectorMethods ) => {
	/* eslint-disable no-useless-catch */
	try {
		const html = await axios.get( url ).then( ( results ) => results.data );

		return parse( html, selectorMethods );
	} catch ( err ) {
		throw err;
	}
};

module.exports = spider;
