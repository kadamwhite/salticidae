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
	pad,
	wait,
};
