/* Changelog
    20130704 - Updated GA event tracking code to be included in bounce rate calculation
    20150610 - Rewritten to be responsive
    20150702 - fixed a bug with nper when interest rate is 0%
    */


//GLOBAL VARS
var CALC_NAME = 'цільових накопичень';
var ANALYTICS = true;
if (location.hostname === "localhost") {
    ANALYTICS = false;
}

$(document).ready(function() {

    //Draw calculator framework
    DrawCalculator();

    //blur on enter key
    $('#savingsGoalsContainer').on('keypress', 'input', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

    // VALIDATION
    $('input.int').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
    $('input.float').keyup(function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers
    $('#savingsGoalsContainer input[type="text"]').focus(function() { this.select(); });
    $('#savingsGoalsContainer input[type="text"]').mouseup(function(e) { e.preventDefault(); });
    $('#savingsGoalsContainer input[type="text"]').blur(function() {
        if (this.value.length < 1) { $(this).val(0); }
        if (this.id == 'nper' && this.value === 0) { $(this).val(1); } // set a min nper of 1
        if (this.id == 'nper' && this.value > 60) { $(this).val(60); } // set a max nper of 60
        if (this.id == 'pmt' && this.value === 0) { $(this).val(1); } // set a min pmt of 1
        if (this.id == 'rate' && this.value > 20) { $(this).val(20); } // set a max rate of 10%
        if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)); }
        if ($(this).hasClass('interest')) { $(this).val(formatNumber($(this).val(), 0, 2, true) + '%'); }
        if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' years'); }
        calculate();
    });
    $('#savingsGoalsContainer select').change(function() { calculate(); });
    $('#savingsGoalsContainer input[type="text"]').focus(function() {
        this.select();
        $(this).removeClass('empty');
        if ($('input.empty:visible').length == 0) { $('#savingsGoalsContainer .label-required').remove(); }
    });
    $('input[type="checkbox"]').change(function() {
        if (this.checked) {
            $('.or').hide();
            $(this).parents('p').find('input[type="text"], select').hide();
            $('p.pmt').show();
            if (this.id === 'fvCbx') {
                $('[for="nperCbx"], p.nper span, p.nper input[type="checkbox"]').hide();
                if ($('#nperFreq').val() == 12) { $('#pmtFreq').val(12).prop('disabled', true); } else { $('#pmtFreq').prop('disabled', false); }
            }
            if (this.id === 'nperCbx') {
                $('[for="fvCbx"], p.fv span, p.fv input[type="checkbox"], #nperFreqP').hide();
                $('#pmtFreq').prop('disabled', false);
            }
        } else {
            $('.or').show();
            $(this).parents('p').find('input[type="text"], select, .pmt').show();
            $('p.pmt').hide();
            $('#pmtFreq').prop('disabled', false);
            if (this.id === 'fvCbx') { $('[for="nperCbx"], p.nper span, p.nper input[type="checkbox"]').show(); }
            if (this.id === 'nperCbx') { $('[for="fvCbx"], p.fv span, p.fv input[type="checkbox"],#nperFreqP').show(); }
        }
        calculate();
    });
    // lock pmtFreq if nperFreq is set to months
    $('#nperFreq').change(function() {
        if (this.value == 12) { $('#pmtFreq').val(12).prop('disabled', true); } else { $('#pmtFreq').prop('disabled', false); }
    });

    // GA TRACKING
    //track inputs
    // if (ANALYTICS) {
    //     $('#savingsGoalsContainer').on('blur', 'input', function() {
    //         moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input - ' + $('label[for="' + this.id + '"]').text(), $(this).val(), 0);
    //     });
    //     $('#savingsGoalsContainer').on('change', 'select', function() {
    //         moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, ' Select - ' + $('label[for="' + this.id + '"]').text(), $(this).children("option:selected").html(), 0);
    //     });
    //     $('#savingsGoalsContainer').on('change', 'input[type="checkbox"]', function() {
    //         if (this.checked) {
    //             moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input - ' + $('label[for="' + this.id + '"]').text(), 'checked', 0);
    //         } else {
    //             moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input - ' + $('label[for="' + this.id + '"]').text(), 'un-checked', 0);
    //         }
    //     });
    //     //track expanding explore scenario
    //     $('#savingsGoalsContainer').on('click', '.explore h4', function() {
    //         moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Explore scenario', $(this).text(), 0);
    //     });
    // }

    //explore (action checklist)
    $(".explore h4").click(function(event) {
        $(this).toggleClass('open');
        $(this).nextAll("div.more:first").slideToggle();
    });
    $('.explore h4:last').append('<span class="icon"/>');
    $('.explore h4.actions').prepend('<span class="icon-actions"/>');

    //TOOLTIP
    var targets = $('[rel~=tooltip]'),
        target = false,
        tooltip = false,
        title = false;
    targets.bind('mouseenter', function() {
        target = $(this);
        tip = target.attr('title');
        tooltip = $('<div id="tooltip"></div>');
        if (!tip || tip == '')
            return false;
        target.removeAttr('title');
        tooltip.css('opacity', 0)
            .html(tip)
            .appendTo('body');
        var init_tooltip = function() {
            if ($(window).width() < tooltip.outerWidth() * 1.5)
                tooltip.css('max-width', $(window).width() / 2);
            else
                tooltip.css('max-width', 340);
            var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
                pos_top = target.offset().top - tooltip.outerHeight() - 20;
            if (pos_left < 0) {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass('left');
            } else
                tooltip.removeClass('left');
            if (pos_left + tooltip.outerWidth() > $(window).width()) {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass('right');
            } else
                tooltip.removeClass('right');
            if (pos_top < 0) {
                var pos_top = target.offset().top + target.outerHeight();
                tooltip.addClass('top');
            } else
                tooltip.removeClass('top');
            tooltip.css({ left: pos_left, top: pos_top })
                .animate({ top: '+=10', opacity: 1 }, 50);
        };
        init_tooltip();
        $(window).resize(init_tooltip);
        var remove_tooltip = function() {
            tooltip.animate({ top: '-=10', opacity: 0 }, 50, function() {
                $(this).remove();
            });
            target.attr('title', tip);
        };
        target.bind('mouseleave', remove_tooltip);
        tooltip.bind('click', remove_tooltip);
    });


});

function test() {
    //prefill data
    $('#fv').val('20000');
    $('#nper').val('10');
    $('#pv').val('5000');
    $('#rate').val('5');
}

//CALCULATIONS
function calculate() {
    if ($('input.empty:visible').length > 0) { $('#chart, #savingsGoalsResult').html(''); return false; }
    var pv = cleanVal('pv');
    var fv = cleanVal('fv');
    var fvCbx = $('#fvCbx').prop("checked");
    var nper = cleanVal('nper');
    var nperFreq = cleanVal('nperFreq');
    var nperCbx = $('#nperCbx').prop("checked");
    var pmt = cleanVal('pmt');
    var pmtFreq = cleanVal('pmtFreq');
    var rate = cleanVal('rate') / 100;
    var type = 1;
    var html = '';
    var months = false;
    var lastColLabel = ''; //used for the last column label when calculating NPER

    var initial = new Array();
    initial[0] = pv;
    var savings = new Array();
    savings[0] = pv;
    var interest = new Array();
    interest[0] = 0;

    //what do we want to calculate?
    if (fvCbx) { // FV (as much as possible)
        if (nperFreq == 1) { fv = FV(rate / pmtFreq, nper * pmtFreq, pmt, pv, type); } else {
            fv = FV(rate / pmtFreq, nper, pmt, pv, type);
            months = true;
        }
        html = 'Ви можете накопичити<br/><span style="font-size: 1.8em;color: #0047F5;font-weight:bold;">₴' + formatNumber(fv, 0, 0, true) + '</span>' +
            '<br/><span>заощаджуючи ₴' + formatNumber(pmt, 0, 0, true) + ' ' + $('#pmtFreq option:selected').text().toLowerCase() +
            ' протягом ' + nper + ' ' + $('#nperFreq option:selected').text().toLowerCase() + '</span>';
        // if (ANALYTICS) { moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Calculate', 'FV', 0); }
    } else if (nperCbx) { // NPER (as soon as possible)
        nper = NPER(rate / pmtFreq, -pmt, -pv, fv, type);
        var nperSavings = pmt * nper; // used to balance out the last column of the chart
        var nperInterest = -FV(rate / pmtFreq, nper, pmt, pv, type) - (nperSavings + pv); // used to balance out the last column of the chart
        var y = parseInt(nper / pmtFreq);
        var m = Math.ceil(((nper / pmtFreq) % 1) * 12);
        if (m == 12) {
            y = y + 1;
            m = 0;
        }
        if (y <= 1) { if (y == 1) { y = y + ' року '; } else { y = ''; } } else { y = y + ' років '; }
        if (m <= 1) { if (m == 1) { m = m + ' місяця'; } else { m = ''; } } else { m = m + ' місяців'; }
        html = y + m;
        if (html.length < 1) { html = '0 місяців'; }
        lastColLabel = html;
        html = 'Це дозволить вам протягом<br/><span style="font-size: 1.8em;color: #0047F5;font-weight:bold;">' + html + '</span><br/>' +
            '<span>досягти своєї мети ₴' + formatNumber(fv, 0, 0, true) + ', з внесками ₴' + formatNumber(pmt, 0, 0, true) + ' ' +
            $('#pmtFreq option:selected').text().toLowerCase() + '</span>';
        // if (ANALYTICS) { moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Calculate', 'NPER', 0) };
    } else { // PMT (how much you have to save per month to reach your goal)
        if (nperFreq == 1) {
            nperFreq = 12;
            pmt = -PMT(rate / nperFreq, nper * 12, -pv, fv, type);
        } // force the answer show in dollars per month
        else {
            pmt = -PMT(rate / nperFreq, nper, -pv, fv, type);
            months = true;
        }
        if (pmt < 0) { pmt = 0; }
        html = 'Вам необхідно заощаджувати<br/><span style="font-size: 1.8em;color: #0047F5;font-weight:bold;">₴' +
            formatNumber(pmt, 0, 2, true) + ' на місяць</span><br/><span>' +
            'щоб накопичити цільову суму ₴' + formatNumber(fv, 0, 0, true) + ' протягом ' + nper + ' ' + $('#nperFreq option:selected').text().toLowerCase() + '</span>';
        // if (ANALYTICS) { moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Calculate', 'PMT', 0) };
    }

    //loop to get the data for the chart
    rate = rate / pmtFreq;
    if (months) { pmtFreq = 1; }
    if (nper % 1 > 0) {
        nper = nper / pmtFreq;
        nper = nper + 1;
    }
    if (nperCbx && rate === 0) { nper = Math.ceil(nper / pmtFreq); } // if we are calculating nper with no interest force graph into years
    for (var i = 1; i <= nper; i++) {
        initial[i] = pv;
        savings[i] = -FV(0, i * pmtFreq, pmt, pv, type) - pv; // 0% interest
        interest[i] = -FV(rate, i * pmtFreq, pmt, pv, type) - (savings[i] + pv);
    }
    // if calculating NPER, balance out the last column data (it may not be a full year)
    if (nperCbx) {
        savings[savings.length - 1] = nperSavings;
        interest[interest.length - 1] = nperInterest;
    }

    // show the results
    drawChart(initial, savings, interest, months, lastColLabel);
    $('#savingsGoalsResult').html('<p>' + html + '</p>'); // show text based result
    $('#savingsGoalsContainerResult').show();
    $('#pmtAction').text(' ₴' + formatNumber(pmt, 0, 2, true) + ' ' + $('#pmtFreq option:selected').text().toLowerCase()); // update action checklist
    // if (ANALYTICS) { dataLayer.push({ event: 'calculatorCompleted' }) };
}

//HTML
function DrawCalculator() { // CALCULATOR FRAMEWORK HTML
    var html = '<h2 class="shaded">Калькулятор ' + CALC_NAME + '</h2>';

    //input
    html = html + '<div class="break input">' +
        '<p class="label-required">обов\'язкове поле</p>' +
        '<h3 class="col100">Ваші цілі</h3>' +
        '<p class="fv">' +
        '<label for="fv">Я хочу накопичити:</label><label for="fvCbx" class="offScreen">Я хочу заощадити якомога більше</label>' +
        '<input id="fvCbx" type="checkbox"/> <label class="chkLabel" for="fvCbx">Так багато, як тільки можливо</label><span class="or">АБО</span>' +
        '<input id="fv" inputmode="numeric" type="text" class="dollars int empty" />' +
        '</p>' +
        '<hr class="col100 hr-break"><p class="nper">' +
        '<label for="nper">Я хочу витратити на це:</label>' +
        '<label for="nperCbx" class="offScreen">Я хочу досягти цього якомога швидше</label><input id="nperCbx" type="checkbox"/> ' +
        '<label class="chkLabel" for="nperCbx">Як найшвидше</label><span class="or">АБО</span><input id="nper" inputmode="numeric" type="text" class="int empty" /></p>' +
        '<p id="nperFreqP"><label for="nperFreq">&nbsp;</label><select id="nperFreq">' +
        '<option value="1" selected="selected">Років</option><option value="12">Місяців</option></select>' +
        '</p><hr class="col100 hr-break" >' +
        '<p><label for="pv">Початкова сума:</label><input id="pv" inputmode="numeric" type="text" class="dollars int empty" /></p>' +
        '<p><label for="rate">Відсоткова ставка: <span>(макс 20%)</span></label><input id="rate" inputmode="decimal" type="text" class="interest float empty" /></p>' +
        '<hr class="col100 hr-break">' +
        '<p class="pmt hide">' +
        '<label for="pmt">Регулярні внески:</label><input id="pmt" inputmode="numeric" type="text" class="dollars int empty" /></p>' +
        '<p class="pmt hide"><label for="pmtFreq">Періодичність внесків:</label><select id="pmtFreq"><option value="1">Щорічно</option><option value="4">Щокварталу</option>' +
        '<option value="12" selected="selected">Щомісяця</option><option value="26">Двотижнево</option>' +
        '<option value="52">Щотижня</option></select>' +
        '</p>' +
        '</div>';

    //results
    html = html + '<div class="break" id="savingsGoalsContainerResult" class="ms-calc-result">' +
        '<div class="result-box last">' +
        '<h3>Результат</h3>' +
        '<div id="chart" /><div id="savingsGoalsResult"/>' +
        '<hr><h3>Що я маю робити далі?</h3>' +
        '<ul><li>Порівнюйте умови депозитних рахунків щоб знайти найкращі відсотки</li><li>Налаштуйте автоматичне перерахування <span id="pmtAction"></span> на свій рахунок заощаджень</li><li>Використовуйте <a href="/budget.html">бюджетне планування</a> щоб з’ясувати, скільки ви можете дозволити собі заощаджувати</li></ul>' +
        '</div>' +
        '</div>';


    $("#savingsGoalsContainer").html(html);
}

//GENERIC FUNCTIONS
function cleanVal(id) {
    var n = $('#' + id).val().replace(/[^0-9.]/g, '');
    if (isNaN(n) || n.length < 1) { n = 0; }
    return parseFloat(n);
}

function formatNumber(number, digits, decimalPlaces, withCommas) {
    number = number.toString();
    var simpleNumber = '';

    // Strips out the dollar sign and commas.
    for (var i = 0; i < number.length; ++i) {
        if ("0123456789.".indexOf(number.charAt(i)) >= 0)
            simpleNumber += number.charAt(i);
    }

    number = parseFloat(simpleNumber);

    if (isNaN(number)) number = 0;
    if (withCommas === null) withCommas = false;
    if (digits === 0) digits = 1;

    var integerPart = (decimalPlaces > 0 ? Math.floor(number) : Math.round(number));
    var string = "";

    for (var i = 0; i < digits || integerPart > 0; ++i) {
        // Insert a comma every three digits.
        if (withCommas && string.match(/^\d\d\d/))
            string = "," + string;

        string = (integerPart % 10) + string;
        integerPart = Math.floor(integerPart / 10);
    }

    if (decimalPlaces > 0) {
        number -= Math.floor(number);
        number *= Math.pow(10, decimalPlaces);

        string += "." + formatNumber(number, decimalPlaces, 0);
    }

    return string;
}

// CALCULATIONS
// NPER - returns the number of periods for an investment based on an interest rate and a constant payment schedule
function NPER(rate, pmt, pv, fv, type) {
    if (type === undefined) { type = 0; }
    var num = pmt * (1 + rate * type) - fv * rate;
    var den = (pv * rate + pmt * (1 + rate * type));
    if (rate === 0) { return -(fv + pv) / pmt; } else { return Math.log(num / den) / Math.log(1 + rate); }
}

// PMT - returns the payment amount for a loan based on an interested rate and a constant payment schedule
function PMT(rate, nper, pv, fv, type) {
    var result;
    if (rate === 0) {
        result = (pv + fv) / nper;
    } else {
        var term = Math.pow(1 + rate, nper);
        if (type === 1) {
            result = (fv * rate / (term - 1) + pv * rate / (1 - 1 / term)) / (1 + rate);
        } else {
            result = fv * rate / (term - 1) + pv * rate / (1 - 1 / term);
        }
    }
    return -result;
}

// PV - returns the present value of an investent based on an interest rate and a constant payment schedule
function PV(rate, nper, pmt, fv, type) {
    if (type === undefined) { type = 0; }
    if (rate === 0) {
        return -pmt * nper - fv;
    } else {
        return (((1 - Math.pow(1 + rate, nper)) / rate) * pmt * (1 + rate * type) - fv) / Math.pow(1 + rate, nper);
    }
}

// FV - returns the future value of an investent based on an interest rate and a constant payment schedule
function FV(rate, nper, pmt, pv, type) {
    var fv;
    if (rate === 0) {
        fv = pv + pmt * nper;
    } else {
        var term = Math.pow(1 + rate, nper);
        if (type === 1) {
            fv = pv * term + pmt * (1 + rate) * (term - 1.0) / rate;
        } else {
            fv = pv * term + pmt * (term - 1) / rate;
        }
    }
    return -fv;
}

function drawChart(initial, savings, interest, months, lastColLabel) {
    if (months) { xlabel = 'Місяців'; } else { xlabel = 'Років'; }
    var chart = new Highcharts.Chart({
        chart: { renderTo: 'chart', type: 'column', marginBottom: 50 },
        colors: ['#42BFC7', '#0047F5', '#1F1247'],
        credits: { enabled: false },
        legend: { enabled: false },
        title: { text: null },
        xAxis: { min: 1, title: { text: xlabel + '' }, allowDecimals: false, minPadding: 0, maxPadding: 0 },
        yAxis: { title: { text: 'Заощадження' }, endOnTick: false },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                }
            },
            series: { borderWidth: 0, shadow: false, groupPadding: 0.1, pointPadding: 0.05 }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            borderColor: '#42BFC7',
            formatter: function() {
                var s = this.x;
                if (s == 1) { s = xlabel; } else { s = xlabel + ''; }
                s = 'Після ' + this.x + ' ' + s;
                if (lastColLabel.length > 0 && initial.length - 1 == this.x) { s = 'Після ' + lastColLabel; }
                s = '<table class="chart-tooltip">' +
                    '<tr><th colspan="2">' + s + '</th></tr>' +
                    '<tr><td><span style="display:inline-block;width:15px;height:12px;margin-right:5px;background-color:#1F1247"></span>Початкова сума</td><td class="num">₴' + formatNumber(this.points[2].y, 0, 0, true) + '</td></tr>' +
                    '<tr><td><span style="display:inline-block;width:15px;height:12px;margin-right:5px;background-color:#0047F5"></span>Регулярні внески</td><td class="num">₴' + formatNumber(this.points[1].y, 0, 0, true) + '</td></tr>' +
                    '<tr><td><span style="display:inline-block;width:15px;height:12px;margin-right:5px;background-color:#42BFC7"></span>Відсотки</td><td class="num">₴' + formatNumber(this.points[0].y, 0, 0, true) + '</td></tr>' +
                    '<tr><td><strong>Всього</strong></td><td class="num"><strong>₴' + formatNumber(this.points[0].y + this.points[1].y + this.points[2].y, 0, 0, true) + '</strong></td></tr>' +
                    '</table>';
                return s;
            }
        },
        series: [{
            name: 'Відсотки',
            data: interest
        }, {
            name: 'Внески',
            data: savings
        }, {
            name: 'Спочатку',
            data: initial
        }]
    });
}