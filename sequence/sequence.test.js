/* eslint-disable jsdoc/require-returns */
const {
	runInSequence,
	runInBatches,
} = require( './index' );

describe( 'salticidae.sequence', () => {

	describe( 'runInSequence', () => {

		it( 'is a Function', () => {
			expect( runInSequence ).toBeInstanceOf( Function );
		} );

		it( 'returns a Promise', () => {
			expect( runInSequence( [] ) ).toBeInstanceOf( Promise );
		} );

		it( 'runs provided functions in sequence', () => {
			const output = [];
			const result = runInSequence( [
				() => output.push( 1 ),
				() => output.push( 2 ),
				() => output.push( 3 ),
				() => output.push( 4 ),
				() => output.push( 5 ),
			] );

			expect.assertions( 1 );
			return result.then( () => {
				expect( output ).toEqual( [ 1, 2, 3, 4, 5 ] );
			} );
		} );

		it( 'runs provided async functions in sequence', () => {
			const output = [];
			/**
			 * Make a Promise that resolves to a set value after a delay.
			 *
			 * @param {*}      returnVal Value to return.
			 * @param {number} delay     How long before resolving.
			 * @returns {Promise} The value, eventually.
			 */
			const resolveAfterDelay = ( returnVal, delay ) => new Promise( ( resolve ) => {
				setTimeout( () => {
					output.push( returnVal );
					resolve( returnVal );
				}, delay );
			} );
			const result = runInSequence( [
				() => resolveAfterDelay( 1, 10 ),
				() => resolveAfterDelay( 2, 200 ),
				() => resolveAfterDelay( 3, 20 ),
				() => resolveAfterDelay( 4, 300 ),
				() => resolveAfterDelay( 5, 30 ),
			] );

			expect.assertions( 1 );
			return result.then( () => {
				expect( output ).toEqual( [ 1, 2, 3, 4, 5 ] );
			} );
		} );

	} );

	describe( 'runInBatches', () => {

		it( 'is a Function', () => {
			expect( runInBatches ).toBeInstanceOf( Function );
		} );

		it( 'returns a Promise', () => {
			const result = runInBatches( [], 0 );
			expect( result ).toBeInstanceOf( Promise );
		} );

		it( 'runs provided async functions in sequence', () => {
			const output = [];
			/**
			 * Make a Promise that resolves to a set value after a delay.
			 *
			 * @param {*}      returnVal Value to return.
			 * @param {number} delay     How long before resolving.
			 * @returns {Promise} The value, eventually.
			 */
			const resolveAfterDelay = ( returnVal, delay ) => new Promise( ( resolve ) => {
				setTimeout( () => {
					output.push( returnVal );
					resolve( returnVal );
				}, delay );
			} );
			const result = runInBatches( [
				() => resolveAfterDelay( 1, 10 ),
				() => resolveAfterDelay( 2, 200 ),
				() => resolveAfterDelay( 3, 20 ),
				() => resolveAfterDelay( 4, 300 ),
				() => resolveAfterDelay( 5, 30 ),
			], 2 );

			expect.assertions( 1 );
			return result.then( () => {
				expect( output ).toEqual( [ 1, 2, 3, 4, 5 ] );
			} );
		} );

	} );

} );
