/**
 * Pad a numeric string with leading zeroes until the string is a certain length.
 *
 * @param {Number|String} val    A number or numeric string.
 * @param {Number}        length The minimum length of the desired string.
 * @returns {String} A zero-padded numeric string.
 */
const pad = ( val, length ) => {
	if ( `${ val }`.length < length ) {
		return pad( `0${ val }`, length );
	}
	return val;
};

/**
 * Break an array into smaller pieces of a specific size.
 *
 * @param {Array}  arr       Array to break into smaller pieces.
 * @param {Number} chunkSize The number of items per chunk.
 * @returns {Array} Array of arrays of the specific size.
 */
const chunk = ( arr, chunkSize ) => arr.reduce( ( chunks, item ) => {
	// Handle first step. Doing this here rather than in the reducer's initial
	// value avoids the situation where `[ [] ]` is returned for empty arrays.
	if ( item && ! chunks.length ) {
		chunks.push( [] );
	}

	// Chunking logic.
	const latestChunk = chunks[ chunks.length - 1 ];
	if ( latestChunk.length < chunkSize ) {
		latestChunk.push( item );
	} else {
		chunks.push( [ item ] );
	}
	return chunks;
}, [] );

/**
 * Return a function that waits a slightly-randomized number of milliseconds,
 * then returns a promise resolving to the function's input argument.
 *
 * @param {Number} delay The approximate number of milliseconds to wait.
 * @returns {Function} A function
 */
const wait = delay => results => new Promise( ( resolve, reject ) => {
	// Introduce +/- 20% random variation
	const randomDelay = delay * 0.8 + ( Math.random() * ( delay * 0.4 ) );
	setTimeout( () => resolve( results ), randomDelay );
} );

module.exports = {
	chunk,
	pad,
	wait,
};
