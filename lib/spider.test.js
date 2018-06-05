const spider = require( './spider' );

describe( 'salticidae.spider', () => {
	it( 'returns a Promise for an object of the specified selector results', async () => {
		const url = 'https://github.com/kadamwhite/salticidae';
		const results = await spider( url, {
			author: $ => $( '.repohead .author' ).text(),
			hasCommitCount: $ => /\d+\s+commit/i.test(
				$( '.numbers-summary .commits' ).text().trim()
			),
			hasWikiBlockquote: $ => /from Wikipedia/.test(
				$( '#readme blockquote' ).text()
			),
		} );

		expect( results ).toEqual( {
			author: 'kadamwhite',
			hasCommitCount: true,
			hasWikiBlockquote: true,
		} );
	}, 10000 );
} );
