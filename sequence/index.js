const { debug } = require( '../log' );
const { chunk } = require( '../util' );

/**
 * Given an array of functions creating Promises, execute those functions one
 * at a time and return a Promise that resolves when all functions have run.
 *
 * @param {Function[]} fns Array of functions returning promises.
 * @returns {Promise} Promise that resolves when the functions have all completed.
 */
const runInSequence = ( fns, sequenceName ) => fns.reduce( async ( lastStep, fn, i ) => {
	debug( `Running function #${ i + 1 } of ${ fns.length } in queue ${ sequenceName || '' }` );
	await lastStep;
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
const runInBatches = ( fns, batchSize ) => runInSequence(
	chunk( fns, batchSize ).map( batch => () => Promise.all( batch.map( fn => fn() ) ) )
);

module.exports = {
	chunk,
	runInSequence,
	runInBatches,
};
