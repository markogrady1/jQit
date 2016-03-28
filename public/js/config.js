
"use strict";
var repositoryTarget,issuesboundary, pullsboundary, receiveEmail,highlightissueschart,highlightpullschart,  showeveryincrease;
var teamTarget,teamissuesboundary, teampullsboundary, teamreceiveEmail,teamhighlightissueschart,teamhighlightpullschart,  teamshoweveryincrease;

function checkDashboardValues(flagData, teamFlag) {
    if(flagData === null) {
        repositoryTarget = null;
        issuesboundary = 1;
        pullsboundary = 1;
        receiveEmail = false;
        highlightissueschart = false;
        highlightpullschart = false;
        showeveryincrease = false;

    } else {
        repositoryTarget = flagData.repository_target;
        issuesboundary = flagData.issues_boundary;
        pullsboundary = flagData.pulls_boundary;
        receiveEmail = flagData.receive_email;
        highlightissueschart = flagData.highlight_issues_chart;
        highlightpullschart = flagData.highlight_pulls_chart;
        showeveryincrease = flagData.show_every_increase;
    }

    if(teamFlag === null) {
        teamTarget = null;
        teamissuesboundary = 1;
        teampullsboundary = 1;
        teamreceiveEmail = false;
        teamhighlightissueschart = false;
        teamhighlightpullschart = false;
        teamshoweveryincrease = false;
    } else {
        teamTarget = teamFlag.team_target;
        teamissuesboundary = teamFlag.issues_team_boundary;
        teampullsboundary = teamFlag.pulls_team_boundary;
        teamreceiveEmail = teamFlag.receive_email;
        teamhighlightissueschart = teamFlag.highlight_team_issues_chart;
        teamhighlightpullschart = teamFlag.highlight_team_pulls_chart;
        teamshoweveryincrease = teamFlag.show_team_every_increase;
    }
}


