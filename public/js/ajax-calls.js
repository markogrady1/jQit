"use strict";
var getNextMonthViaAjax = function() {
    var rangeParam = $chartRange.val();
    if(rangeParam < 1) {
        $chartRange.val(2);
    } else {
        $chartRange.val(--rangeParam);
    }


    $.ajax('change-issue-month/' + window.location.pathname.split("/")[3] + '/'+ rangeParam, {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            dt = data.obj.raw;
            v = JSON.parse(data.obj.chart);
            startDate = data.obj.raw[0].split("T")[0];
//                      setCharts(issueflagsIndexs, pullsflagsIndexs, true,startDate);
        },
        error  : function()     { console.log(null); }
    });

    $.ajax('change-pulls-month/' + window.location.pathname.split("/")[3] + '/'+ rangeParam, {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            pdt = data.obj.raw;
            pr = JSON.parse(data.obj.chart);
            pr = pr.slice(-29);
            startDate = data.obj.raw[0].split("T")[0];
            setCharts(issueflagsIndexs, pullsflagsIndexs, true, startDate);
        },
        error  : function()     { console.log(null); }
    });

}




var getPreviousMonthViaAjax = function() {
    var rangeParam = $chartRange.val();
    $chartRange.val(++rangeParam);
    $.ajax('change-issue-month/' + window.location.pathname.split("/")[3] + '/'+ rangeParam, {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            dt = data.obj.raw;
            v = JSON.parse(data.obj.chart);
            startDate = data.obj.raw[0].split("T")[0];
//                      setCharts(issueflagsIndexs, pullsflagsIndexs, true, startDate);
        },
        error  : function()     { console.log(null); }
    });

    $.ajax('change-pulls-month/' + window.location.pathname.split("/")[3] + '/'+ rangeParam, {
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            pdt = data.obj.raw;
            pr = JSON.parse(data.obj.chart);
            pr = pr.slice(-29);
            startDate = data.obj.raw[0].split("T")[0];
            setCharts(issueflagsIndexs, pullsflagsIndexs, true, startDate);
        },
        error  : function()     { console.log(null); }
    });

};




