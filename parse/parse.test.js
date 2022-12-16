const fs = require( 'fs' );
const path = require( 'path' );

const parse = require( './index' );

describe( 'salticidae.spider', () => {
	it( 'parses HTML string content and returns an object of the specified selector query results', () => {
		const content = fs.readFileSync( path.join( __dirname, 'fixtures', 'sample.html' ) );
		const results = parse( content, {
			author: ( $ ) => $( '.repohead .author' ).text(),
			commitCount: ( $ ) => $( '.numbers-summary .commits' ).text().trim(),
			readmeStrongText: ( $ ) => $( '#readme strong' ).text().trim(),
		} );

		expect( results ).toEqual( {
			author: 'kadamwhite',
			commitCount: '23 commits',
			readmeStrongText: 'Requires Node v8.2.1 or greater.',
		} );
	} );

	it( 'works with HTML fragments', () => {
		const results = parse( '<p>Some sort of text<sup>*</sup>, <em>etcetera</em>.</p>', {
			footnote: ( $ ) => $( 'sup' ).text(),
			italic: ( $ ) => $( 'em' ).text(),
			p: ( $ ) => $( 'p' ).text(),
		} );

		expect( results ).toEqual( {
			footnote: '*',
			italic: 'etcetera',
			p: 'Some sort of text*, etcetera.',
		} );
	} );

	it( 'accepts a callback function in addition to an object', () => {
		const content = fs.readFileSync( path.join( __dirname, 'fixtures', 'sample.html' ) );
		const results = parse( content, ( $ ) => ( {
			author: $( '.repohead .author' ).text(),
			commitCount: $( '.numbers-summary .commits' ).text().trim(),
			readmeStrongText: $( '#readme strong' ).text().trim(),
		} ) );

		expect( results ).toEqual( {
			author: 'kadamwhite',
			commitCount: '23 commits',
			readmeStrongText: 'Requires Node v8.2.1 or greater.',
		} );
	} );
} );
