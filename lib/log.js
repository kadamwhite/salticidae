/**
 * Log Module.
 *
 * Simple wrapper for console.log. Supports two modes, quiet & verbose.
 *
 * log() will print a message regardless of mode.
 * debug() will print a message only when mode is VERBOSE.
 * error() will display an error.
 */

// Set up mode switching.
let mode = 'QUIET';
const verbose = () => mode = 'VERBOSE';
const quiet = () => mode = 'QUIET';

/**
 * Simple console.log wrapper.
 */
function log() {
	/* eslint-disable no-console */
	console.log.apply( console, arguments );
}

/**
 * console.log wrapper that does nothing when level is not VERBOSE.
 */
function debug() {
	if ( mode !== 'VERBOSE' ) {
		return;
	}
	/* eslint-disable no-console */
	console.log.apply( console, arguments );
}

/**
 * Basic console.error wrapper.
 */
function error() {
	/* eslint-disable no-console */
	console.error.apply( console, arguments );
}

module.exports = {
	verbose,
	quiet,
	log,
	debug,
	error,
};
