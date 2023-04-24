 /* Changelog
                                 20130524 - Changed type = 1, to type = 0
                                 20130704 - Updated GA event tracking code to be included in bounce rate calculation
                                 20131127 - Various changes, including: moving Minimal repayment details to advanced settings, showing higher repayment option by default, changing minimum repayments from input to select, reformatted results box
                                 20140115 - Updated default credit card rate from 18.5% to 18.0%
                                 20140722 - Updated layout to be responsive mobile friendly
                                 20150706 - minor code cleanup and moved static content to sContent to allow it to be easily overridden in Umbraco advanced tab
                                 20181019 - Removed old tooltip code and updated styling.
                                 */

 //GLOBAL VARS
 var CALC_NAME = 'кредитних карток';
 var HIGHER = false; // show the higher repayments graph
 // static content
 var sContent = {
     'ttAmtOwing': 'Сума заборгованості - це непогашений залишок на вашій кредитній картці. Це Завершальний баланс на Вашому останньому виписці з кредитної картки, а також додаткові гроші, витрачені на Вашу картку, а також будь-які відсотки та збори, понесені з кінця останнього періоду виписки (див. Останню виписку з кредитної картки).',
     'ttRate': 'Процентна ставка - це річна ставка за вашою кредитною карткою. Зверніться до свого оператора кредитної картки, щоб дізнатись річний тариф на вашу картку.',
     'ttPmt': 'Встановлена сума в доларах, що дорівнює або перевищує поточне погашення, що призведе до швидшого погашення вашої кредитної картки.',
     'ttMinRate': 'Мінімальне щомісячне погашення зазвичай становить відсоток від кінцевого залишку. Перевірте виписку з кредитної картки.',
     'ttMinPmt': 'Якщо ваш розрахований мінімальний виплат менше цієї суми, вам потрібно буде сплатити орендодавцю цю суму або кінцевий залишок.',
     'advIntro': 'Примітка: Мінімальна сума щомісячного погашення розраховується як відсоток від кінцевого балансу або мінімальної доларової суми кінцевого балансу - залежно від того, що вище. Перевірте свій <button class="tooltip glossButton">PDS<span class="tooltiptext">Product disclosure statement. Документ, який постачальники фінансових послуг повинні надати вам, коли вони рекомендують або пропонують фінансовий продукт. Він повинен містити інформацію про основні характеристики продукту, збори, комісійні, вигоди, ризики та процедуру розгляду скарг.</span></button> і змініть ці суми, якщо суми вашого кредитора відрізняються від цих за замовчуванням.',
 };


 $(document).ready(function() {

     //Draw calculator framework
     DrawCalculator();

     // GA TRACKING
     //track inputs
     //  $('#creditcardContainer').on('blur', '.input  input', function() {
     //      moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input - ' + $(this).parents('p').children('label').text(), $(this).val());
     //  });
     //  $('#creditcardContainer').on('blur', '.explore input', function() {
     //      moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Input-explore - ' + $(this).parents('p').children('label').text(), $(this).val());
     //  });
     //  $('#creditcardContainer').on('change', '.explore select', function() {
     //      moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Select-explore - ' + $(this).parents('p').children('label').text(), $(this).val());
     //  });
     //  //track expanding explore scenario
     //  $('#creditcardContainer').on('click', '.explore h4', function() {
     //      moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, 'Explore scenario', $(this).text());
     //  });

 });

 //HTML
 function DrawCalculator() { // CALCULATOR FRAMEWORK HTML

     var html = '<h2 class="shaded">Калькулятор ' + CALC_NAME + '</h2>' +
         '<div class="break input">' +
         '<p class="label-required">обов\'язкове поле</p>' +
         '<h3 class="col100">Ваша картка</h3>' +
         '<p>' +
         '<label for="pv">Сума заборгованості: <span>(₴)</span><button class="tooltip"><span class="tooltiptext">' + sContent.ttAmtOwing + '</span></button></label>' +
         '<input id="pv" inputmode="numeric" type="text" class="dollars int empty">' +
         '</p>' +
         '<p>' +
         '<label for="rate">Відсоткова ставка: <span>(%)</span><button class="tooltip"><span class="tooltiptext">' + sContent.ttRate + '</span></button></label>' +
         '<input id="rate" inputmode="decimal" type="text" class="interest float" value="18.0%">' +
         '</p>' +
         '</div>' +
         '<div class="break result">' +
         '<div class="result-box">' +
         '<h3 class="col100">Результат</h3>' +
         '<div id="chart"/><p class="inline-result hide"/>' +
         '</div>';
     $("#creditcardContainer").html(html);

     // explore
     html = '<div class="explore">' +
         '<h3 role="button" tabindex="0" class="col100 exploreToggle">Збільшені виплати</h3>' +
         '<div class="higher-repayments-container more hide">' +
         '<div class="input">' +
         '<p class="instruction">Подивіться, скільки ви заощадите, <strong>якщо збільшите суму повернення боргу</strong>.</p>' +
         '<p class="col100" style="margin-bottom: 0">' +
         '<label for="slider">Збільшені виплати: <span>(щомісяця)</span><button class="tooltip"><span class="tooltiptext">' + sContent.ttPmt + '</span></button></label></p>' +
         '<div class="slider-container"><div class="fill" id="range-fill"></div>' +
         '<input class="volume-slider" id="slider" type="range" value="0" />' +
         '</div>' +
         '<input id="payment" data-min="0" data-max="0" type="text" class="dollars int"></div></div>' +
         '<h3 role="button" tabindex="0" class="col100 exploreToggle light">Розширені налаштування</h3>' +
         '<div class="more hide">' +
         '<div class="input">' +
         '<p class="instruction">' + sContent.advIntro + '</p>' +
         '<p>' +
         '<label for="minRate">Мінімальне погашення несплаченого залишку (%): <button class="tooltip"><span class="tooltiptext">' + sContent.ttMinRate + '</span></button></label>' +
         '<select id="minRate" />' +
         '</p>' +
         '<p>' +
         '<label for="minAmt">Мінімальні виплати (₴): <button class="tooltip"><span class="tooltiptext">' + sContent.ttMinPmt + '</span></button></label>' +
         '<select class="dollars" id="minAmt" />' +
         '</p></div>' +
         '</div>' +
         '</div>';
     $("#creditcardContainer").append(html);

     // populate selects
     $('#minRate').html(buildOptions(['4%', '4.5%', '5%']));
     $('#minAmt').html(buildOptions(['₴500', '₴1000', '₴1500', '₴2000', '₴2500', '₴3000']));
     // and set defaults
     $('#minRate').val('4%');
     $('#minAmt').val('₴500');


     //add html5 pattern so touch default to numeric keyboard
     var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
     if (ismobile) { $('#creditcardContainer input[type="text"]').attr('pattern', '[0-9]*'); }

     //blur on enter key
     $('#creditcardContainer input').on('keypress', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

     // VALIDATION
     $('#creditcardContainer input[type="text"]').on('focus', function() {
         this.select();
         $(this).removeClass('empty');
         if ($('input.empty:visible').length == 0) { $('#creditcardContainer .label-required').remove(); }
     });
     $('#creditcardContainer input[type="text"]').on('mouseup', function(e) {
         this.select();
         e.preventDefault();
     });
     $('#rate').on('blur', function() {
         var rate = cleanVal($(this).val());
         if (rate > 20) { $('#minRate').val('4.5%'); if (rate > 26) { $('#minRate').val('5%'); } } else { $('#minRate').val('4%'); }
     });
     $('#creditcardContainer input[type="text"]').on('blur', function() {
         if (this.value.length < 1) { $(this).val(0); }
         if (this.id == 'nper' && this.value === 0) { $(this).val(1); } // set a min nper of 1
         if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)); }
         if ($(this).hasClass('interest')) {
             var int = parseFloat($(this).val());
             if (int > 50) { int = 50; }
             $(this).val(formatNumber(int, 0, 2, true) + '%');
         }
         if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років'); }
         if (this.id == 'payment') {
             var minV = $(this).attr("data-min");
             var maxV = $(this).attr("data-max");
             var val = $(this).val().replace(/[^0-9\.]+/g, '');

             if (Number(val) < Number(minV)) {
                 $(this).val(minV)
             } else if (Number(val) > Number(maxV)) {
                 //now allowing user to go greater than max value
                 //$(this).val(maxV)
             }

             calculate($(this).val());
         } else { calculate(); }
     });
     $('#creditcardContainer select').on('change', function() { calculate(); });
     $('input').keyup(function(e) {
         var keyCode = e.keyCode || e.which;
         if (keyCode != 9) { //any key except tab
             if ($(this).hasClass('int')) { this.value = this.value.replace(/[^0-9]/g, ''); } //full numbers only
             if ($(this).hasClass('float')) { this.value = this.value.replace(/[^0-9\.]/g, ''); } //decimal numbers
         }
     });

     $(".explore h3").click(function() {
         $(this).toggleClass('open');
         $(this).nextAll("div.more:first").slideToggle();
     });

 }

 function buildOptions(a) {
     var html = ''; //'<option value="">Please select</option>';
     for (var i = 0; i < a.length; i++) { html = html + '<option value="' + a[i] + '">' + a[i] + '</option>'; }
     return html;
 }

 //CALCULATIONS
 function calculate(payment) {


     if ($('input.empty:visible').length > 0) { return false; }

     if (!HIGHER) {
         HIGHER = true;
         $('.explore h4:first').addClass('open').nextAll("div.more:first").slideDown();
     }

     var pv = cleanVal($('#pv').val());
     var rate = cleanVal($('#rate').val()) / 100;
     var minRate = cleanVal($('#minRate').val()) / 100;
     var minAmt = cleanVal($('#minAmt').val());
     var type = 0;
     var html = '';
     var balance = pv;
     var interest, repayment;
     var totalInterest = 0;
     var minFirstRepayment; //used for higher repayments

     //loop through periods
     for (i = 1; i < 2000; i++) { //hardcoded to 2000 periods
         //Minimum repayments
         interest = balance * (rate / 12); // monthly interest on remaining balance
         totalInterest = totalInterest + interest; // keep a total of the interest for each period
         repayment = Math.max((balance + interest) * minRate, minAmt); // are we repaying the min dollar amount, or the min % amount?
         if (balance <= repayment) { repayment = balance + interest; } // if the amount owing is less than the balance, pay out the balance
         balance = balance + interest - repayment;
         if (i == 1) { minFirstRepayment = Math.ceil(repayment); }
         if (balance <= 0) { break; } // once the balance gets to zero we are done
     }

     var label = '';
     var years = parseInt(i / 12);
     var months = Math.ceil(i % 12);
     if (months == 12) {
         years = years + 1;
         months = 0;
     }
     if (years == 1) { label = years + ' рік '; }
     if (years > 1) { label = years + ' років '; }
     if (months == 1) { label = label + months + ' місяць'; }
     if (months > 1) { label = label + months + ' місяців'; }
     label = '<p class="chart-text"><span style="font-weight:bold;">Мінімальні виплати</span></p><p class="chart-text"><span style="font-weight:bold;">Ви повинні сплатити ₴' + formatNumber(pv + totalInterest, 0, 0, true) + '</span><br/>протягом ' + label + '<br/>₴' + formatNumber(minFirstRepayment, 0, 0, true) + ' перший місяць<br/>(зменшується)<button class="tooltip"><span class="tooltiptext">Мінімальні виплати розраховуються як відсоток від поточного балансу заборгованості. Коли заборгованість зменшується, зменшуватимуться і ваші мінімальні щомісячні виплати.</span> </button></p>';

     // Higher repayments
     var pmt = PMT(rate / 12, 2 * 12, pv, 0, 1);
     if (payment === undefined) { payment = -pmt; }
     if (typeof payment == 'string') { payment = payment.replace(/[^0-9\.]+/g, ''); }
     if (payment <= minAmt) { payment = minAmt; }
     if (payment <= minFirstRepayment) { payment = minFirstRepayment; }
     if (payment > pv) { payment = pv; }

     var nper = NPER(rate / 12, -payment, pv, 0, 1);
     nper = nper.toFixed(5); //need to fix so we can calculate 24 months exactly

     $('.higher-amount').text('за ₴' + formatNumber(payment, 0, 0, true));

     var label1 = '';
     years = parseInt(nper / 12);
     months = Math.ceil(nper % 12);
     if (months == 12) {
         years = years + 1;
         months = 0;
     }
     if (years == 1) { label1 = years + ' рік '; }
     if (years > 1) { label1 = years + ' років '; }
     if (months == 1) { label1 = label1 + months + ' місяць'; }
     if (months > 1) { label1 = label1 + months + ' місяців'; }
     label1 = '<p class="chart-text"><span style="font-weight:bold;">Збільшені виплати</span></p><p class="chart-text"><span style="font-weight:bold;">Ви повинні сплатити ₴' + formatNumber(payment * nper, 0, 0, true) + '</span><br/>протягом ' + label1 + '<br/>₴' + formatNumber(payment, 0, 0, true) + ' щомісяця</p>';

     $('#slider').attr("min", minFirstRepayment);
     $('#slider').attr("max", minFirstRepayment * 6);
     $('#slider').val(payment);

     $('#payment').attr("data-min", minFirstRepayment);
     $('#payment').attr("data-max", minFirstRepayment * 6);


     $('#slider').on('input change', debounce(function() {

         $("#payment").val("₴" + $(this).val());
         payment = $(this).val();

         var min = $('#payment').attr("data-min");
         var max = $('#payment').attr("data-max");
         var range = max - min;
         var w = 100;
         var per = (w * (this.value - min) / range);
         document.getElementById('range-fill').style.width = per + '%';
         $(this).off('input change');
         calculate($(this).val());
     }, 300));


     /*
     $("#slider").slider({
         stop: function(event, ui) {
             calculate(ui.value);
             //ASIC.trackEvent( 'Calculator - '+CALC_NAME, 'Slider', ui.value );
         },
         range: "min",
         value: payment,
         min: minFirstRepayment,
         max: minFirstRepayment * 5,
         slide: function( event, ui ) { $("#payment").val( "$" + ui.value ); }
     });
     */

     var min = $('#payment').attr("data-min");
     var max = $('#payment').attr("data-max");
     //var min = minFirstRepayment;
     //var max = minFirstRepayment * 5;
     var range = max - min;
     var w = 100;
     var per = (w * (payment - min) / range);
     if (per > 100) {
         per = 100;
     }
     document.getElementById('range-fill').style.width = per + '%';
     //$("#slider").css( 'background', 'linear-gradient(to right, green 0%, green '+per +'%, #fff ' + per + '%, white 100%)' );
     //$("#slider").val( payment );
     $("#payment").val("₴" + formatNumber(payment, 0, 0, true));

     if (HIGHER) {
         $('.inline-result').html('Заощадите <span style="font-weight:bold;font-size:1.6em;color:#0047F5;"> ₴' + formatNumber((pv + totalInterest) - (payment * nper), 0, 0, true) + '</span> шляхом збільшення виплат').show();
         drawChart(label, pv, totalInterest, label1, pv, payment * nper - pv);
     } else {
         drawChart(label, pv, totalInterest, '', 0, 0);
         $('.inline-result').hide();
     }

     //  dataLayer.push({ event: 'calculatorCompleted' });
     serializeData(document.getElementById('creditcardContainer'));
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

 //GENERIC FUNCTIONS

 // Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)
 // Returns a function, that, as long as it continues to be invoked, will not
 // be triggered. The function will be called after it stops being called for
 // N milliseconds. If `immediate` is passed, trigger the function on the
 // leading edge, instead of the trailing.
 function debounce(func, wait, immediate) {
     var timeout;

     return function executedFunction() {
         var context = this;
         var args = arguments;

         var later = function() {
             timeout = null;
             if (!immediate) func.apply(context, args);
         };

         var callNow = immediate && !timeout;

         clearTimeout(timeout);

         timeout = setTimeout(later, wait);

         if (callNow) func.apply(context, args);
     };
 };

 function cleanVal(v) {
     v = v.replace(/[^0-9.]/g, '');
     if (isNaN(v) || v.length < 1) { v = 0; }
     return parseFloat(v);
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

 var chart;

 function drawChart(label, principal, interest, label1, principal1, interest1) {

     $('.result').show();
     $('.explore').show();

     $('.result-box h4').show();

     chart = new Highcharts.Chart({
         chart: { renderTo: 'chart', type: 'column', marginBottom: 150 },
         colors: ['#A6BEFC', '#0047F5'],
         credits: { enabled: false },
         title: { text: null },
         xAxis: {
             categories: [label, label1],
             labels: { useHTML: true, y: 25, style: { fontFamily: '\'Montserrat\', sans-serif;' } },
         },
         yAxis: {
             min: 0,
             title: { text: null },
             labels: { format: '₴{value}', style: { fontFamily: '\'Montserrat\', sans-serif;' } }
         },
         legend: { enabled: false },
         tooltip: {
             shared: true,
             useHTML: true,
             borderColor: '#42BFC7',
             formatter: function() {
                 var s = '<table class="chart-tooltip"><tr><td><span class="key interest"></span>Відсотки</td><td class="num">₴' + formatNumber(this.points[0].y, 0, 0, true) + '</td></tr><tr><td><span class="key principal"></span>Заборгованість</td><td class="num">₴' + formatNumber(this.points[1].y, 0, 0, true) + '</td></tr></table>';
                 return s;
             }
         },
         plotOptions: {
             column: {
                 stacking: 'normal',
                 dataLabels: {
                     enabled: false,
                 }
             },
             series: { borderWidth: 0, shadow: false /*, groupPadding: 0.1, pointPadding: 0.05*/ }
         },
         series: [{
             name: 'Відсотки',
             data: [interest, interest1]
         }, {
             name: 'Заборгованість',
             data: [principal, principal1]
         }]
     });
 }

 var changeCount = 0;
 /*
  * Example output
  * 20000|18.0|984|2|20|1|v1
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
         inputVal = inputVal.replace(' years', '');
         if (input.type === 'radio' && input.checked === false) {
             skip = true;
         }
         if (input.id === 'slider') {
             skip = true;
         }
         if (skip === false) {
             data += inputVal + '|';
         }
     });

     data += changeCount.toString() + "|" + version;
     //console.log(data);
     //  window.dataLayer.push({
     //      'creditcardData': data,
     //  });
 }