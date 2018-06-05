const {
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

			return result.then( value => {
				expect( value ).toEqual( 'Some Value' );
			} );
		} );

		it( 'can be used fluidly in a Promise chain', () => {
			expect.assertions( 1 );
			const chain = Promise.resolve( 'Some Value' )
				.then( wait( 20 ) )
				.then( wait( 20 ) );

			jest.advanceTimersByTime( 100 );

			return chain.then( value => {
				expect( value ).toEqual( 'Some Value' );
			} );
		} );
	} );

} );
