require('should')
var assert = require('chai').assert;

var m = require('../../lib/mainController');


describe('get PR number for a given repository with mainController.getPRs()', function(){

    it("should return a chunk", function() {
        var str = "'2012-dev-summit  0','2015-developer-summit  3','api.globalizejs.com  1','api.jquery.com  6','api.jquerymobile.com  3'"

        m.formatPRs(str, (data) => {
            setTimeout(() => {
                console.log(data)
                assert.equal(data, 135, '');

            },500)

        })
    })
});
