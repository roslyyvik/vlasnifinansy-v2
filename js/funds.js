var CALC_NAME = 'вартості обслуговування інвестфонду';
var chart;
var chart1;

var changeCount = 0;
var nIntervId;
var tries = 5;

function loadManagedFundsTimer() {
    nIntervId = setInterval(loadManagedFunds, 500);
}

function loadManagedFunds() {
    if (tries > 0) {
        if (typeof(msScriptsLoaded) != 'undefined') {
            tries = 0;
            clearInterval(nIntervId);
            // Load dependancy.
            moneysmartjs.loadScript(
                "script/calculator.js",
                function() {
                    // Dependancy is loaded, start main script.
                    var container = document.getElementById('managedFunds');
                    var managedFunds = {


                        init: function() {
                            managedFunds.DrawCalculator();

                            // show tooltips when specific fields take focus
                            $('#pv, #rate').on('focus', function(event) { $(this).prev().trigger('mouseenter'); });
                            $('#pv, #rate').on('blur', function(event) { $(this).prev().trigger('mouseleave'); });

                            //blur on enter key
                            $('input').on('keypress', function(e) { if (e.keyCode == 13) { $(this).blur(); } });

                            // VALIDATION
                            $('input.int').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
                            $('input.float').keyup(function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers
                            $('#managedFunds input[type="text"]').focus(function() {
                                this.select();
                                $(this).removeClass('empty');
                                if ($('input.empty:visible').length == 0) { $('#managedFunds .label-required').remove(); }
                            });
                            $('#managedFunds input[type="text"]').mouseup(function(e) { e.preventDefault(); });
                            $('#managedFunds input[type="text"]').blur(function() {
                                $('#rate-warning').empty(); // hide the high rate warning
                                if (this.value.length < 1) { $(this).val(0); /*this.value = (this.defaultValue)*/ };
                                if (this.id == 'nper' && this.value == 0) { $(this).val(1); } // set a min nper of 1
                                if (this.id == 'nper' && this.value > 30) { $(this).val(30); } // set a max nper of 30
                                if (this.id == 'rate' && this.value > 50) { $(this).val(50); } // set a max rate of 20
                                if (this.id == 'rate' && this.value > 40) { $('#rate-warning').text('Це здається дуже високим для довгострокової середньої прибутковості. Перш ніж продовжувати, перевірте середньострокову дохідність фонду.'); } // Show a high rate warning
                                if ($(this).hasClass('dollars')) { $(this).val('₴' + managedFunds.formatNumber($(this).val(), 0, 0, true)) };
                                if ($(this).hasClass('interest')) { $(this).val(managedFunds.formatNumber($(this).val(), 0, 2, true) + '%') };
                                if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років') };
                                if (this.id == 'pmt-explore') { $(this).val($(this).val() + ' ' + freqString($('#pmtFreq').val())); }
                                if (this.id == 'pv') { $('#pvExplore').val($(this).val()); } // update pvExplore each time pv is updated
                            });
                            $('#managedFunds input[type="text"]').blur(function() { managedFunds.calculate(); });
                            $('#managedFunds select').on('change', function(event) { managedFunds.calculate(); });

                            $('.input input, .input select').on('focus', function(event) {
                                chart = undefined;
                                chart1 = undefined;
                            });

                            $('.explore input').on('focus', function(event) { if (chart == undefined) { chart1 = undefined; } });

                            $('#rate').on('blur', function(event) { $('#rateExplore').val(managedFunds.formatNumber(this.value, 0, 2, true) + '%'); });

                            // explore scenario
                            $("#managedFunds ").on("click", ".whatif", function(event) { $(".explore h4:first").trigger("click"); });
                            var firstExpand = true;
                            $(".explore h4").click(function(event) {
                                //only allow to open
                                if ($(this).hasClass('open') == false) {
                                    $(this).toggleClass('open');
                                    $(this).nextAll('div.more:first').slideToggle();
                                    if (firstExpand) {
                                        managedFunds.calculate(true);
                                    }
                                    firstExpand = false;
                                }
                            });

                            $('#managedFunds .explore h4').attr('tabindex', '0');
                            $('#managedFunds .explore h4').attr('role', 'button');


                            //GA Tracking
                            //input amount
                            $("#managedFunds input").on("blur", function(event) { managedFunds.trackApp("Input", this.id, managedFunds.cleanVal(this.value)); });
                            $('#managedFunds select').on('change', function(event) { managedFunds.trackApp("Select", this.id, managedFunds.cleanVal(this.value)); });

                        },

                        DrawCalculator: function() { // CALCULATOR FRAMEWORK HTML
                            var html = '<h2 class="shaded">Калькулятор ' + CALC_NAME + '</h2>';

                            // inputs
                            html = html + '<div class="flex"><div class="input break"><p class="label-required">обов\'язкове поле</p><h3 class="col100">Ваш фонд</h3>' +
                                '<p><label>Сума: <span>(₴)</span> <button class="tooltip"><span class="visuallyhidden">Довідка щодо суми: </span> <span class="tooltiptext">Якщо це нова інвестиція, відніміть усі початкові збори з суми внеску.</span></button>  </label><input type="text" inputmode="numeric" class="int dollars empty" id="pv" /></p>' +
                                '<p><label>Інвестовано на: <span>(років)</span></label><input type="text" inputmode="numeric" class="int years empty" id="nper" /></p><hr class="col100 hr-break" />' +
                                '<p><label>Додайте внески: <span>(₴)</span></label><input type="text" inputmode="numeric" class="int dollars empty" id="pmt" /></p>' +
                                '<p><label>Періодичність внесків:</label><select id="pmtFreq" /></p>' +
                                '<p><label>Інвестиційний прибуток: <span>(%)</span> <button class="tooltip"><span class="visuallyhidden">Довідка щодо інвестиційного прибутку: </span> <span class="tooltiptext">УВАГА: Прибуток може сильно відрізнятися. Введіть прогнозований прибуток свого фонду на основі інформації на їх веб-сайті. Наприклад консервативний фонд може прогнозувати прибутковість близько 5,5% річних. більше 5 років ДО зборів та податків.</span></button>  </label><input type="text" inputmode="decimal" class="float interest empty" id="rate" /><span class="error" id="rate-warning" style="font-size: 0.9em;margin-top:5px"/></p>' +
                                '<hr class="col100"/><h3 class="col100">Кошти та витрати фонду <button class="tooltip"><span class="visuallyhidden">Довідка щодо зборів та витрат фонду: </span><span class="tooltiptext">Інформацію про плату та витрати можна знайти на веб-сайті вашого фонду.</span></button></h3>' +
                                '<p><label>Витрати на управління: <span>(% річний)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeMan" value="2.00%" /></p>' +
                                '<p><label>Інші витрати на управління: <span>(₴  щороку)</span></label><input type="text" inputmode="numeric" class="int dollars" id="feeManOther" value="₴0" /></p>' +
                                '<p><label>Комісійні за прийняття внеску: <span>(% від суми внеску)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeContrib" value="0.00%" /></p>' +
                                '<p><label>Плата за консультацію: <span>(%  за рік)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeAdviser" value="0.00%" /></p></div>';

                            // results
                            html = html + '<div id="results" class="result break"><h3>Результати / вплив комісійних</h3><div class="result-box"><div id="chart"/><div id="result"/></div></div></div>';

                            // explore
                            html = html + '<div class="explore">' +
                                '<h4 class="last">Порівняйте з іншим фондом</h4>' +
                                '<div class="last more hide"><div class="input">' +
                                '<p><label>Сума: <span>(₴)</span> <button class="tooltip"><span class="visuallyhidden">Довідка щодо суми: </span> <span class="tooltiptext">Відніміть з суми будь-які установчі комісійні. Якщо ви переміщуєте існуючу інвестицію, відніміть із балансу витрати на зняття коштів, наприклад, плату за зняття коштів, плату за припинення тощо.</span></button> </label><input type="text" inputmode="numeric" class="int dollars" id="pvExplore" /></p>' +
                                '<p><label>Інвестиційний прибуток: <span>(%)</span></label><input type="text" inputmode="decimal" class="float interest" id="rateExplore" /></p>' +
                                '<p style="clear:left"><label>Витрати на управління: <span>(% річний)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeManExplore" value="2.00%" /></p>' +
                                '<p><label>Інші витрати на управління: <span>(₴ щороку)</span></label><input type="text" inputmode="numeric" class="int dollars" id="feeManOtherExplore" value="₴0" /></p>' +
                                '<p><label>Комісійні за прийняття внеску: <span>(% від суми внеску)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeContribExplore" value="0.00%" /></p>' +
                                '<p><label>Плата за консультацію: <span>(% за рік)</span></label><input type="text" inputmode="decimal" class="float interest" id="feeAdviserExplore" value="0.00%" /></p></div>';
                            '</div>' +
                            '</div>';

                            $(container).html(html);

                            // select options
                            html = '<option value="52">Щотижня</option><option value="26">Двотижнево</option><option value="12" selected>Щомісяця</option><option value="1">Щорічно</option>';
                            $("#pmtFreq").html(html);
                        },


                        calculate: function() {
                            $('#result').hide();

                            if ($('input.empty:visible').length > 0) { return false; }
                            compare = false;
                            if ($('.explore h4').hasClass('open')) { compare = true; }
                            // strategy
                            var pv = managedFunds.cleanVal($('#pv').val());
                            var nper = managedFunds.cleanVal($('#nper').val());
                            var pmtFreq = managedFunds.cleanVal($('#pmtFreq').val());
                            var pmt = managedFunds.cleanVal($('#pmt').val());
                            var rate = managedFunds.cleanVal($('#rate').val()) / 100;
                            var nperFreq = 12; // hardcoded to compound monthly
                            var feeMan = managedFunds.cleanVal($('#feeMan').val()) / 100;
                            var feeManOther = managedFunds.cleanVal($('#feeManOther').val());
                            var feeContrib = managedFunds.cleanVal($('#feeContrib').val()) / 100;
                            var feeAdviser = managedFunds.cleanVal($('#feeAdviser').val()) / 100;
                            // explore
                            var pvExplore = managedFunds.cleanVal($('#pvExplore').val());
                            var rateExplore = managedFunds.cleanVal($('#rateExplore').val()) / 100;
                            var feeManExplore = managedFunds.cleanVal($('#feeManExplore').val()) / 100;
                            var feeManOtherExplore = managedFunds.cleanVal($('#feeManOtherExplore').val());
                            var feeContribExplore = managedFunds.cleanVal($('#feeContribExplore').val()) / 100;
                            var feeAdviserExplore = managedFunds.cleanVal($('#feeAdviserExplore').val()) / 100;
                            var type = 0;
                            var html = '';

                            // convert annual effective rate to annual nominal rate to use in calculations
                            rate = (Math.pow(rate + 1, 1 / 12) - 1) * 12;

                            var rateAfterFee = rate - feeMan - feeAdviser;

                            if (pmtFreq == 1) {
                                pmtFreq = 12;
                                pmt = -managedFunds.PMT(rate / nperFreq, pmtFreq, 0, pmt - (pmt * feeContrib), type);
                            } // calculate monthly pmt from annual
                            else { pmt = pmt * pmtFreq / 12; } // roll up weekly and fortnightly contributions to monthly base

                            //original
                            var pvAfterFee = pv - pv * feeContrib;
                            var pmtAfterFee = pmt - pmt * feeContrib;
                            rateExplore = (Math.pow(rateExplore + 1, 1 / 12) - 1) * 12;
                            //explore
                            var pvAfterFeeExplore = pvExplore - pvExplore * feeContribExplore;
                            var pmtAfterFeeExplore = pmt - pmt * feeContribExplore;
                            var rateAfterFeeExplore = rateExplore - feeManExplore - feeAdviserExplore;

                            // populate the data for the chart
                            var aPv = new Array();
                            aPv[0] = pvAfterFee;
                            var aFv = new Array();
                            aFv[0] = 0;
                            var aFees = new Array();
                            aFees[0] = 0;
                            var aPv1 = new Array();
                            aPv1[0] = pvAfterFeeExplore;
                            var aFv1 = new Array();
                            aFv1[0] = 0;
                            var aFees1 = new Array();
                            aFees1[0] = 0;
                            var FvNoFee;
                            var FvNoFeeExplore;

                            for (var i = 1; i <= nper; i++) {

                                // original scenario
                                aFv[i] = managedFunds.FV(rateAfterFee / nperFreq, nperFreq, -pmtAfterFee, -aPv[i - 1], type) - feeManOther;
                                aPv[i] = aFv[i];
                                FvNoFee = managedFunds.FV(rate / nperFreq, i * nperFreq, -pmt, -pv, type);
                                aFees[i] = FvNoFee - aFv[i];
                                if (aFees[i] < 0) { aFees[i] = 0; }

                                // alternative scenario
                                aFv1[i] = managedFunds.FV(rateAfterFeeExplore / nperFreq, nperFreq, -pmtAfterFeeExplore, -aPv1[i - 1], type) - feeManOtherExplore;
                                aPv1[i] = aFv1[i];
                                FvNoFeeExplore = managedFunds.FV(rateExplore / nperFreq, i * nperFreq, -pmt, -pvExplore, type);
                                aFees1[i] = FvNoFeeExplore - aFv1[i];
                                if (aFees1[i] < 0) { aFees1[i] = 0; }
                            }

                            var feesEffectExplore = (aFees1[aFees1.length - 1] / FvNoFeeExplore) * 100;

                            // Explore scenario
                            if (compare) {
                                html = '<h4>Альтернативний фонд після ' + nper + ' років:</h4><p><span class="key alt-fund"></span>' +
                                    'Баланс інвестицій: <span class="amt">₴' + managedFunds.formatNumber(aFv1[aFv1.length - 1], 0, 0, true) + '</span></p>' +
                                    '<p><span class="key alt-fees-effect"></span>' +
                                    'Вплив комісійних: <span class="amt">₴' + managedFunds.formatNumber(aFees1[aFees1.length - 1], 0, 0, true) + '</span></p>';
                                managedFunds.drawColumnChartExplore(aFv, aFees, aFv1, aFees1);
                                managedFunds.trackApp("Calculate", 'Compare');
                            }
                            // Strategy scenario
                            else {
                                managedFunds.drawColumnChart(aFv, aFees);
                                managedFunds.trackApp("Calculate", 'Simple');
                            }

                            var feesEffect = (aFees[aFees.length - 1] / FvNoFee) * 100;

                            html = '' +
                                '<h4>Ваш фонд після ' + nper + ' років:</h4>' +
                                '<p><span class="key your-fund"></span>' +
                                'Баланс інвестицій: <span class="amt">₴' + managedFunds.formatNumber(aFv[aFv.length - 1], 0, 0, true) + '</span></p>' +
                                '<p><span class="key fees-effect"></span>' +
                                'Вплив комісійних: <span class="amt">₴' + managedFunds.formatNumber(aFees[aFees.length - 1], 0, 0, true) + '</span></p>' + html;

                            $('#result').html(html);
                            $('#result').show();

                            $('#managedFunds .result').show();
                            $('.explore').show();
                            // dataLayer.push({ event: 'calculatorCompleted' });

                        },

                        cleanVal: function(v) {
                            v = v.replace(/[^0-9.]/g, '');
                            if (isNaN(v) || v.length < 1) { v = 0 }
                            return parseFloat(v);
                        },

                        formatNumber: function(number, digits, decimalPlaces, withCommas) {
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

                                string += "." + managedFunds.formatNumber(number, decimalPlaces, 0);
                            }

                            return string;
                        },

                        // FV - returns the future value of an investment based on an interest rate and a constant payment schedule
                        FV: function(rate, nper, pmt, pv, type) {
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
                        },

                        // PMT - returns the payment amount for a loan based on an interested rate and a constant payment schedule
                        PMT: function(rate, nper, pv, fv, type) {
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
                        },

                        drawColumnChart: function(fv, fees) {
                            if (chart == undefined) {
                                chart = new Highcharts.Chart({
                                    chart: { renderTo: 'chart', type: 'column' },
                                    colors: ['#A6BEFC', '#0047F5', '#ACE8FA', '#42BFC7'],
                                    credits: { enabled: false },
                                    legend: { enabled: false },
                                    title: { text: null },
                                    xAxis: { min: 1, title: { text: 'Роки' }, allowDecimals: false },
                                    yAxis: { title: { text: 'Накопичення' }, endOnTick: false },
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
                                            s = '<table class="chart-tooltip"><tr><th>Після ' + this.x + ' ' + s + '</th><th style="color:#4C7DF8">Ваш фонд</th><tr>' +
                                                '<tr><td>Інвестиційний баланс:</td><td class="num">₴' + managedFunds.formatNumber(this.points[1].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[1].y / (this.points[0].y + this.points[1].y) * 100, 0, 2, true) + '%)</td></tr>' +
                                                '<tr><td>Вплив комісійних:</td><td class="num">₴' + managedFunds.formatNumber(this.points[0].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[0].y / (this.points[0].y + this.points[1].y) * 100, 0, 2, true) + '%)</td></tr>' +
                                                '</table>';
                                            return s;
                                        }
                                    },
                                    series: [{
                                        name: 'Fees',
                                        data: fees,
                                        stack: 'original',
                                        legendIndex: 2
                                    }, {
                                        name: 'FV',
                                        data: fv,
                                        stack: 'original',
                                        legendIndex: 1
                                    }]
                                });
                            } else {
                                //this will override the existing data with new data
                                chart.series[0].setData(fees);
                                chart.series[1].setData(fv);
                            }
                            chart1 = undefined;
                        },

                        drawColumnChartExplore: function(fv, fees, fv1, fees1) {
                            if (chart1 == undefined) {
                                chart1 = new Highcharts.Chart({
                                    chart: { renderTo: 'chart', type: 'column' },
                                    colors: ['#A6BEFC', '#0047F5', '#ACE8FA', '#42BFC7'],
                                    credits: { enabled: false },
                                    legend: { enabled: false },
                                    title: { text: null },
                                    xAxis: { min: 1, title: { text: 'Роки' }, allowDecimals: false },
                                    yAxis: { title: { text: 'Накопичення' }, endOnTick: false },
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
                                            s = '<table class="chart-tooltip"><tr><th>Після ' + this.x + ' ' + s + '</th><th style="color:#0047F5">Ваш фонд</th><th style="color:#42BFC7">Альтернативний фонд</th><tr>' +
                                                '<tr><td>Інвестиційний баланс:</td><td class="num">₴' + managedFunds.formatNumber(this.points[1].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[1].y / (this.points[0].y + this.points[1].y) * 100, 0, 2, true) + '%)</td>' +
                                                '<td class="num">₴' + managedFunds.formatNumber(this.points[3].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[3].y / (this.points[2].y + this.points[3].y) * 100, 0, 2, true) + '%)</td></tr>' +
                                                '<tr><td>Вплив комісійних:</td><td class="num">₴' + managedFunds.formatNumber(this.points[0].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[0].y / (this.points[0].y + this.points[1].y) * 100, 0, 2, true) + '%)</td>' +
                                                '<td class="num">₴' + managedFunds.formatNumber(this.points[2].y, 0, 0, true) +
                                                ' (' + managedFunds.formatNumber(this.points[2].y / (this.points[2].y + this.points[3].y) * 100, 0, 2, true) + '%)</td></tr>' +
                                                '</table>';
                                            return s;
                                        }
                                    },
                                    series: [{
                                        name: 'Fees',
                                        data: fees,
                                        stack: 'original',
                                        legendIndex: 2
                                    }, {
                                        name: 'FV',
                                        data: fv,
                                        stack: 'original',
                                        legendIndex: 1
                                    }, {
                                        name: 'Fees',
                                        data: fees1,
                                        stack: 'compare',
                                        legendIndex: 4,
                                        borderColor: '#42BFC7'
                                    }, {
                                        name: 'FV1',
                                        data: fv1,
                                        stack: 'compare',
                                        legendIndex: 3,
                                        borderColor: '#42BFC7'
                                    }]
                                });
                            } else {
                                //this will override the existing data with new data
                                chart1.series[0].setData(fees);
                                chart1.series[1].setData(fv);
                                chart1.series[2].setData(fees1);
                                chart1.series[3].setData(fv1);
                            }
                            chart = undefined;
                        },

                        trackApp: function(action, label, value) {
                            if (typeof value == "undefined") { value = 0 }
                            value = parseInt(value); // we are limited to only passing ints
                            moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, action, label, value, true);
                        }

                    }
                    managedFunds.init();
                }

            );

        } else {
            tries--;
            console.log('MS Scripts not loaded...');
        }
    } else {
        clearInterval(nIntervId);
    }
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
    window.dataLayer.push({
        'incomeTaxCalcData': data
    });
}

var moneysmartjs = {
    loadScript: function(src, done) {
        var js = document.createElement('script');
        js.src = src;
        js.onload = function() {
            done();
        }
        js.onerror = function() {
            done(new Error('Failed to load script ' + src));
        }
        document.head.appendChild(js);
    },
    trackEvent: function(category, action, label, val, nonInteraction) {
        nonInteraction = nonInteraction || false;
    }
}
var msScriptsLoaded = false;

loadManagedFundsTimer();