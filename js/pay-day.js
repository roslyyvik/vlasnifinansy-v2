/* Changelog
            20140704 - Changed HTML/CSS to be responsive
            20161215 - Updated to match new global CSS/JS
            */

//GLOBAL VARS
var CALC_NAME = 'позики до зарплати';

$(document).ready(function() {

    //Draw calculator framework
    DrawCalculator();

    //blur on enter key
    $('input').on('keypress', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

    // VALIDATION
    $('#paydayLoanContainer input').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
    $('#paydayLoanContainer input[type="text"]').focus(function() {
        this.select();
        $(this).removeClass('empty');
        if ($('input.empty:visible').length == 0) { $('#paydayLoanContainer .label-required').remove(); }
    });
    $('#paydayLoanContainer input[type="text"]').mouseup(function(e) { e.preventDefault(); });
    $('#paydayLoanContainer input[type="text"]').blur(function() {
        if (this.id == 'pv' && cleanVal('pv') > 200000) { $(this).val(200000); } // set a max pv of ₴200,000
        if (this.id == 'feeEst' && cleanVal('feeEst') > 5) { $(this).val('5') } // max establishment fee of 5%
        if (this.id == 'feeMonth' && cleanVal('feeMonth') > 60) { $(this).val('60') } // max monthly fee of 4%
        if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)) };
        if ($(this).hasClass('interest')) { $(this).val(formatNumber($(this).val(), 0, 2, true) + '%') };
        if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років') };
        calculate();
    });
    $('#paydayLoanContainer select').change(function() { calculate(); });
    $('input.int').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
    $('input.float').keyup(function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers

    //explore
    $(".explore h4").click(function(event) {
        $(this).toggleClass('open');
        $(this).nextAll("div.more:first").slideToggle();
    });
    $('.explore h4:last').append('<span class="icon"/>');
    $('.explore h4.actions').prepend('<span class="icon-actions"/>');

    // GA TRACKING
    //track inputs
    // $('#paydayLoanContainer input').on('blur', function(event) {
    //     moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input - ' + $(this).parents('p').children('label').html(), $(this).val(), 0);
    // });
    // $('#paydayLoanContainer select').on('change', function(event) {
    //     moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Select - ' + $(this).parents('p').children('label').html(), $(this).children("option:selected").html(), 0);
    // });
    // //track expanding explore scenario
    // $('#paydayLoanContainer .explore h4').on('click', function(event) {
    //     moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Explore scenario', $(this).text(), 0);
    // });

});

//HTML
function DrawCalculator() { // CALCULATOR FRAMEWORK HTML

    var html = '<h2 class="shaded">Калькулятор ' + CALC_NAME + '</h2>' +
        '<div class="flex"><div class="break"><p class="label-required">обов\'язкове поле</p><h3>Умови кредиту</h3>' +
        '<p><label for="pv">Сума кредиту:<br/><span>(макс ₴200,000)</span></label><input id="pv" inputmode="numeric" type="text" class="dollars int empty" /></p>' +
        '<p><label for="nper">Термін кредиту:<br/><span>(мін 16 днів, макс 1 рік)</span></label><input id="nper" inputmode="numeric" type="text" class="int empty" />' +
        '<label for="nperFreq" class="offScreen">Періодичність повернення позики:</label><select id="nperFreq">' +
        '<option value="365">Щоденно</option>' +
        '<option value="52">Щотижнево</option>' +
        '<option value="26" selected="selected">Двотижнево</option>' +
        '<option value="12">Щомісяця</option>' +
        '</select></p>' +
        '</div>' +
        '<div class="break result"><div class="result-box last"><h3>Результати</h3><div id="paydayLoanResult"/></div></div></div>';
    $("#paydayLoanContainer").html(html);
}

//CALCULATIONS
function calculate() {
    if ($('input.empty:enabled').length > 0) { $('#paydayLoanResult').html(''); return false; }
    var pv = cleanVal('pv');
    var nper = cleanVal('nper');
    var nperFreq = cleanVal('nperFreq');

    if (nperFreq === 365 && nper < 16) {
        nper = 16;
        $('#nper').val(nper);
    } // minimum 16 days
    if (nperFreq === 52 && nper < 3) {
        nper = 3;
        $('#nper').val(nper);
    } // minimum 3 weeks
    if (nperFreq === 26 && nper < 2) {
        nper = 2;
        $('#nper').val(nper);
    } // minimum 2 fortnights
    if (nperFreq === 365 && nper > 365) {
        nper = 365;
        $('#nper').val(nper);
    } // max 365 days
    if (nperFreq === 52 && nper > 52) {
        nper = 52;
        $('#nper').val(nper);
    } // max 52 weeks
    if (nperFreq === 26 && nper > 26) {
        nper = 26;
        $('#nper').val(nper);
    } // max 26 fortnights
    if (nperFreq === 12 && nper > 12) {
        nper = 12;
        $('#nper').val(nper);
    } // max 12 months

    var html = '';
    var feeEst = 0.05; // 5% //cleanVal('feeEst') / 100;
    var feeMonth = 0.6; // 60% //cleanVal('feeMonth') / 100;
    //calculated values
    nper = nper / nperFreq * 12; // set the nper base to months
    nper = Math.ceil(nper); // round up to the next month
    feeEst = pv * feeEst;
    //if ( feeEst > 400 ) { feeEst = 400; html = '(capped at $400)'; } // cap the establishment fee at $400 (only used for medium amount loans)
    feeMonth = pv * feeMonth;
    var total = pv + feeEst + feeMonth * nper;
    var totalFees = feeEst + feeMonth * nper;

    var fortnights = Math.ceil(cleanVal('nper') / nperFreq * 26);

    html = '<p>Сума заборгованості: <span>₴' + formatNumber(pv, 0, 2, true) + '</span></p>' +
        '<p>Комісія за надання кредиту:  (5% від суми кредиту)' + html + '<span>₴' + formatNumber(feeEst, 0, 2, true) + '</span></p>' +
        '<p>Щомісячна комісія: (<button class="tooltip dotted">60% кожного місяця <span class="tooltiptext">₴' + formatNumber(feeMonth, 0, 2, true) + ' за місяць x ' + nper + ' місяців = ₴' + formatNumber(feeMonth * nper, 0, 2, true) + '</span></button>)<span>₴' + formatNumber(feeMonth * nper, 0, 2, true) + '</span></p>' +
        //'<p style="font-weight:bold">Total fees: <span>$'+formatNumber( totalFees, 0, 2, true)+'</span></p>'+
        '<p><strong>Всього до сплати: <span>₴' + formatNumber(total, 0, 2, true) + '</span></strong></p>' +
        '<p style="line-height:1.7rem"><strong>Двотижневі сплати: (' + fortnights + ' платежів) <span class="enlarge-text">₴' + formatNumber(total / fortnights, 0, 2, true) + '</span></strong></p>' +
        '<p>Плата встановлюється на максимальному рівні, який може стягувати позикодавець.</p>';
    $('#paydayLoanResult').html(html);
    $('#paydayLoanContainer .result').show();
    // dataLayer.push({ event: 'calculatorCompleted', paydayLoanData: serializeData(document.getElementById('paydayLoanContainer')) });
    //dataLayer.push({ event: 'calculatorCompleted' });
    //serializeData(document.getElementById('paydayLoanContainer'));
}

//GENERIC FUNCTIONS
function cleanVal(id) {
    var n = $('#' + id).val().replace(/[^0-9.]/g, '');
    if (isNaN(n) || n.length < 1) { n = 0 }
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
    if (withCommas == null) withCommas = false;
    if (digits == 0) digits = 1;

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

var changeCount = 0;
/*
 * Example output
 * 2000|20|26|1|v1
 */
function serializeData(container) {
    var version = "v1";
    changeCount++;
    var data = '';
    var inputs = container.querySelectorAll('input,select');
    var loopCnt = 0;
    inputs.forEach(function(input) {
        loopCnt++;
        var skip = false;
        var inputVal = input.value;
        if (input.classList.contains('dollars')) {
            inputVal = inputVal.replace(/\D+/g, '');
        }
        inputVal = inputVal.replace('%', '');
        inputVal = inputVal.replace(' років', '');
        if (input.type === 'radio' && input.checked === false) {
            skip = true;
        }
        if (skip === false) {
            data += inputVal + '|';
        }
    });

    data += changeCount.toString() + "|" + version;
    //console.log(data);
    return data;
    /*
                    window.dataLayer.push({
                        'paydayLoanData': data,
                    });
    */
}