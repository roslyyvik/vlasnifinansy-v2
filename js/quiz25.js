$(document).ready(function() {
    var error = 'Будь ласка, оберіть варіант відповіді на запитання';
    var qname = $("title").html();
    qname = $.trim(qname);
    qname = qname.substr(0, qname.search('[\|]') - 1);
    var questions = $(".qquestion").length;
    $(".qnum-questions").text(questions);
    var value = 0;
    $(".qquestion").each(function(i) {
        i = i + 1;
        $("#q" + i).prepend('<h2 class="article-title">Питання ' + i + ' з ' + questions + ':</h2>');
        if (i !== 1) { $("#q" + i).append('<button type="button" class="qprevious" name="q' + parseInt(i - 1) + '">Назад</button>'); }
        if (i < questions) { $("#q" + i).append('<button type="button" style="float:right"  class="qnext" name="q' + parseInt(i + 1) + '">Далі</button>'); }
        if (i === questions) { $("#q" + i).append('<button type="button" style="float:right"  class="qnext" name="qresults">Результат</button>'); }
        $("#q" + i + " li").each(function(x) {
            x = x + 1;
            value = $(this).children('.answer-value').text();
            //set default values
            if (value === '') {
                if ($(this).hasClass("correct")) { value = 1; } else { value = 0; }
            }
            $(this).attr("id", 'q' + i + 'a' + x);
            $(this).prepend('<input type="radio" name="q' + i + '" value="' + value + '" />');
        });
    });

    var score;
    var allAnswered;
    var question;
    $(".qanswer").on("click", function(e) {
        score = 0;
        allAnswered = true;
        question = $(this).parents("div:first").attr('id');
        var answer = 0;
        $(".error").text('');
        $("#" + question + " li").css('font-weight', 'normal');
        $("#" + this.id).css('font-weight', 'bold');
        $("#" + this.id + " input").attr('checked', true);
        //$('input[name='+question+']').attr('disabled', true);
        $(".qquestion").each(function(i) {
            i = i + 1;
            if ($("input:radio[name=q" + i + "]:checked").val() == "1") {
                $("#q" + i + " .qfeedback").hide();
                $("#q" + i + " .correct").show();
            }
            if ($("input:radio[name=q" + i + "]:checked").val() == "0") {
                $("#q" + i + " .qfeedback").hide();
                $("#q" + i + " .incorrect").show();
            }
            answer = parseInt($("input:radio[name=q" + i + "]:checked").val());
            if (isNaN(answer)) {
                answer = 0;
                allAnswered = false;
            }
            score = score + answer;
        });
        $(".qscore").text(score + " з " + questions);
    });

    $("#qresults").append('<button type="button"  class="qprevious" name="q' + questions + '">Назад</button>');
    $("#qresults").append('<button type="button" style="float:right" class="start-over">Cпочатку</button>');

    $(".qnext, .qprevious").on("click", function() {
        question = $(this).parents("div:first").attr('id');
        if ($(this).hasClass('qnext') && $("input:radio[name=" + question + "]:checked").val() == undefined) {
            $(".error").css('background-color', '#29a3a3')
            $(".error").text(error);
            $(".error").fadeToggle(2000);
            $(".error").fadeOut(5000);
            // alert(error);
            return false;
        };
        var show = $(this).attr("name");
        $("#qresults").hide();
        $(".qquestion").hide();
        $("#" + show).show();
        if (allAnswered) { _gaq.push(['_trackEvent', 'Quiz - In Page', 'Completed', qname, score]); }
    });

    $(".start-over").on("click", function() {
        $("input:radio").removeAttr('disabled');
        $(".qfeedback").hide();
        $(".qanswer").css('font-weight', 'normal');
        $("input:radio").attr('checked', false);
        $(".qquestion").hide();
        $(".qresults").hide();
        $("#q1").show();
        $(".response").hide();
        $("#response0").show();
        score = 0;
    });

    $("#quiz-container").append('<p class="error">&nbsp;</p>');
    $('.qanswer').attr('onclick', ''); // hack for ios

    $(".qanswer").on("click", function(e) {
        if (allAnswered) {
            var responseValue;
            $(".qresponse").each(function(i) {
                i = i + 1;
                responseValue = parseInt($(this).children('.response-value').text());
                if (isNaN(responseValue)) { responseValue = 0; }
                if (score >= responseValue) {
                    $(".qresponse").hide();
                    $("#" + this.id).show();
                }
            });
        }
    });

});