/**
 * This set of tests are configured to challenge and test the values returned from
 * the chart.js and teamchart.js scripts
 */

describe("Return height of issue bar chart", function() {
    it("getChartHeight(bstyle) should return the value of 168", function() {
       var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getChartHeight(bstyle)).toEqual(168);
    })
});

describe("Return width of issue bar chart", function() {
    it("getChartWidth(bstyle) should return the value of 812", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getChartWidth(bstyle)).toEqual(812);
    })
});

describe("Return height of main issue bar chart", function() {
    it("getmainChartHeight(bstyle) should return the value of 180", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getmainChartHeight(bstyle)).toEqual(180);
    })
});

describe("Return width of main issue bar chart", function() {
    it("getmainChartWidth(bstyle) should return the value of 800", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getmainChartWidth(bstyle)).toEqual(800);
    })
});

describe("Return incorrect height of issue bar chart", function() {
    it("getChartHeight(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 48, 72, 60, 40, 20, true)
        expect(getChartHeight(bstyle)).not.toEqual(168);
    })
});

describe("Return incorrect width of issue bar chart", function() {
    it("getChartWidth(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 42, 72, 60, 40, 20, true)
        expect(getChartWidth(bstyle)).not.toEqual(812);
    })
});

describe("Return incorrect height of main issue bar chart", function() {
    it("getmainChartHeight(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 44, 72, 60, 40, 20, true)
        expect(getmainChartHeight(bstyle)).not.toEqual(180);
    })
});

describe("Return incorrect width of main issue bar chart", function() {
    it("getmainChartWidth(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 42, 71, 62, 40, 20, true)
        expect(getmainChartWidth(bstyle)).not.toEqual(800);
    })
});

describe("Return target datatype", function() {
    it("should return 'issues' as target datatype", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(bstyle.dataType).toEqual("issues");
    })
});


describe("Return an typeof Object", function() {
    it("should return specific values within object", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true);
        expect(bstyle).toEqual({
            w: 900,
            h: 300,
            top: 48,
            bottom: 72,
            left: 60,
            right: 40,
            padding: 20,
            dataType: 'issues'
        });
    })
});

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

describe("Check that checkIncrease() returns an Object", function() {
    it("Should return an Object", function() {
        var dataArr = [];
        var data = {
            issues: 9
        };
        dataArr.push(data);

        var actualValue = checkIncrease(dataArr, '1', true, "issues");
        expect(actualValue).toEqual(jasmine.any(Object) )
    })
});

describe("Check for periodic rise in issues", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [1, 2, 4] for issues", function() {
        var dataArr = [];
        var data = {
            issues: 9
        };
        dataArr.push(data);
        data = {
            issues: 23
        };
        dataArr.push(data);

        data = {
            issues: 25
        };
        dataArr.push(data);
        data = {
            issues: 19
        };
        dataArr.push(data);
        data = {
            issues: 22
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', true, "issues");
        expect(actualValue).toEqual([1,2,4 ]);
    })
});

describe("Check for periodic rise in pulls", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [1, 2, 4] for pulls", function() {
        var dataArr = [];
        var data = {
            pulls: 9
        };
        dataArr.push(data);
        data = {
            pulls: 23
        };
        dataArr.push(data);

        data = {
            pulls: 25
        };
        dataArr.push(data);
        data = {
            pulls: 19
        };
        dataArr.push(data);
        data = {
            pulls: 22
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', true, "pulls");
        expect(actualValue).toEqual([1,2,4 ]);
    })
});


describe("Check for the last rise in pulls", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [999, 4] for pulls", function() {
        var dataArr = [];
        var data = {
            pulls: 9
        };
        dataArr.push(data);
        data = {
            pulls: 23
        };
        dataArr.push(data);

        data = {
            pulls: 25
        };
        dataArr.push(data);
        data = {
            pulls: 10
        };
        dataArr.push(data);
        data = {
            pulls: 12
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', false, "pulls");
        expect(actualValue).toEqual([999, dataArr.length-1 ]);
    })
});

describe("Check for no last rise in pulls", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [-999, -999] for pulls", function() {
        var dataArr = [];
        var data = {
            pulls: 9
        };
        dataArr.push(data);
        data = {
            pulls: 23
        };
        dataArr.push(data);
        data = {
            pulls: 1
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', false, "pulls");
        expect(actualValue).toEqual([-999, -999]);
    })
});


describe("Check for the last rise in issues", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [999, 4] for issues", function() {
        var dataArr = [];
        var data = {
            issues: 9
        };
        dataArr.push(data);
        data = {
            issues: 23
        };
        dataArr.push(data);

        data = {
            issues: 25
        };
        dataArr.push(data);
        data = {
            issues: 119
        };
        dataArr.push(data);
        data = {
            issues: 122
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', false, "issues");
        expect(actualValue).toEqual([999, dataArr.length-1 ]);
    })
});

describe("Check for no last rise in issues", function() {
    it("checkIncrease(data, boundary, periodic, targetType ) should return modified array with the values [-999, -999] for issues", function() {
        var dataArr = [];
        var data = {
            issues: 9
        };
        dataArr.push(data);
        data = {
            issues: 23
        };
        dataArr.push(data);
        data = {
            issues: 1
        };
        dataArr.push(data);
        var actualValue = checkIncrease(dataArr, '1', false, "issues");
        expect(actualValue).toEqual([-999, -999]);
    })
});

describe("return string value containing bar colour", function() {
    it("should return type String", function() {
        var dataArr = [1,2,2];
        var actualValue = checkForFlagValues(dataArr, function() { return "no colors"}, 1);
        expect(actualValue).toEqual(jasmine.any(String));
    })
});

describe("return colors for chart with checkForFlagValues() function", function() {
    it("should return a colour #ff0000", function() {
        var dataArr = [1,2,2];
        var actualValue = checkForFlagValues(dataArr, function() { return "no colors"}, 1);
        expect(actualValue).toEqual("ff0000");
    })
});

describe("return no colors for chart with checkForFlagValues() function", function() {
    it("should return 'no colours' text value, which represents the d3.linearColorScale function", function() {
        var dataArr = [];
        var actualValue = checkForFlagValues(dataArr, function() { return "no colours"}, 1);
        expect(actualValue).toEqual("no colours");
    })
});


