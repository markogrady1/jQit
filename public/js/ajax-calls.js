"use strict";

var AjaxCalls = {

    getNextMonthViaAjax: function() {
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
                allIssuesHistory = data.obj.allRepoHistory;
                allPullsHistory = data.obj.allRepoPullsHistory;
                repoData = data.obj.repoData;
                dt = data.obj.fullDate;
                pdt = data.obj.fullPullDate;
                v = data.obj.ch;
                pr = data.obj.chPull;
                pr = pr.slice(-29);
                p = data.obj.events;
                old = data.obj.oldIssueUrl;
                newestIssue = data.obj.newIssueUrl;
                startDate = data.obj.fullDate[0].split("T")[0];
                setCharts(issueflagsIndexs, pullsflagsIndexs, true, startDate);
            },
            error  : function()     { console.log(null); }
        });

    },

    getPreviousMonthViaAjax: function() {

        var rangeParam = $chartRange.val();
        $chartRange.val(++rangeParam);
        $.ajax('change-issue-month/' + window.location.pathname.split("/")[3] + '/'+ rangeParam, {
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data)
                allIssuesHistory = data.obj.allRepoHistory;
                allPullsHistory = data.obj.allRepoPullsHistory;
                repoData = data.obj.repoData;
                dt = data.obj.fullDate;
                pdt = data.obj.fullPullDate;
                v = data.obj.ch;
                pr = data.obj.chPull;
                pr = pr.slice(-29);
                p = data.obj.events;
                old = data.obj.oldIssueUrl;
                newestIssue = data.obj.newIssueUrl;
                startDate = data.obj.fullDate[0].split("T")[0];
                setCharts(issueflagsIndexs, pullsflagsIndexs, true, startDate);
            },
            error  : function()     { console.log(null); }
        });
    },

    getCompetitorClosureAvg: function(team, cb) {
        var avgData = null;
        $.ajax('competitor-closure-avg/' + team, {
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                avgData = data;
                cb(avgData);
            },
            error  : function()     { console.log(null); }
        });

    }
};







