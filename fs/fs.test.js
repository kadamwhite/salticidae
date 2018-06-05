const {
	ls,
	read,
	readJSON,
} = require( './index' );
const { join } = require( 'path' );

describe( 'salticidae.spider', () => {

	describe( '.ls()', () => {

		it( 'lists the files in a directory', async () => {
			expect.assertions( 2 );
			const files = await ls( __dirname );
			expect( files ).toContain( 'index.js' );
			expect( files ).toContain( 'fs.test.js' );
		} );

		it( 'can return absolute paths', async () => {
			expect.assertions( 2 );
			const files = await ls( __dirname, { absolute: true } );
			expect( files ).toContain( join( __dirname, 'index.js' ) );
			expect( files ).toContain( join( __dirname, 'fs.test.js' ) );
		} );

	} );

	describe( '.read()', () => {

		it( 'Reads a file from disk', async () => {
			expect.assertions( 1 );
			const text = await read( join( __dirname, 'fixtures/pangram.txt' ) );
			expect( text.trim() ).toEqual( 'The quick brown fox jumps over the lazy dog.' );
		} );

	} );

	describe( '.readJSON()', () => {

		it( 'Reads a JSON file from disk', async () => {
			expect.assertions( 1 );
			const text = await readJSON( join( __dirname, 'fixtures/pangram.json' ) );
			expect( text ).toEqual( {
				words: [ 'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog' ],
			} );
		} );

	} );

} );
