var assert = require('assert');
var log = require('../index').simplelog;

describe('Logger', function() {
  describe('#simplelog', function() {
    it('should no error', function() {
			try {
				log.info("success...");
      	assert.ok(true);
			} catch(e) {
				console.log('got error:', e);
      	assert.ok(false);
			}
    });
  });
});
