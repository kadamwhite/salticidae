const { debug } = require( '../log' );
const { chunk } = require( '../util' );

/**
 * Given an array of functions creating Promises, execute those functions one
 * at a time and return a Promise that resolves when all functions have run.
 *
 * @param {Function[]}  fns            Array of functions returning promises.
 * @param {ProgressBar} [progressBar]  Optional ProgressBar instance (see `progress` library).
 * @returns {Promise} Promise that resolves when the functions have all completed.
 */
const runInSequence = ( fns, progressBar = null ) => fns.reduce( async ( lastStep, fn, i ) => {
	debug( `Running function #${ i + 1 } of ${ fns.length }` );

	await lastStep;

	if ( progressBar && typeof progressBar.tick === 'function' ) {
		progressBar.tick();
	}

	return fn();
}, Promise.resolve() );

/**
 * Given an array of functions creating Promises, execute them in parallel
 * batches of a specific size and return a Promise that resolves when all
 * batches have fun.
 *
 * @param {Function[]} fns Array of functions returning promises.
 * @param {Number} batchSize Number of functions to permit to run simultaneously.
 */
const runInBatches = ( fns, batchSize, progressBar ) => runInSequence(
	chunk( fns, batchSize ).map( batch => () => Promise.all( batch.map( fn => fn() ) ) ),
	progressBar
);

module.exports = {
	chunk,
	runInSequence,
	runInBatches,
};
