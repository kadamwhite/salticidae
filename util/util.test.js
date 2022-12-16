const {
	chunk,
	pad,
	wait,
} = require( './index' );

jest.useFakeTimers();

describe( 'salticidae.util', () => {

	describe( '.pad()', () => {

		it( 'pads a short number with leading zeroes', () => {
			expect( pad( 7, 3 ) ).toEqual( '007' );
		} );

		it( 'pads a short numeric string with leading zeroes', () => {
			expect( pad( '7', 3 ) ).toEqual( '007' );
		} );

		it( 'has no effect on a sufficiently long number', () => {
			expect( pad( '007', 3 ) ).toEqual( '007' );
			expect( pad( '0007', 3 ) ).toEqual( '0007' );
		} );

	} );

	describe( 'chunk', () => {

		it( 'is a Function', () => {
			expect( chunk ).toBeInstanceOf( Function );
		} );

		it( 'breaks a large array into smaller pieces', () => {
			const result = chunk( [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ], 3 );
			expect( result ).toEqual( [
				[ 1, 2, 3 ],
				[ 4, 5, 6 ],
				[ 7, 8, 9 ],
				[ 10, 11 ],
			] );
		} );

		it( 'does nothing to an empty array', () => {
			expect( chunk( [], 1 ) ).toEqual( [] );
		} );

	} );

	describe( 'salticidae.wait', () => {

		it( 'returns a function', () => {
			expect( wait( 200 ) ).toBeInstanceOf( Function );
		} );

		it( 'returns a function that returns a Promise', () => {
			expect( wait( 200 )() ).toBeInstanceOf( Promise );
		} );

		it( 'returns a function that resolves after the provided delay', () => {
			expect.assertions( 1 );
			const delay = wait( 20 );
			const result = delay( 'Some Value' );

			jest.advanceTimersByTime( 100 );

			return result.then( ( value ) => {
				expect( value ).toEqual( 'Some Value' );
			} );
		} );

	} );

} );
