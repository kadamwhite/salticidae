const { ls } = require( './fs' );
const { join } = require( 'path' );

describe( 'salticidae.spider', () => {

	describe( '.ls()', () => {

		it( 'lists the files in a directory', async () => {
			expect.assertions( 2 );
			const files = await ls( __dirname );
			expect( files ).toContain( 'fs.js' );
			expect( files ).toContain( 'fs.test.js' );
		} );

		it( 'can return absolute paths', async () => {
			expect.assertions( 2 );
			const files = await ls( __dirname, { absolute: true } );
			expect( files ).toContain( join( __dirname, 'fs.js' ) );
			expect( files ).toContain( join( __dirname, 'fs.test.js' ) );
		} );

	} );

} );
