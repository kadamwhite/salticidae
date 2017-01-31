const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

// Constant for use in writing promise assertions
const SUCCESS = 'SUCCESS!';

const spider = require('./').spider;

describe('salticidae.spider', () => {
  it('returns a Promise for an object of the specified selector results', () => {
    const prom = spider('https://github.com/kadamwhite/salticidae', {
      author: $ => $('.repohead .author').text(),
      latestCommitIsExpectedFormat: $ => {
        const commitMsg = $('.commit-tease')
          .find('.float-right')
          .text()
          .replace(/[\s\n]+/g, ' ')
          .trim();
        return /^Latest commit [0-9a-e]{7} [A-Z][a-z]+ \d+, \d+$/.test(commitMsg);
      },
      hasWikiBlockquote: $ => /from Wikipedia/.test( $('#readme blockquote').text() )
    }).then(result => {
      expect(result).to.deep.equal({
        author: 'kadamwhite',
        latestCommitIsExpectedFormat: true,
        hasWikiBlockquote: true
      });
      return SUCCESS;
    });
    return expect(prom).to.eventually.equal(SUCCESS);
  })
}).timeout(10000);
