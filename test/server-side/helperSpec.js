var mainCon = require('../../lib/mainController');

//it('should return the difference', function(){
//    	var doc = [{
//    		created_at: "2015-08-26T02:00:03Z",
//    		closed_at: "2015-08-30T02:00:03Z"
//    	}];
//    	var diff = mainCon.getTimeString(doc, () => {
//    		expect( 'not valid').equal( diff);
//    	})
//
//
//    });

describe("Return URL with a given parameter", function() {
    it("getChartHeight(bstyle) should return the value of 168", function() {
        var str = "mark";
        var el = mainCon.preparePath(str);
        console.log("preparePath() function test")
        expect(el).toEqual('https://api.github.com/repos/jquery/mark/events');
    })
});



