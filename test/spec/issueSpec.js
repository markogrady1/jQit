

describe("Return an typeof Number", function() {
    it("getRepoPercentage(arr, issues) should return typeof Number", function() {
        var tempArr = [];
        var arr = {
            issues: 1,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);
        expect(getMonthAvg(tempArr, "issues")).toEqual(jasmine.any(Number));
    })
});

describe("Return an average issues", function() {
    it("getMonthAvg(tempArr, issues) should return average amount", function() {
        var tempArr = [];
        var arr = {
            issues: 14,
            pulls: 34,
            name: "testObject"
        };
        var arr2 = {
            issues: 10,
            pulls: 34,
            name: "testObject"
        };
        var arr3 = {
            issues: 10,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);
        tempArr.push(arr2);
        tempArr.push(arr3);

        expect(getMonthAvg(tempArr, "issues")).toEqual(11);
    })
});


describe("Return NaN", function() {
    it("Function should return NaN when passed incorrect parameter", function() {
        var tempArr = [];
        var arr = {
            issues: 101,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);

        expect(getMonthAvg(arr, "pulls")).toBeNaN();

    })
});

describe("Return correct month", function() {
    it("getMonthString(07) should return January", function() {
        expect(getMonthString("07")).toEqual("July");
    })
});

describe("Return correct day", function() {
    it("getDayFormat(1973-07-13) should return Mon", function() {
        expect(getDayFormat("1973-07-13")).toEqual("Fri");
    })
});


describe("Return an array consisting of year, month and day", function() {
    it("splitDashDate(1973-07-13) should return array with date split", function() {
        expect(splitDashDate("1973-07-13")).toEqual( [ '1973', '07', '13' ]);
    })
});

describe("Return string stating decrease in issues", function() {
    it("getComparisonFinalString(-1) should return Past 30 days ▼  1", function() {
        expect(getComparisonFinalString(-1)).toEqual('Past 30 days <span class=decrease>▼ </span> 1');
    })
});

describe("Return string stating no increase in issues", function() {
    it("getComparisonFinalString(0) should return Past 30 days ▶ No Gain", function() {
        expect(getComparisonFinalString(0)).toEqual('Past 30 days <span class=same>▶ </span>No Gain');
    })
});

describe("Return string stating increase in issues", function() {
    it("getComparisonFinalString(5) should return Past 30 days ▲  5", function() {
        expect(getComparisonFinalString(5)).toEqual('Past 30 days <span class=increase-icon>▲ </span>5');
    })
});

describe("Return correct day section of Unix Time Stamp", function() {
    it("stripDate(2014-09-30T20:28:24Z) should return 30", function() {
        var func = stripDate("day");
        expect(func("2014-09-30T20:28:24Z")).toEqual("30");
    })
});

describe("Return correct month section of Unix Time Stamp", function() {
    it("stripDate(2014-09-30T20:28:24Z) should return 09", function() {
        var func = stripDate("month");
        expect(func("2014-09-30T20:28:24Z")).toEqual("09");
    })
});

describe("Return an typeof Object", function() {
    it("getRepoPercentage(arr, issues) should return typeof Object", function() {
        var arr = ["test","array", "test"];
        expect(getRepoPercentage(arr, "issues")).toEqual(jasmine.any(Object));
    })
});


