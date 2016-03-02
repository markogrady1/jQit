var keys;
var ScrollMovement = {

    preventDefault: function(e) {
       keys  = [37, 38, 39, 40];
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    },
    keydown: function(e) {
        for (var i = keys.length; i--;) {
            if (e.keyCode === keys[i]) {
                preventDefault(e);

                return;
            }
        }
    },
    wheel: function(e) {
        ScrollMovement.preventDefault(e);
    },
    disableScroll: function() {
        if (window.addEventListener) {

            window.addEventListener('DOMMouseScroll', this.wheel, false);
        }
        window.onmousewheel = document.onmousewheel = this.wheel;

        document.onkeydown = this.keydown;
    },
    enableScroll: function() {
        if (window.removeEventListener) {

            window.removeEventListener('DOMMouseScroll', this.wheel, false);
        }
        window.onmousewheel = document.onmousewheel = document.onkeydown = null;
    }


};



$(document).ready(function() {

    $prevChartVal.on("click", function() {
        AjaxCalls.getPreviousMonthViaAjax();
        var bars = document.getElementsByClassName("bars");
        var i = bars.length-1, max = 0 , delay = 10, run;
        run = function(){
            var color = bars[i].style.fill;
            if(i-- > max){
                bars[i].style.fill = "rgb(0, 0, 0)";
                setTimeout(run, delay);
                bars[i].style.fill = color;
            }
        };
        run();
        return false;
    });

    $nextChartVal.on("click", function() {
        AjaxCalls.getNextMonthViaAjax();
        var bars = document.getElementsByClassName("bars");
        var i =  0, max = bars.length-1, delay = 10, run;
        run = function(){
            var color = bars[i].style.fill;
            if(i++ < max){
                bars[i].style.fill = "rgb(0, 0, 0)";
                setTimeout(run, delay);
                bars[i].style.fill = color;
            }
        };
        run();
        return false;
    });

    $(".close-img").on("click", function() {
        ScrollMovement.enableScroll();
        $(".complete-compare-overlay").css("display", "none");
        $(".compare-overlay").css("display", "none");
    });

    $(".attention-marker").on("click", function() {

        var teamname = window.location.pathname.split("/")[3];
        $.ajax({
            method: "POST",
            url: "attention",
            data: {
                username: username,
                email: email,
                userAvatar: av,
                attentionTarget: teamname
            }
        }).done(function(msg) {
            console.log(msg)
        });
    });

    $('.btn').on('click', function() {
        if($('#chartArea').is(":visible")) {
            $('.average').html('Month Average: ' + pullsMonthlyAvg)
        } else if($('#chartArea').is(":hidden")) {
            $('.average').html('Month Average: ' + issuesMonthlyAvg)
        }
    });

    $(".pie-link").on("click", function() {
        if($(this).html() === "Issues") {
            $(this).css({

                color: "#1D214D",
                fontWeight: "bold"
            } );
            $(".p").css({
                color: "#1985E2",
                fontWeight: "normal"

            });
            $("#issues-pie-chart").css("display", "block");
            $("#pulls-pie-chart").css("display", "none");
        }
    });

    $(".pie-link").on("click", function() {
        if($(this).html() === "Pull Requests") {
            $(this).css({

                color: "#1D214D",
                fontWeight: "bold"
            } );
            $(".i").css({
                color: "#1985E2",
                fontWeight: "normal"

            });
            $("#issues-pie-chart").css("display", "none");
            $("#pulls-pie-chart").css("display", "block");
        }
    });
});