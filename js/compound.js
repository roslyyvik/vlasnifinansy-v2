 /* Changelog
                                20130508 - Changed number of years from 20 to 50
                                           Added compound frequency option
                                           Minor CSS changes to accomodate compound frequency
                                20130524 - Removed all type = 1, and changed to type = 0
                                20130704 - Updated GA event tracking code to be included in bounce rate calculation
                                20140912 - Rewritten the layout and CSS to be responsive
                                20161215 - Updated CSS/JS to match global changes, also removed slider as it was dependent on jQueryUI - Maybe we can add a better type of slide back in later, and finally moved the GA tracking to Umbraco
                                */
 //GLOBAL VARS
 var CALC_NAME = 'складного відсотку';
 var container = document.getElementById('compoundInterestContainer');
 var changeCount = 0;

 $(document).ready(function() {

     DrawCalculator();

     //blur on enter key
     $('input').on('keypress', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

     // VALIDATION
     $('input.int').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
     $('input.float').keyup(function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers
     $('#compoundInterestContainer input[type="text"]').focus(function() {
         this.select();
         $(this).removeClass('empty');
         if ($('input.empty:visible').length == 0) { $('#compoundInterestContainer .label-required').remove(); }
     });
     $('#compoundInterestContainer input[type="text"]').mouseup(function(e) { e.preventDefault(); });
     $('#compoundInterestContainer input[type="text"]').blur(function() {
         if (this.value.length < 1) { $(this).val(0); /*this.value = (this.defaultValue)*/ };
         if (this.id == 'nper' && this.value == 0) { $(this).val(1); } // set a min nper of 1
         if (this.id == 'nper' && this.value > 50) { $(this).val(50); } // set a max nper of 50
         if (this.id == 'rate' && this.value > 20) { $(this).val(20); } // set a max rate of 20
         if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)) };
         if ($(this).hasClass('interest')) { $(this).val(formatNumber($(this).val(), 0, 2, true) + '%') };
         if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років') };
         if (this.id == 'pmt-explore') { $(this).val($(this).val() + ' ' + freqString($('#pmtFreq').val())); }
     });
     $('#pmtFreq').on('change', function(event) {
         if (this.value == 1) { $('#nperFreq, #nperFreq-explore').val(1).prop('disabled', true); } else { $('#nperFreq, #nperFreq-explore').val(12).prop('disabled', false); }
         $('#pmt-explore').blur(); // blur #pmt-explore so we update the freq string in #pmt-explore
     });

     // calculate
     $('#compoundInterestContainer input[type="text"]').blur(function() { calculate(); });
     $('#nperFreq, #nperFreq-explore').on('change', function(event) { $('#pmt-explore').blur(); });

     // explore scenario
     var firstExpand = true;
     $(".explore h4").click(function(event) {
         $(this).toggleClass('open');
         $(this).nextAll('div.more:first').slideToggle();
         if (firstExpand) {
             firstExpand = false;
             $('#pmt-explore').val($('#pmt').val());
             $('#nperFreq-explore').val($('#nperFreq').val());
         }
         $('#pmt-explore').blur();
     });
     $("#compoundInterestContainer").on("click", ".whatif", function(event) { $("#compoundInterestContainer .explore h4:first").trigger("click"); });
     $('.explore h4').append('<span class="icon"/>');

     // GA TRACKING
     //track inputs
     //  $('#compoundInterestContainer .yourStrategy  input').on('change', function(event) {
     //      moneysmartjs.trackEvent('Калькулятор - ' + CALC_NAME, 'Input - ' + $(this).parents('p').children('label').html(), $(this).val(), 0);
     //      //serializeData(container);
     //  });
     //  $('#compoundInterestContainer .input select').on('change', function(event) {
     //      moneysmartjs.trackEvent('Калькулятор - ' + CALC_NAME, ' Select - ' + $(this).parents('p').children('label').html(), $(this).children("option:selected").html(), 0);
     //      //serializeData(container);
     //  });
     //  $('#compoundInterestContainer .explore  input').on('change', function(event) {
     //      moneysmartjs.trackEvent('Калькулятор - ' + CALC_NAME, 'Input-explore - ' + $(this).parents('p').children('label').html(), $(this).val(), 0);
     //      //serializeData(container);
     //  });
     //  //track expanding explore scenario
     //  $('#compoundInterestContainer .explore h4').on('click', function(event) {
     //      moneysmartjs.trackEvent('Калькулятор - ' + CALC_NAME, 'Explore scenario', $(this).text(), 0);
     //  });


 });

 //HTML
 function DrawCalculator() { // CALCULATOR FRAMEWORK HTML
     var html = '<h2 class="shaded">Калькулятор ' + CALC_NAME + ' </h2>';

     //input
     html = html + '<div class="flex"><div class="break input yourStrategy">' +
         '<p class="label-required">обов\'язкове поле</p>' +
         '<h3 class="col100">Ваша стратегія</h3>' +
         '<p><label for="pv">Початковий депозит:</label><input id="pv" inputmode="numeric" type="text" class="dollars int empty" aria-required="true"></p>' +
         '<p><label for="pmt">Регулярні поповнення:</label><input id="pmt" inputmode="numeric" type="text" class="dollars int empty" aria-required="true"></p>' +
         '<p><label for="pmtFreq">Періодичність поповнення:</label><select id="pmtFreq"/></p>' +
         '<p><label for="nperFreq">Період нарахування:</label><select id="nperFreq"/></p>' +
         '<p><label for="nper">Кількість років: <span>(макс 50)</span></label><input id="nper" inputmode="numeric" value="10 років" type="text" class="years int"></p>' +
         '<p><label for="rate">Ставка відсотку: <span>(макс 20%)</span></label><input id="rate" inputmode="decimal" type="text" class="interest float" value="5.00%"><span style="display: block; font-size: 0.75rem; color: #666666;">Ефективна ставка відсотку: <span id="yield">5.12</span>% ' +
         '<button class="tooltip"><span class="visuallyhidden">Довідка щодо ефективної процентної ставки: </span> <span class="tooltiptext">Ставка, на основі якої здійснюється дисконтування очікуваного потоку майбутніх грошових платежів або надходжень упродовж очікуваного терміну.(НБУ)</span></button></p>' +
         '</div>';
     //results
     html = html + '<div class="break result"><div class="result-box"><h3>Результати</h3><div id="chart"/><div id="compoundInterestContainerResult" class="ms-calc-result"/></div></div></div>';

     // explore
     html = html + '<div class="explore">' +
         '<h3 class="col100">Альтернативна стратегія</h3>' +
         '<div class="more input">' +
         '<p><label for="delay">Відкладений період старту:</label><input id="delay" inputmode="numeric" value="0 років" type="text" class="years int"></p>' +
         '<p><label for="pmt-explore">Змінені регулярні поповнення:</label><input id="pmt-explore" inputmode="numeric" type="text" class="dollars int" value="₴0"></p>' +
         '<p><label for="nperFreq-explore">Змінена періодичність нарахування:</label><select id="nperFreq-explore"/></p>' +
         '</div>' +
         '</div>';


     $("#compoundInterestContainer").html(html);

     //add select options
     html = '<option value="1">Щорічно</option>' +
         '<option value="12" selected="selected">Щомісячно</option>' +
         '<option value="26">Щокварталу</option>' +
         '<option value="52">Щотижня</option>' +
         '<option value="365">Щоденно</option>';
     $("#pmtFreq").html(html);
     html = '<option value="12" selected="selected">Щомісячно</option>' +
         '<option value="1">Щорічно</option>';
     $("#nperFreq, #nperFreq-explore").html(html);
 }

 //CALCULATIONS
 function calculate() {
     var rate = parseFloat($('#rate').val().replace(/[^0-9.]/g, ''));
     if (isNaN(rate)) { rate = 0 } else { rate = rate / 100 }
     var nperFreq = parseFloat($('#nperFreq').val());
     var yield = Math.pow(1 + (rate / nperFreq), nperFreq) - 1;
     yield = yield.toFixed(5) * 100; //for presentation
     $('#yield').text(formatNumber(yield, 0, 2, true)); // update the yield

     if ($('input.empty:visible').length > 0) { return false; }
     //get vars from calc
     var pv = parseFloat($('#pv').val().replace(/[^0-9.]/g, ''));
     if (isNaN(pv)) { pv = 0 }
     var nper = parseFloat($('#nper').val().replace(/[^0-9.]/g, ''));
     if (isNaN(nper)) { nper = 0 }
     var nperFreqExplore = parseFloat($('#nperFreq-explore').val());
     var pmt = parseFloat($('#pmt').val().replace(/[^0-9.]/g, ''));
     if (isNaN(pmt)) { pmt = 0 }
     var pmtFreq = parseFloat($('#pmtFreq').val());

     var pmtExplore = parseFloat($('#pmt-explore').val().replace(/[^0-9.]/g, ''));
     if (isNaN(pmtExplore)) { pmtExplore = 0 }
     var delay = parseFloat($('#delay').val());
     if (isNaN(delay)) { delay = 0 }
     var type = 0;
     var html = '';


     //arrays to store graph data
     var aPv = new Array();
     aPv[0] = 0;
     var aFv = new Array();
     aFv[0] = 0;
     var aSavings = new Array();
     aSavings[0] = 0;
     var aInterest = new Array();
     aInterest[0] = 0;
     var aPvExp = new Array();
     aPvExp[0] = 0;
     var aFvExp = new Array();
     aFvExp[0] = 0;
     var aSavingsExp = new Array();
     aSavingsExp[0] = 0;
     var aInterestExp = new Array();
     aInterestExp[0] = 0;

     // populate the data for the chart
     var x = 1;
     for (var i = nperFreq; i <= nper * nperFreq; i += nperFreq) {

         // original scenario
         aPv[x] = pv;
         aFv[x] = -FV(rate / nperFreq, i, pmt * pmtFreq / nperFreq, pv, type);
         aSavings[x] = pmt * pmtFreq + aSavings[x - 1];
         aInterest[x] = aFv[x] - aSavings[x] - pv;

         x = x + 1;
     }
     //actual amounts
     var fv = aFv[x - 1];
     var savings = aSavings[x - 1];
     var interest = fv - savings - pv;

     //if ( $('.explore h4:first').hasClass('open') ) {

     if (exploreData()) {
         // populate the data for the explore chart
         var x = 1;
         for (var i = nperFreqExplore; i <= nper * nperFreqExplore; i += nperFreqExplore) {
             // explore scenario
             if (delay < x) {
                 aPvExp[x] = pv;
                 aFvExp[x] = -FV(rate / nperFreqExplore, i - delay * nperFreqExplore, pmtExplore * pmtFreq / nperFreqExplore, pv, type);
                 aSavingsExp[x] = pmtExplore * pmtFreq + aSavingsExp[x - 1];
                 aInterestExp[x] = aFvExp[x] - aSavingsExp[x] - pv;
             } else {
                 aPvExp[x] = 0;
                 aFvExp[x] = 0;
                 aSavingsExp[x] = 0;
                 aInterestExp[x] = 0;
             }
             x = x + 1;
         }
         drawColumnChart(aPv, aSavings, aInterest, aPvExp, aSavingsExp, aInterestExp);
     } else { drawChart(aPv, aSavings, aInterest); }

     html = '<div class="legend"><h4>Ваша стратегія:</h4>' +
         '<p><span class="key pv"/>Початковий депозит: <span class="amt">₴' + formatNumber(pv, 0, 0, true) + '</span></p>' +
         '<p><span class="key savings"/>Регулярні поповнення: <span class="amt">₴' + formatNumber(savings, 0, 0, true) + '</span></p>' +
         '<p><span class="key interest"/>Всього відсотків: <span class="amt">₴' + formatNumber(interest, 0, 0, true) + '</span></p>' +
         '<p class="total">Всього накопичень: <span class="amt">₴' + formatNumber(fv, 0, 0, true) + '</span></p>' +
         '</div>';


     if (exploreData()) {
         html = html + '<div id="alt-strategy" class="legend"><h4>Альтернативна стратегія:</h4>' +
             '<p><span class="key alt pv"/>Початковий депозит: <span class="amt">₴' + formatNumber(pv, 0, 0, true) + '</span></p>' +
             '<p><span class="key alt savings"/>Регулярні поповнення: <span class="amt">₴' + formatNumber(aSavingsExp[x - 1], 0, 0, true) + '</span></p>' +
             '<p><span class="key alt interest"/>Всього відсотків: <span class="amt">₴' + formatNumber(aInterestExp[x - 1], 0, 0, true) + '</span></p>' +
             '<p class="total">Всього накопичень: <span class="amt">₴' + formatNumber(aFvExp[x - 1], 0, 0, true) + '</span></p>' +
             '</div>';
     }


     $('#compoundInterestContainerResult').html(html);
     //  dataLayer.push({ event: 'calculatorCompleted' });
 }

 function exploreData() {
     //check if data has been entered in explore fields and return true/false
     if ($('#delay').val().length == 0 && $('#pmt-explore').val().length == 0) {

         return false;
     }
     if ($('#delay').val().length > 0 && $('#delay').val()[0] != "0") {

         return true;
     }
     if ($('#pmt-explore').val().length > 1 && $('#pmt-explore').val()[1] != "0") {

         return true;
     }

     return false;
 }

 //GENERIC FUNCTIONS
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

 function freqString(s) {
     s = parseInt(s);
     switch (s) {
         case 1:
             s = "на рік";
             break;
         case 12:
             s = "на місяць";
             break;
         case 26:
             s = "на квартал";
             break;
         case 52:
             s = "на тиждень";
             break;
         case 365:
             s = "на день";
             break;
     }
     return s;
 }

 // CALCULATIONS
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

 var chart;

 function drawColumnChart(pv, savings, interest, pv1, savings1, interest1) {
     //console.log("draw col chart");

     if (chart == undefined) {
         chart = new Highcharts.Chart({
             chart: { renderTo: 'chart', type: 'column' },
             colors: ['#A6BEFC', '#4C7DF8', '#0146F5', '#BDF0F4', '#42BFC7', '#1F1247'],
             credits: { enabled: false },
             legend: { enabled: false },
             title: { text: null },
             xAxis: { min: 1, title: { text: 'Роки' }, allowDecimals: false },
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
                     if (s == 1) { s = 'року'; } else { s = 'років'; }
                     s = '<table class="chart-tooltip"><tr><th>Після ' + this.x + ' ' + s + '</th><th>Ваша стратегія</th><th>Альтернатива</th><tr>' +
                         '<tr><td>Початковий депозит</td><td class="num">₴' + formatNumber(this.points[2].y, 0, 0, true) + '</td><td class="num">₴' + formatNumber(this.points[5].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td>Регулярні поповнення</td><td class="num">₴' + formatNumber(this.points[1].y, 0, 0, true) + '</td><td class="num">₴' + formatNumber(this.points[4].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td>Всього відсотків</td><td class="num">₴' + formatNumber(this.points[0].y, 0, 0, true) + '</td><td class="num">₴' + formatNumber(this.points[3].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td style="font-weight:bold">Всього</td><td class="num" style="font-weight:bold">₴' + formatNumber(this.points[0].y + this.points[1].y + this.points[2].y, 0, 0, true) + '</td><td class="num" style="font-weight:bold">₴' + formatNumber(this.points[3].y + this.points[4].y + this.points[5].y, 0, 0, true) + '</td></tr>' +
                         '</table>';
                     return s;
                 }
             },
             series: [{
                 name: 'Відсотки',
                 data: interest,
                 stack: 'original',
                 legendIndex: 3
             }, {
                 name: 'Регулярні поповнення',
                 data: savings,
                 stack: 'original',
                 legendIndex: 2
             }, {
                 name: 'Початковий депозит',
                 data: pv,
                 stack: 'original',
                 legendIndex: 1
             }, {
                 name: 'Відсотки',
                 data: interest1,
                 stack: 'compare',
                 legendIndex: 6
             }, {
                 name: 'Регулярні поповнення',
                 data: savings1,
                 stack: 'compare',
                 legendIndex: 5
             }, {
                 name: 'Початковий депозит',
                 data: pv1,
                 stack: 'compare',
                 legendIndex: 4
             }]
         });
     } else {
         //this will override the existing data with new data
         chart.series[0].setData(interest);
         chart.series[1].setData(savings);
         chart.series[2].setData(pv);
         chart.series[3].setData(interest1);
         chart.series[4].setData(savings1);
         chart.series[5].setData(pv1);
     }
     chart1 = undefined;
 }

 var chart1;

 function drawChart(pv, savings, interest) {
     //console.log("draw chart");
     $('#compoundInterestContainer .result').show();
     $('.explore').show();


     if (chart1 == undefined) {
         chart1 = new Highcharts.Chart({
             chart: { renderTo: 'chart', type: 'column' },
             colors: ['#A6BEFC', '#4C7DF8', '#0146F5', '#BDF0F4', '#42BFC7', '#1F1247'],
             credits: { enabled: false },
             legend: { enabled: false },
             title: { text: null },
             xAxis: { min: 1, title: { text: 'Роки' }, allowDecimals: false, minPadding: 0, maxPadding: 0 },
             yAxis: { title: { text: 'Заощадження' }, endOnTick: false },
             plotOptions: {
                 column: {
                     stacking: 'normal',
                     dataLabels: {
                         enabled: false,
                     }
                 },
                 series: { borderWidth: 0, groupPadding: 0, shadow: false, marker: { radius: 1 } }
             },
             tooltip: {
                 shared: true,
                 useHTML: true,
                 borderColor: '#42BFC7',
                 formatter: function() {
                     var s = this.x;
                     if (s == 1) { s = 'року'; } else { s = 'років'; }
                     s = '<table class="chart-tooltip"><tr><th>Після ' + this.x + ' ' + s + '</th><th>Ваша стратегія</th><tr>' +
                         '<tr><td>Початковий депозит</td><td class="num">₴' + formatNumber(this.points[2].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td>Регулярні поповнення</td><td class="num">₴' + formatNumber(this.points[1].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td>Всього відсотків</td><td class="num">₴' + formatNumber(this.points[0].y, 0, 0, true) + '</td></tr>' +
                         '<tr><td style="font-weight:bold">Всього</td><td class="num" style="font-weight:bold">₴' + formatNumber(this.points[0].y + this.points[1].y + this.points[2].y, 0, 0, true) + '</td></tr>' +
                         '</table>';
                     return s;
                 }
             },
             series: [{
                 name: 'Відсотки',
                 data: interest,
                 stack: 'original',
                 legendIndex: 3
             }, {
                 name: 'Регулярні поповнення',
                 data: savings,
                 stack: 'original',
                 legendIndex: 2
             }, {
                 name: 'Початковий депозит',
                 data: pv,
                 stack: 'original',
                 legendIndex: 1
             }]
         });
     } else {
         //this will override the existing data with new data
         chart1.series[0].setData(interest);
         chart1.series[1].setData(savings);
         chart1.series[2].setData(pv);
     }
     chart = undefined;
 }

 function serializeData(container) {
     changeCount++;
     var data = '';
     var inputs = container.querySelectorAll('input,select');
     inputs.forEach(function(input) {
         var inputVal = input.value;
         if (input.classList.contains('dollars')) {
             inputVal = inputVal.replace(/\D+/g, '');
         }
         data += inputVal + '|';
     });
     data += changeCount.toString();
     console.log(data);
     /*
     window.dataLayer.push({
         'incomeTaxCalcData': data,
     });
     */
 }