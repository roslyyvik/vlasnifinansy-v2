//GLOBAL VARS
var URL = window.location.href.toLowerCase();
var CALC_NAME = 'Іпотекою';
var CALC_STYLE = '';
// var CALC_NAME = 'Кредитом';
var changeCount = 0;
var rateData;

//get latest RBA data            
rateData = {
    lastUpdated: "November 2020",
    ownerOccupied_InterestOnly: "3.27",
    ownerOccupied_PrincipalAndInterest: "2.54",
    investment_InterestOnly: "3.10",
    investment_PrincipalAndInterest: "2.87"
};

if (URL.indexOf("personal-loan-calculator") !== -1) {
    CALC_NAME = 'Кредитом';
}

if (URL.indexOf('mortgage-calculator') === -1 && CALC_NAME === 'Іпотекою') { CALC_STYLE = 'mini'; }


//CALC_STYLE = ''; //TEMP
if (CALC_STYLE === 'mini') {
    document.getElementById("content").classList.add("interest-rate-only");
}

//TODO: Remove comment when launch
// if (URL.indexOf(CALC_NAME.toLowerCase()) === -1) { CALC_NAME = 'Personal loan'; } //if 'mortgage' is not in the URL change the name to loan


var calcUserData = {
    calculatorName: 'Іпотекою',
    defaultInterestRate: true,
    showInterestRate: true,
    settingsStorageName: 'MSsettingsDataMortgage', // name of local storage object to save to and restore settings from

    init: function() {

        if (typeof(Storage) === 'undefined' || CALC_STYLE === 'mini') {
            //no local storage or mini, use default to show/hide interest rate box
            this.showInterestRate = calcUserData.defaultInterestRate;
        } else {
            if (this.settingsStorageName !== "") {
                var calcSettingsData = JSON.parse(localStorage.getItem(calcUserData.settingsStorageName));
                if (calcSettingsData !== null) {
                    if (typeof calcSettingsData['showInterestRate'] !== 'undefined') {
                        if (calcSettingsData['showInterestRate'] === 1) {
                            this.showInterestRate = true;
                            dataLayer.push({ 'mortgageCalcBeta': true });
                        } else {
                            this.showInterestRate = false;
                        }
                    }
                } else {
                    //no settings so create default
                    calcSettingsData = {};
                    calcSettingsData['showInterestRate'] = (calcUserData.defaultInterestRate === true ? 1 : 0);
                    var lsName = this.settingsStorageName;
                    localStorage.setItem(lsName, JSON.stringify(calcSettingsData));
                }
            }
        }
        calcUserData.setCalc();
        calcUserData.buildInterface();
    },

    updateSetting: function(setting, newVal) {
        newVal === 1 ? calcUserData.showInterestRate = true : calcUserData.showInterestRate = false;
        if (typeof(Storage) !== 'undefined') {
            var calcSettingsData = {};
            calcSettingsData[setting] = newVal;
            localStorage.setItem(calcUserData.settingsStorageName, JSON.stringify(calcSettingsData));
        }
        calcUserData.setCalc();
        moneysmartjs.trackEvent('Calculator - ' + CALC_NAME + ': BETA box', 'Use BETA', newVal === 1 ? 'true' : 'false');
        dataLayer.push({ 'mortgageCalcBeta': (newVal === 1 ? true : false) });
    },

    buildInterface: function() {
        //attach interface
        var html = '';
        html += '<div class="smartTip" id="autosave">';
        html += '   <div class="autosave-heading">';
        html += '       <p>Use the new version of the Mortgage calculator</p>';
        html += '       <p><input type="checkbox"' + (calcUserData.showInterestRate ? 'checked="checked"' : '') + ' id="toggle-autosave" class="toggle-checkbox" /> <label for="toggle-autosave" class="switch"></label></p>';
        html += '   </div>';
        html += '   <p>The new calculator lets you select an average interest rate based on the type of loan. Give it a try &ndash; we\'re keen to get your feedback.</p>';
        html += '</div>';

        $('#content').prepend(html);

        // add event listeners
        $(document).on('click', '#toggle-autosave', function() {
            if (!this.checked) {
                // turn off BETA
                calcUserData.updateSetting('showInterestRate', 0);
            } else {
                // turn on BETA
                calcUserData.updateSetting('showInterestRate', 1);
            }
        });
    },

    setCalc: function() {
        // show or hide interest rate box depending on setting
        if (calcUserData.showInterestRate) {
            document.getElementById("interest-rate").style.display = "block";
            $('.inline-interest-rate').css('display', 'inline');
        } else {
            document.getElementById("interest-rate").style.display = "none";
            $('.inline-interest-rate').css('display', 'none');
        }
    }
};


$(document).ready(function() {

    //Draw calculator
    DrawCalculator();
    checkHashBang(); // check if we need to show a specific calc on load

    // keyboard accessibility
    //$('#calculator-container h4').attr( {'tabindex': '0', 'role': 'button'} );
    $('#calculator-container').on('keydown', '[role="button"]', function(e) { // watch for keyboard clicks on all buttons
        var key = e.which; // 13 = Return, 32 = Space
        if ((key === 13) || (key === 32)) { $(this).click(); }
    });

    // url management
    $(window).on('hashchange', function() { checkHashBang(); });

    function checkHashBang() {
        var hashBang = window.location.hash;
        if (hashBang.substring(0, 1) == "#") { hashBang = hashBang.substring(1, hashBang.length); } else { hashBang = ''; }
        if (hashBang) {
            var el = document.getElementById(hashBang);
            if (el !== null) {
                var top = document.getElementById(hashBang).offsetTop;
                var rem = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'));
                var headerHeight = document.querySelector('header').offsetHeight;
                window.scroll(0, (top - headerHeight - 1 * rem));
            }
        }
    }

    //blur on enter key
    $('input').on('keypress', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

    //validate inputs
    //set the min and max loan
    $('#repay-length1, #repay-length1-explore, #length1, #length1-explore').blur(function() {
        if ($(this).val() < 1) { $(this).val(1); }
        if ($(this).val() > 30 && CALC_NAME === 'Іпотекою') { $(this).val(30); }
        if ($(this).val() > 15 && CALC_NAME === 'Кредитом') { $(this).val(15); }
    });
    //set a cap of 50% interest rate
    $('#repay-rate1, #repay-rate1-explore, #rate1, #rate1-explore, #howlong-rate1, #howlong-rate1-explore').blur(function() { if ($(this).val() > 50) { $(this).val(50); } });
    //the repayment can't be less than the fees so adjust if its too low
    //$('#payment1').blur(function () { alert( $(this).val() ) });

    $('#calculator-container input[type="text"]').focus(function() {
        this.select();
        $(this).removeClass('empty');
        if ($('#repayments input.empty:visible').length == 0) { $('#repayments .label-required').remove(); }
        if ($('#howlong input.empty:visible').length == 0) { $('#howlong .label-required').remove(); }
        if ($('#borrow input.empty:visible').length == 0) { $('#borrow .label-required').remove(); }
    });
    $('#calculator-container input[type="text"]').mouseup(function(e) { e.preventDefault(); });
    $('#calculator-container input[type="text"]').blur(function() {
        if (this.value.length < 1) { this.value = (this.defaultValue); }
        if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)); }
        if ($(this).hasClass('interest')) { $(this).val(formatNumber($(this).val(), 0, 2, true) + '%'); }
        if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років'); }
    });
    $('input.int').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
    $('input.float').keyup(function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers

    // Update the interest rate only on the first time the explore open is opened
    var howlongRateSet = true;
    $('#howlong .explore h4').click(function(event) {
        if (howlongRateSet && $('#howlong-rate1').val().length > 0) {
            $('#howlong-rate1-explore').val($('#howlong-rate1').val()).removeClass('empty');
            howlongRateSet = false;
        }
    });

    $(document).on('click', '.whatif', function() { $(this).parents('.tab').find('.explore h4').trigger('click'); });
    $('.explore').on('click', 'h4', function() {
        $(this).toggleClass('open');
        $(this).nextAll('div.more').slideToggle();
        $(this).parents('.tab').find('input').first().blur();
    });
    $('.explore h4').append('<span class="icon"/>');

    //CALCULATE - had to use multiple selectors because not attaching correctly in <ie10
    $('#repayments').on('change', 'select', function() { CalculateRepayments(this); });
    $('#repayments').on('blur', 'input', function() { CalculateRepayments(this); });
    $('#borrow').on('change', 'select', function() { CalculateBorrowAmount(this); });
    $('#borrow').on('blur', 'input', function() { CalculateBorrowAmount(this); });
    $('#howlong').on('change', 'select', function() { CalculateHowlong(this); });
    $('#howlong').on('blur', 'input', function() { CalculateHowlong(this); });

    //if this is the personal loan calculator change some of the defaults
    if (CALC_NAME === 'Кредитом') { $('#repay-length1, #repay-length1-explore, #length1, #length1-explore').val('5 років'); }
    // if this is mortgage calculator add a tip to the borrowing tab
    if (CALC_NAME === 'Іпотекою') { $('#borrow .inline-result').append('<br/><span style="font-weight:normal;font-size:1em;color:#333333"><strong>Порада:</strong> Використовуйте альтернативний сценарій з врахуванням коливання відсотків та зростання інфляції.</span>'); }

    //INTEREST RATE PICKER
    if (CALC_NAME === 'Іпотекою') {

        //add in button under each interest rate field !!!!!!!!
        // $('.interest').after('<span class="inline-interest-rate"><br><button>use avg rate (<span class="interest-rate-val"></span>)</button></span>');

        $('.interest-rate-val').html(CalculateInterestRate($('#loan-type').val(), $('#repayment-type').val())); //set on load

        //If 'My interest rate' fields change
        $('#interest-rate').on('change', '#loan-type, #repayment-type', function() {
            $('.interest-rate-val').html(CalculateInterestRate($('#loan-type').val(), $('#repayment-type').val()));
        });

        //Interest rate button clicked - set textbox and recalculate
        $('.inline-interest-rate button').click(function(event) {
            var val = $(this).find('span').text();
            val.replace("%", "");

            var $input = $(this).parent().parent().find('input');
            $input.val(val);
            $input.removeClass('empty');

            // work out what container button was in to recalculate
            var $rateContainer = $(this).parent().parent().parent().parent();
            if ($rateContainer.hasClass('alternative')) {
                $rateContainer = $rateContainer.parent().parent().parent();
            }
            if ($rateContainer.attr('id') === 'repayments') {
                CalculateRepayments(document.getElementById($input.attr('id')));
            } else if ($rateContainer.attr('id') === 'borrow') {
                CalculateBorrowAmount(document.getElementById($input.attr('id')));
            } else if ($rateContainer.attr('id') === 'howlong') {
                CalculateHowlong(document.getElementById($input.attr('id')));
            }

            moneysmartjs.trackEvent('Calculator - ' + CALC_NAME + ': ' + $input.parents('p').children('label').html(), 'Interest rate picker - ' + $input.attr('id'), val);
        });

        //calcUserData.init(); //check whether interest rate box should be visible
    }


    //ANALYTICS
    // $('#calculator-container').on('change', 'select', function(event) {
    //     moneysmartjs.trackEvent('Calculator - ' + CALC_NAME + CALC_STYLE + ': ' + $(this).parents('p').children('label').html(), 'Select - ' + this.id, $(this).children("option:selected").text());
    // });
    // $('#calculator-container').on('blur', 'input', function(event) {
    //     moneysmartjs.trackEvent('Calculator - ' + CALC_NAME + CALC_STYLE + ': ' + $(this).parents('p').children('label').html(), 'Input - ' + this.id, $(this).val());
    // });

});

/**
 * @return {string}
 */
function CalculateInterestRate(loanType, repaymentType) {
    if (loanType === "owner-occupier" && repaymentType === "interest-only") {
        return rateData.ownerOccupied_InterestOnly + "%";
    } else if (loanType === "owner-occupier" && repaymentType === "principal-and-interest") {
        return rateData.ownerOccupied_PrincipalAndInterest + "%";
    } else if (loanType === "investment" && repaymentType === "interest-only") {
        return rateData.investment_InterestOnly + "%";
    } else if (loanType === "investment" && repaymentType === "principal-and-interest") {
        return rateData.investment_PrincipalAndInterest + "%";
    } else {
        return "";
    }
}

function DrawCalculator() { // CALCULATOR HTML
    var html = '<div class="calc-container" id="interest-rate"/><div class="calc-container" id="repayments"/><div class="calc-container" id="borrow"/><div class="calc-container" id="howlong"/>';
    $("#calculator-container").html(html);

    // Interest rate helper if Mortgage. Change 287 str. Mortgage to Іпотекою
    if (CALC_NAME == "Mortgage") // Іпотекою  
    {
        html = '<h2><span>My interest rate</span></h2>' +
            '<div class="flex input">' +
            '<p>Choose your loan and repayment types to see the average interest rate for new home loans in ' + rateData.lastUpdated + '</p>' +
            '<p><label for="loan-type">Loan type</label><select id="loan-type"><option selected="selected" value="owner-occupier">Owner occupier</option><option value="investment">Investment</option></select></p>' +
            '<p><label for="repayment-type">Repayment type</label><select id="repayment-type"><option selected="selected" value="principal-and-interest">Principal and interest</option><option value="interest-only">Interest only</option></select></p>' +
            '<p class="interest-value-container"><label>Avg interest rate ' + rateData.lastUpdated + '</label><span class="interest-rate-val"></span></p>' +
            '</div>';
        $("#interest-rate").html(html);
    }
    // How much will my repayments be?
    // html = '<h2>Скільки сплатите за ' + CALC_NAME.toLowerCase() + ' ?</h2>' +
    html = '<h2>Яку суму зможу вилучати регулярно?</h2>' +
        '<div class="flex input">' +
        '<p class="label-required">обов\'язкове поле</p>' +
        '<h3 class="col100">Умови</h3>' +
        '<p><label for="repay-amount1">Сума заощаджень:</label><input type="text" inputmode="numeric" id="repay-amount1" class="dollars int empty"/></p>' +
        '<p><label for="repay-rate1">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="repay-rate1" class="interest float empty"/></p>' +
        '<p><label for="repay-freq1">Періодичність вилучення:</label><select class="frequency-select" id="repay-freq1"/></p>' +
        '<p><label for="repay-length1">Термін вилучення:</label><input type="text" inputmode="numeric" id="repay-length1" value="25 років" class="years int"/></p>' +
        '<p><label for="repay-fee1">Комісії за вилучення:</label><input type="text" inputmode="numeric" id="repay-fee1" value="₴100" class="dollars int"/></p>' +
        '<p><label for="repay-feefreq1">Періодичність сплати комісійних:</label><select class="frequency-select" id="repay-feefreq1"/></p>' +
        '<div class="result col100">' +
        '<h3 class="col100">Всього до вилучення <button class="tooltip"><span class="tooltiptext">Загальна сума, яку ви зможете вилучити протягом запланованого терміну.</span></button></h3>' +
        '<div class="chart result-box col100"/>';
    // How much will my repayments be? Explore
    html = html + '<p class="inline-result col100">Ваші вилучення складуть: <span class="enlarge-text"></span></p>' +
        '<div class="alternative col100">' +
        '<h4 class="col100">Розгляньте альтернативу</h4>' +
        '<div class="alternative-fields">' +
        '<p><label for="repay-rate1-explore">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="repay-rate1-explore" class="small interest float empty"/></p>' +
        '<p><label for="repay-amount1-explore">Сума заощаджень:</label><input type="text" inputmode="numeric" id="repay-amount1-explore" class="small dollars int empty"/></p>' +
        '<p class="explore-select"><label for="repay-freq1-explore">Періодичність вилучення:</label><select class="frequency-select" id="repay-freq1-explore"/></p>' +
        '<p><label for="repay-length1-explore">Термін вилучення:</label><input type="text" inputmode="numeric" id="repay-length1-explore" value="25 років" class="small years int"/></p>' +
        '</div></div></div></div>';
    $("#repayments").html(html);


    // How much can I borrow?
    html = '<h2>Яка сума заощаджень мені потрібна?</h2>' +
        '<div class="flex input">' +
        '<p class="label-required">обов\'язкове поле</p>' +
        '<h3 class="col100">Умови</h3>' +
        '<p><label for="payment1">Сума до вилучення:</label><input type="text" inputmode="numeric" id="payment1" class="dollars int empty"/></p>' +
        '<p><label for="freq1">Періодичність вилучення:</label><select class="frequency-select" id="freq1"/></p>' +
        '<p><label for="rate1">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="rate1" class="interest float empty"/> </p>' +
        '<p><label for="length1">Термін вилучення:</label><input type="text" inputmode="numeric" id="length1" value="25 років" class="years int"/></p>' +
        '<p><label for="fee1">Комісійні за вилучення:</label><input type="text" inputmode="numeric" id="fee1" value="₴100" class="dollars int"/></p>' +
        '<p><label for="feefreq1">Періодичність сплати комісійних:</label><select class="frequency-select" id="feefreq1"/></p>' +
        '<div class="result col100">' +
        '<h3 class="col100">Всього до вилучення <button class="tooltip"><span class="tooltiptext">Загальна сума, яку ви зможете вилучити протягом запланованого терміну.</span></button></h3>' +
        '<div class="chart result-box col100"/>';
    // How much can I borrow? Explore
    html = html + '<p class="col100 inline-result">Необхідна сума заощаджень: <span class="enlarge-text"/></p>' +
        '<div class="alternative col100">' +
        '<h4 class="col100">Розгляньте алтернативу</h4>' +
        '<div class="alternative-fields">' +
        '<p><label for="rate1-explore">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="rate1-explore" class="small interest float empty"/> </p>' +
        '<p><label for="payment1-explore">Сума до вилучення:</label><input type="text" inputmode="numeric" id="payment1-explore" class="small dollars int empty"/><select class="frequency-select" id="freq1-explore"/></p>' +
        '<p><label for="length1-explore">Термін вилучення:</label><input type="text" inputmode="numeric" id="length1-explore" value="25 років" class="small years int"/></p>' +
        '</div></div></div></div>';
    $("#borrow").html(html);


    // How can I repay my loan sooner?
    html = '<h2>На скільки вистачить накопиченої суми?</h2>' +
        '<div class="flex input">' +
        '<p class="label-required">обов\'язкове поле</p>' +
        '<h3 class="col100">Умови</h3>' +
        '<p><label for="howlong-amount1">Сума накопичень:</label><input type="text" inputmode="numeric" id="howlong-amount1" class="dollars int empty"/></p>' +
        '<p><label for="howlong-payment1">Сума до вилучення:</label><input type="text" inputmode="numeric" id="howlong-payment1" class="dollars int empty"/></p>' +
        '<p><label for="howlong-payment1">Періодичність вилучення:</label><select class="frequency-select" id="howlong-freq1"/></p>' +
        '<p><label for="howlong-rate1">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="howlong-rate1" class="interest float empty"/></p>' +
        '<p><label for="howlong-fee1">Комісійні за вилучення:</label><input type="text" inputmode="numeric" id="howlong-fee1" value="₴100" class="dollars int"/></p>' +
        '<p><label for="howlong-feefreq1">Періодичність сплати комісійних:</label><select class="frequency-select" id="howlong-feefreq1"/></p>' +
        '<div class="result col100">' +
        '<h3 class="col100">Всього до вилучення <button class="tooltip"><span class="tooltiptext">Загальна сума, яку ви зможете вилучити протягом запланованого терміну.</span></button></h3>' +
        '<div class="chart result-box col100"/>';
    // How can I repay my loan sooner? Explore
    html = html + '<p class="col100 inline-result">Термін вилучення: <span class="enlarge-text"/></p>' +
        '<div class="alternative col100">' +
        '<h4 class="col100">Розгляньте альтернативу</h4>' +
        '<div class="alternative-fields">' +
        '<p><label for="howlong-rate1-explore">Відсоткова ставка:</label><input type="text" inputmode="decimal" id="howlong-rate1-explore" class="interest float empty"/></p>' +
        '<p><label for="howlong-payment1-explore">Сума вилучення:</label><input type="text" inputmode="numeric" id="howlong-payment1-explore" class="dollars int empty"/><select class="frequency-select" id="howlong-freq1-explore"/></p>' +
        '</div></div></div></div>';
    $("#howlong").html(html);

    // add the frequency options to the select boxes
    html = '<option value="1">Щорічно</option><option value="4">Щокварталу</option>' +
        '<option value="12" selected="selected">Щомісяця</option>' +
        '<option value="26">Двотижнево</option><option value="52">Щотижнево</option>';
    $('#calculator-container .frequency-select').html(html);
    $('.tab > div').hide();
}


//global vars
var borrowChart;
var repaymentsChart;
var howlongChart;
repayExplore = true;
borrowExplore = true;

function CalculateRepayments(lastEl) {
    if ($('#repayments input:visible.empty').length > 0 && $('#repayments .result').css("display") == "none") { return false; }
    //actual
    var rate = parseFloat($("#repay-rate1").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per = parseInt($("#repay-freq1").val()); //number of periods (eg. 12 = 1 year)
    var years = parseInt($("#repay-length1").val().replace(/[^0-9]/g, ''));

    if (years < 1) { years = 1; }
    if (years > 30 && CALC_NAME === 'Іпотекою') { years = 30 }
    if (years > 15 && CALC_NAME === 'Кредитом') { years = 15; }

    var nper = years * per; //total number of payment periods (eg. 20 years * 12 months = 240)
    var pv = parseFloat($("#repay-amount1").val().replace(/[^0-9\.]/g, '')); //payment made each period (enter as negative)
    var fee = parseFloat($("#repay-fee1").val().replace(/[^0-9\.]/g, ''));
    var feeFreq = parseInt($("#repay-feefreq1").val());
    var fv = 0; //future value
    var fees = parseFloat((fee * feeFreq) / (per)); // fee per repayment period
    var pmt = parseFloat(PMT((rate / 100) / per, years * per, -pv, fv, 0)) - fees; //payment made each period
    var result = pmt * per * years;
    var principal = pv;
    var interest = result - principal;
    var label = '<span style="font-weight:bold;color:#333;font-size:1rem;">Деталі</span><br><span style="color:#333;">Вилучення </span><span style="color:#333;font-weight:bold">₴' + formatNumber(pmt, 0, 0, true) + '</span><span style="color:#333;">' + freqString(per) + '</span><br/>' + rate + '% протягом ' + years + ' років';
    $("#repayments .inline-result span").text(' ₴ ' + formatNumber(pmt, 0, 0, true) + freqString(per));

    // blank out the what if results, if amount borrowed is zero
    if (pv === 0 || isNaN(pv) || isNaN(rate)) {
        label = '';
        principal = 0;
        interest = 0;
    }

    //explore scenario
    var rate1 = parseFloat($("#repay-rate1-explore").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per1 = parseInt($("#repay-freq1-explore").val()); //number of periods (eg. 12 = 1 year)
    var years1 = parseInt($("#repay-length1-explore").val().replace(/[^0-9]/g, ''));
    if (years1 < 1) { years1 = 1; }
    if (years1 > 30 && CALC_NAME === 'Іпотекою') { years1 = 30 }
    if (years1 > 15 && CALC_NAME === 'Кредитом') { years1 = 15; }
    var nper1 = years1 * per1; //total number of payment periods (eg. 20 years * 12 months = 240)
    var pv1 = parseFloat($("#repay-amount1-explore").val().replace(/[^0-9\.]/g, '')); //payment made each period (enter as negative)
    var fees1 = parseFloat((fee * feeFreq) / (per1)); // fee per repayment period
    if (pv1 === 0) { fees1 = 0; }
    var pmt1 = parseFloat(PMT((rate1 / 100) / per1, years1 * per1, -pv1, fv, 0)) - fees1; //payment made each period
    var result1 = pmt1 * per1 * years1;
    var principal1 = pv1;
    var interest1 = result1 - principal1;
    var label1 = '<span style="font-weight:bold;color:#333;font-size:1rem;">Альтернатива</span><br /><span style="color:#333;">Вилучення </span><span style="color:#333;font-weight:bold">₴' + formatNumber(pmt1, 0, 0, true) + '</span><span style="color:#333;">' + freqString(per1) + '</span><br/>' + rate1 + '% протягом ' + years1 + ' років';

    // blank out the what if results, if amount borrowed is zero
    if (pv1 === 0 || isNaN(pv1) || isNaN(rate1)) {
        label1 = '';
        principal1 = 0;
        interest1 = 0;
    }

    // blank out the what if results, if hidden
    //if ( !$('#repayments .explore h4').hasClass('open') ) { label1 = ''; principal1 = 0; interest1 = 0; }

    //chart
    if (repaymentsChart === undefined) { //we need to create the chart on first use

        var html = '<div id="repayments-chart1" style="height: 315px; margin: 0 auto;"></div>';
        $("#repayments .chart").html(html);

        repaymentsChart = new Highcharts.Chart({
            chart: { renderTo: 'repayments-chart1', type: 'column', marginBottom: 90, marginTop: 30 },
            colors: ['#A6BEFC', '#4C7DF8', '#0146F5', '#BDF0F4', '#42BFC7', '#1F1247'],
            credits: { enabled: false },
            title: { text: null },
            xAxis: { categories: [label, label1], labels: { y: 30, style: { fontFamily: '\'Montserrat\', sans-serif', fontSize: '15px', color: '#333' } } },
            yAxis: {
                min: 0,
                title: { text: null },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontFamily: '\'Montserrat\', sans-serif',
                        fontSize: '15px',
                        color: '#333'
                    },
                    formatter: function() { return '₴' + formatNumber(this.total, 0, 0, true); }
                },
                labels: { style: { fontFamily: '\'Montserrat\', sans-serif', color: '#333' } }
            },
            legend: { backgroundColor: '#FFFFFF', reversed: true, enabled: false },
            tooltip: { formatter: function() { return this.series.name + ': ₴' + formatNumber(this.y, 0, 0, true); } },
            plotOptions: { series: { stacking: 'normal' } },
            series: [{
                name: 'Відсотки (зменшено на комісійні)',
                data: [{ y: interest, color: '#A6BEFC' }, { y: interest1, color: '#ACE8FA' }]
            }, {
                name: 'Заощадження',
                data: [{ y: principal, color: '#0146F5' }, { y: principal1, color: '#42BFC7' }]
            }]
        });


    } else {
        repaymentsChart.xAxis[0].setCategories([label, label1]);
        repaymentsChart.series[0].data[0].update(interest);
        repaymentsChart.series[1].data[0].update(principal);
        repaymentsChart.series[0].data[1].update(interest1);
        repaymentsChart.series[1].data[1].update(principal1);
    }

    $("#repayments .result").css('display', 'flex');
    if (CALC_NAME === 'Кредитом') {
        dataLayer.push({ event: 'calculatorCompleted', personalLoanData: serializeData(document.getElementById('calculator-container'), 'A', lastEl) });
    } else {
        dataLayer.push({ event: 'calculatorCompleted', mortgageCalcData: serializeData(document.getElementById('calculator-container'), 'A', lastEl) });
    }

    //serializeData(document.getElementById('calculator-container'), 'A', lastEl);
}

function CalculateBorrowAmount(lastEl) {

    if ($('#borrow input:visible.empty').length > 0 && $('#borrow .result').css("display") == "none") { return false; }

    var type = 0; // used for PV function
    //actual
    var rate = parseFloat($("#rate1").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per = parseInt($("#freq1").val()); //number of periods (eg. 12 = 1 year)
    var years = parseInt($("#length1").val().replace(/[^0-9]/g, ''));
    if (years < 1) { years = 1; }
    if (years > 30 && CALC_NAME === 'Іпотекою') { years = 30 }
    if (years > 15 && CALC_NAME === 'Кредитом') { years = 15; }
    var nper = years * per; //total number of payment periods (eg. 20 years * 12 months = 240)
    var pmt = parseFloat($("#payment1").val().replace(/[^0-9\.]/g, '')); //payment made each period
    var fee = parseFloat($("#fee1").val().replace(/[^0-9\.]/g, ''));
    var feeFreq = parseInt($("#feefreq1").val());
    var fv = 0; //future value
    var fees = (fee * feeFreq * years);
    var interest = (pmt * per * years) + fees; //interest including fees
    var label;

    //calculate actual
    var principal = PV((rate / 100) / per, nper, -pmt - ((fee * feeFreq) / per), fv, type);
    interest = interest - principal;

    if (principal <= 0) {
        interest = 0;
        principal = 0;
        $("#borrow .inline-result span:first").text("Увага! Для розрахунку необхідно ввести значення.");
        label = '<span style="color:#D84847">Увага! Для розрахунку необхідно ввести значення.</span>';
    } else {
        $("#borrow .inline-result span:first").text('₴' + formatNumber(principal, 0, 0, true));
        label = '<span style="font-weight:bold;color:#333;font-size:1rem;">Деталі</span><br><span style="color:#333;">Заощадження </span><span style="color:#333;font-weight:bold;">₴' + formatNumber(principal, 0, 0, true) + '</span><br/>' + rate + '% протягом ' + years + ' років';
    }

    // blank out the what if results, if amount borrowed is zero
    if (pmt === 0 || isNaN(pmt) || isNaN(rate)) {
        label = '';
        principal = 0;
        interest = 0;
    }

    //explore scenario
    var rate1 = parseFloat($("#rate1-explore").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per1 = parseInt($("#freq1-explore").val()); //number of periods (eg. 12 = 1 year)
    var years1 = parseInt($("#length1-explore").val().replace(/[^0-9]/g, ''));
    if (years1 < 1) { years1 = 1; }
    if (years1 > 30 && CALC_NAME === 'Іпотекою') { years1 = 30 }
    if (years1 > 15 && CALC_NAME === 'Кредитом') { years1 = 15; }
    var nper1 = years1 * per1; //total number of payment periods (eg. 20 years * 12 months = 240)
    var pmt1 = parseFloat($("#payment1-explore").val().replace(/[^0-9\.]/g, '')); //payment made each period
    var interest1 = (pmt1 * per1 * years1) + fees;
    var label1;

    //calculate explore scenario
    var principal1 = PV((rate1 / 100) / per1, nper1, -pmt1 - ((fee * feeFreq) / per1), fv, type);
    interest1 = interest1 - principal1;

    if (principal1 <= 0) {
        interest1 = 0;
        principal1 = 0;
        label1 = '<span style="color:#D84847">Увага! Для розрахунку необхідно ввести значення.</span>';
    } else {
        label1 = '<span style="font-weight:bold;color:#333;font-size:1rem;">Альтернатива</span><br><span style="color:#333;">Заощадження </span><span style="font-weight:bold;">₴' + formatNumber(principal1, 0, 0, true) + '</span><br/>' + rate1 + '% протягом ' + years1 + ' років';
    }

    // blank out the what if results, if amount borrowed is zero or explore is hidden
    if (pmt1 === 0 || isNaN(pmt1) || isNaN(rate1)) {
        label1 = '';
        principal1 = 0;
        interest1 = 0;
    }


    //chart
    if (borrowChart === undefined) { //we need to create the chart on first use

        var html = '<div id="chart1" style="height: 315px; margin: 0 auto;"></div>';
        $("#borrow .chart").html(html);

        borrowChart = new Highcharts.Chart({
            chart: { renderTo: 'chart1', type: 'column', marginBottom: 90, marginTop: 30 },
            colors: ['#ACE8FA', '#0047F5'],
            credits: { enabled: false },
            title: { text: null },
            xAxis: { categories: [label, label1], labels: { y: 30, style: { fontFamily: '\'Montserrat\', sans-serif', fontSize: '15px', color: '#333' } } },
            yAxis: {
                min: 0,
                title: { text: null },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontFamily: '\'Montserrat\', sans-serif',
                        fontSize: '15px',
                        color: '#333'
                    },
                    formatter: function() { return '₴' + formatNumber(this.total, 0, 0, true); }
                },
                labels: { style: { fontFamily: '\'Montserrat\', sans-serif', color: '#333' } }
            },
            legend: { backgroundColor: '#FFFFFF', reversed: true, enabled: false },
            tooltip: { formatter: function() { return this.series.name + ': ₴' + formatNumber(this.y, 0, 0, true); } },
            plotOptions: { series: { stacking: 'normal' } },
            series: [{
                name: 'Відсотки (зменшено на комісійні)',
                data: [{ y: interest, color: '#A6BEFC' }, { y: interest1, color: '#ACE8FA' }]
            }, {
                name: 'Заощадження',
                data: [{ y: principal, color: '#0146F5' }, { y: principal1, color: '#42BFC7' }]
            }]
        });

    } else {
        borrowChart.xAxis[0].setCategories([label, label1]);
        borrowChart.series[0].data[0].update(interest);
        borrowChart.series[1].data[0].update(principal);
        borrowChart.series[0].data[1].update(interest1);
        borrowChart.series[1].data[1].update(principal1);
    }

    $("#borrow .result").css('display', 'flex');


    if (CALC_NAME === 'Кредитом') {
        dataLayer.push({ event: 'calculatorCompleted', personalLoanData: serializeData(document.getElementById('calculator-container'), 'B', lastEl) });
    } else {
        dataLayer.push({ event: 'calculatorCompleted', mortgageCalcData: serializeData(document.getElementById('calculator-container'), 'B', lastEl) });
    }

    //dataLayer.push({ event: 'calculatorCompleted' });
    //serializeData(document.getElementById('calculator-container'),'B', lastEl);
}


function CalculateHowlong(lastEl) {
    if ($('#howlong input:visible.empty').length > 0 && $('#howlong .result').css("display") == "none") { return false; }
    var type = 0; // used for NPER function
    //actual
    var rate = parseFloat($("#howlong-rate1").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per = parseInt($("#howlong-freq1").val()); //number of periods (eg. 12 = 1 year)
    var pv = parseFloat($("#howlong-amount1").val().replace(/[^0-9\.]/g, ''));
    var fee = parseFloat($("#howlong-fee1").val().replace(/[^0-9\.]/g, ''));
    var feeFreq = parseInt($("#howlong-feefreq1").val());
    var fv = 0; //future value
    var pmt = parseFloat($("#howlong-payment1").val().replace(/[^0-9\.]/g, '')); //payment made each period
    var nper = NPER((rate / 100) / per, -pmt - ((fee * feeFreq) / per), pv, fv, type); //fee is being matched to period of repayment, this is not 100% accurate, but result should be very close
    var principal = pv;
    var totalRepayments = pmt * nper;
    var interest = totalRepayments - principal;
    var label = '';
    var labelYears = nper / per;
    var labelMonths = Math.ceil((labelYears % 1) * 12);
    labelYears = parseInt(labelYears);
    if (labelMonths === 12) {
        labelMonths = 0;
        labelYears = labelYears + 1;
    }
    if (labelYears > 0) { label = labelYears + ' років '; }
    if (labelMonths > 0) { label = label + labelMonths + ' місяців'; }
    $("#howlong .inline-result span").text(label);
    if (label.length < 1) {
        label = '<span style="color:#D84847">Визначити термін не можливо, з причин перевищення суми отриманих відсотків над сумою вилучення.</span>';
        interest = 0;
        principal = 0;
        $("#howlong .inline-result span").text("N/A");
    } else { label = '<span style="font-weight:bold;color:#333;font-size:1rem;">Деталі</span><br><span style="font-weight:bold;">' + label + '</span><br/>₴' + formatNumber(pmt, 0, 0, true) + freqString(per) + ' під ' + rate + '%'; }

    // blank out the what if results, if amount borrowed is zero
    if (pmt === 0 || isNaN(pmt) || isNaN(rate) || pv === 0 || isNaN(pv)) {
        label = '';
        principal = 0;
        interest = 0;
        $("#howlong .inline-result span").text("");
    }

    //explore scenario
    var rate1 = parseFloat($("#howlong-rate1-explore").val().replace(/[^0-9\.]/g, '')); //interest rate (entered p.a. so we need to convert per period)
    var per1 = parseInt($("#howlong-freq1-explore").val()); //number of periods (eg. 12 = 1 year)
    var pv1 = pv; // parseFloat( $("#howlong-amount1-explore").val().replace(/[^0-9\.]/g,'') );
    var pmt1 = parseFloat($("#howlong-payment1-explore").val().replace(/[^0-9\.]/g, '')); //payment made each period
    var nper1 = NPER((rate1 / 100) / per1, -pmt1 - ((fee * feeFreq) / per1), pv1, fv, type); //fee is being matched to period of repayment, this is not 100% accurate, but result should be very close
    var principal1 = pv1;
    var totalRepayments1 = pmt1 * nper1;
    var interest1 = totalRepayments1 - principal1;
    var label1 = '';
    var labelYears1 = nper1 / per1;
    var labelMonths1 = Math.ceil((labelYears1 % 1) * 12);
    labelYears1 = parseInt(labelYears1);
    if (labelMonths1 === 12) {
        labelMonths1 = 0;
        labelYears1 = labelYears1 + 1;
    }
    if (labelYears1 > 0) { label1 = labelYears1 + ' років '; }
    if (labelMonths1 > 0) { label1 = label1 + labelMonths1 + ' місяців'; }
    if (label1.length < 1) {
        label1 = '<span style="color:#D84847">Визначити термін не можливо, з причин перевищення суми отриманих відсотків над сумою вилучення.</span>';
        interest1 = 0;
        principal1 = 0;
    } else { label1 = '<span style="font-weight:bold;color:#333;font-size:1rem;">Альтернатива</span><br><span style="font-weight:bold;">' + label1 + '</span><br/>₴' + formatNumber(pmt1, 0, 0, true) + freqString(per1) + ' під ' + rate1 + '%'; }

    // blank out the what if results, if hidden, or no what if repayment supplied
    if (pmt1 === 0 || isNaN(pmt1)) {
        label1 = '';
        principal1 = 0;
        interest1 = 0;
    }

    //chart
    if (howlongChart === undefined) { //we need to create the chart on first use

        var html = '<div id="howlong-chart1" style="height: 315px; margin: 0 auto;"></div>';
        $("#howlong .chart").html(html);

        howlongChart = new Highcharts.Chart({
            chart: { renderTo: 'howlong-chart1', type: 'column', marginBottom: 90, marginTop: 30 },
            colors: ['#ACE8FA', '#0047F5'],
            credits: { enabled: false },
            title: { text: null },
            xAxis: { categories: [label, label1], labels: { y: 30, style: { fontFamily: '\'Montserrat\', sans-serif', fontSize: '15px', color: '#333' } } },
            yAxis: {
                min: 0,
                title: { text: null },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontFamily: '\'Montserrat\', sans-serif',
                        fontSize: '15px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || '#333'
                    },
                    formatter: function() { return '₴' + formatNumber(this.total, 0, 0, true); }
                },
                labels: { style: { fontFamily: '\'Montserrat\', sans-serif', color: '#333' } }
            },
            legend: { backgroundColor: '#FFFFFF', reversed: true, enabled: false },
            tooltip: { formatter: function() { return this.series.name + ': ₴ ' + formatNumber(this.y, 0, 0, true); } },
            plotOptions: { series: { stacking: 'normal' } },
            series: [{
                name: 'Відсотки (Зменшено на комісійними)',
                data: [{ y: interest, color: '#A6BEFC' }, { y: interest1, color: '#ACE8FA' }]
            }, {
                name: 'Заощадження',
                data: [{ y: principal, color: '#0146F5' }, { y: principal1, color: '#42BFC7' }]
            }]
        });

    } else {
        howlongChart.xAxis[0].setCategories([label, label1]);
        howlongChart.series[0].data[0].update(interest);
        howlongChart.series[1].data[0].update(principal);
        howlongChart.series[0].data[1].update(interest1);
        howlongChart.series[1].data[1].update(principal1);
    }

    $("#howlong .result").css('display', 'flex');

    if (CALC_NAME === 'Кредитом') {
        dataLayer.push({ event: 'calculatorCompleted', personalLoanData: serializeData(document.getElementById('calculator-container'), 'C', lastEl) });
    } else {
        dataLayer.push({ event: 'calculatorCompleted', mortgageCalcData: serializeData(document.getElementById('calculator-container'), 'C', lastEl) });
    }

    //dataLayer.push({ event: 'calculatorCompleted' });
    //serializeData(document.getElementById('calculator-container'),'C', lastEl);
}

function freqString(s) {
    if (s === 1) { s = 'рік'; }
    if (s === 4) { s = 'квартал'; }
    if (s === 12) { s = 'місяць'; }
    if (s === 26) { s = 'два тижні'; }
    if (s === 52) { s = 'тиждень'; }
    return '\xa0на\xa0' + s;
}

/* CALCULATOR FORMULAS */
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

function serializeData(container, calcType, lastEl) {
    var version = "v2";
    changeCount++;
    var data = '';
    var inputs = container.querySelectorAll('input,select');
    var lastElID = lastEl.id;
    var loopCnt = 0;
    var lastChanged = '';
    inputs.forEach(function(input) {
        loopCnt++;
        var inputVal = input.value;
        if (calcUserData.showInterestRate === false && (input.id === 'loan-type' || input.id === 'repayment-type')) {
            // don't show val if beta mode off
            inputVal = '';
        }

        if (input.classList.contains('dollars')) {
            inputVal = inputVal.replace(/\D+/g, '');
        }
        inputVal = inputVal.replace('%', '');
        inputVal = inputVal.replace(' years', '');
        data += inputVal + '|';
        if (lastElID === input.id) {
            lastChanged = loopCnt.toString();
        }
    });

    data += changeCount.toString() + "|" + calcType + "|" + version + "|" + lastChanged;

    return data;
    //console.log(data);

    /*
    if ( CALC_NAME === 'Personal loan' ){
        window.dataLayer.push({
            'personalLoanData': data,
        });
    } else {
        window.dataLayer.push({
            'mortgageCalcData': data,
        });
    }
    */
}