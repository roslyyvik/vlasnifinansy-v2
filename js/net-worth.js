 /* Changelog
         20130704 - Updated GA event tracking code to be included in bounce rate calculation
         20131220 - Added toolbar with profile saving avalibility. Lots of code changes are included in this build
         20140113 - Changed input validation on toolbox to only target #save-profile-name
         20140526 - Updated calls to $('#toolbox').on to $(document.body).on because the toolbox was dynamically inserted to the DOM
         20140912 - Rewritten the layout and CSS to be responsive
         20160727 - Bug fixes and MS login handling
         */

 //GLOBAL VARS
 var CALC_NAME = 'чистої вартості';
 var appid = 26;
 var appversion = 1;
 var MSloggedIn = false;
 var profileXML;
 var profileListDefault = '<option name="default" value="" selected="selected">Оберіть збережений калькулятор</option>';
 var appprofile = '';

 $(document).ready(function() {

     //Draw calculator framework
     DrawCalculator();

     //add html5 pattern so touch default to numeric keyboard
     var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
     if (ismobile) { $('#yourNetWorthContainer input[type="text"]').attr('pattern', '[0-9]*'); }

     //blur on enter key
     $('#yourNetWorthContainer').on('keypress', 'input', function(e) {
         if (e.keyCode == 13) {
             $(this).blur();
             $(this).parents('p').next('p').children('input.dollars').focus();
         }
     });

     // VALIDATION
     $('input.dollars').keyup(function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
     $('#yourNetWorthContainer').on('focus', 'input', function() { this.select(); });
     $('#yourNetWorthContainer').on('mouseup', 'input', function(e) { e.preventDefault(); });
     $('#yourNetWorthContainer').on('blur', 'input', function() {
         if (this.value.length < 1 && $(this).hasClass('dollars')) { $(this).val(0); };
         if ($(this).hasClass('dollars')) { $(this).val('₴' + formatNumber($(this).val(), 0, 0, true)) };
         if ($(this).hasClass('interest')) { $(this).val(formatNumber($(this).val(), 0, 2, true) + '%') };
         if ($(this).hasClass('years')) { $(this).val(parseInt($(this).val()) + ' років') };
         calculate();
     });
     $('#yourNetWorthContainer').on('keyup', 'input.int', function() { this.value = this.value.replace(/[^0-9]/g, ''); }); //full numbers only
     $('#yourNetWorthContainer').on('keyup', 'input.float', function() { this.value = this.value.replace(/[^0-9\.]/g, ''); }); //decimal numbers
     $('#yourNetWorthContainer').on('keyup', 'input.description', function() { this.value = this.value.replace(/[^a-zA-Z0-9 _!#$%-]/g, ''); }); //remove special characters
     $(document.body).on('keyup', '#save-profile-name', function() { this.value = this.value.replace(/[^a-zA-Z0-9 _!#$%-]/g, ''); }); //remove special characters

     // highlight the selected row
     $('#yourNetWorthContainer').on('focus blur', "input", function() { $(this).parents('p').toggleClass('highlight'); });

     // remove an item
     $('#yourNetWorthContainer').on('click', '.custom button.delete', function() {
         $(this).parents('p').remove();
         calculate()
     });

     // add a new item
     $('p.add button').click(function() {
         var d = new Date();
         d = d.getTime();
         var html = '<p class="custom"><input type="text" class="description" placeholder="Введіть опис"> <input inputmode="numeric" type="text" class="dollars" id="' + d + '" placeholder="Введіть значення">' +
             '<button class="delete" title="Remove this item">Видалити</button></p>';
         $(html).insertBefore($(this).parents('p'));
         $(this).parents('p').prevAll('p:first').find('input:first').focus();
     });

     //GA Tracking
     //  $('#yourNetWorthContainer').on('blur', 'input', function() {
     //      var name = $(this).parents('p').text();
     //      if (name == ' Delete') { name = 'Custom' } //this is a personalised item
     //      trackApp('Input - ' + name, this.value);
     //  });
 });

 //  function trackApp(action, label) {
 //      moneysmartjs.trackEvent('Calculator - ' + CALC_NAME, action, label);
 //  };

 //CALCULATIONS
 function calculate() {
     var assetTotal = 0;
     var liabilitiesTotal = 0;
     var expenseCount = 0;
     var incomeCount = 0;

     $('.input.assets input').each(function(index) {
         if (cleanVal(this.value) > 0) { incomeCount++; }
         assetTotal = assetTotal + cleanVal(this.value);
     });
     $('.assets .subtotal span').text('₴' + formatNumber(assetTotal, 0, 0, true));

     $('.input.liabilities input').each(function(index) {
         if (cleanVal(this.value) > 0) { expenseCount++; }
         liabilitiesTotal = liabilitiesTotal + cleanVal(this.value);
     });
     $('.liabilities .subtotal span').text('₴' + formatNumber(liabilitiesTotal, 0, 0, true));

     var total = assetTotal - liabilitiesTotal;
     if (total < 0) { $('.networth span').text('-₴' + formatNumber(total, 0, 0, true)).addClass('negative'); } else { $('.networth span').text('₴' + formatNumber(total, 0, 0, true)).removeClass('negative'); }

     //  if (incomeCount >= 1 && expenseCount >= 1) {
     //      //mark calculator complete if 1 asset and 1 liability entered
     //      dataLayer.push({ event: 'calculatorCompleted' });
     //  }
 }

 //HTML
 function DrawCalculator() { // CALCULATOR FRAMEWORK HTML
     var html = '<h2 class="shaded col100">Калькулятор ' + CALC_NAME + ' </h2>';

     // ASSETS
     var assets = [
         'Ваш дім',
         'Інша власність/ділянки',
         'Пенсійне забезпечення',
         'Tрасти',
         'Цінні папери',
         'Інші інвестиції',
         'Заощадження',
         'Вартість бізнесу',
         'Транспорт'
     ];

     var s = '';
     for (var i = 0; i < assets.length; i++) {
         s = s + '<p class="core"><label for="asset' + i + '">' + assets[i] + '</label><input inputmode="numeric" type="text" class="dollars" id="asset' + i + '"/></p>';
     }

     // asset html
     html = html + '<div class="break input assets"><h3>Активи <span style="font-weight:normal">(чим володієте)</span></h3>' +
         s +
         '<p class="add col100"><button>Додати розділ [+]</button></p>' +
         '<p class="subtotal mobile">Всього активів: <span/></p>' +
         '</div>';

     // LIABILITIES
     var liabilities = [
         'Іпотека / кредит на інвестиційну власність',
         'Споживчий кредит',
         'Кредит на авто',
         'Інвестиційний кредит',
         'Кредит на навчання',
         'Заборгованість за кредитною карткою',
         'Кредит за орендою',
         'Безпроцентний кредит',
         'кредит на бізнес'
     ];

     s = '';
     for (var i = 0; i < liabilities.length; i++) {
         s = s + '<p class="core"><label for="liability' + i + '">' + liabilities[i] + '</label><input inputmode="numeric" type="text" class="dollars" id="liability' + i + '"/></p>';
     }

     // liability html
     html = html + '<div class="break input liabilities"><h3>Зобов\'язання <span style="font-weight:normal">(що заборгували)</span></h3>' +
         s +
         '<p class="add col100"><button>Додати розділ [+]</button></p>' +
         '<p class="subtotal mobile">Всього зобов\'язань: <span/></p>' +
         '</div><hr class="col100">';

     // totals
     html = html + '<div class="desktop break assets"><p class="subtotal asset">Всього активи: <span/></p></div>' +
         '<div class="desktop break liabilities"><p class="subtotal">Всього зобов\'язання: <span/></p></div>';
     html = html + '<p class="networth col100 enlarge-text">Ваша загальна чиста вартість: <span/></p>';

     $("#yourNetWorthContainer").html(html);

 }

 //GENERIC FUNCTIONS
 function cleanVal(v) {
     v = v.replace(/[^0-9.]/g, '');
     if (isNaN(v) || v.length < 1) { v = 0 }
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