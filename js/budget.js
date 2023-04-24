function DrawBP() {
    for (var b = '<div class="header"><h2>БЮДЖЕТ</h2><div class="input">',
            a = [
                { label: "Ваша зарплата", id: "income1" },
                { label: "Зарплата Вашого партнера", id: "income2" },
                { label: "Бонуси та інші премії", id: "income3" },
                { label: "Дохід від депозитів та інвестицій", id: "income4" },
                { label: "Подарунки", id: "income5" },
                { label: "Соціальні виплати на родину", id: "income6" },
                { label: "Соціальні на утримання дитини", id: "income7" },
                { label: "Інші надходження", id: "incomeOther" }
            ],
            c = "",
            d = 0; d < a.length; d++)
        c = c + '<div class="item core ' + a[d].id + '"><label for="' + a[d].id + '">' + a[d].label + '</label><input type="text" class="amount" id="' + a[d].id + '"/><select id="' + a[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="income"><h3>Доходи<span/></h3>' + c + '</div>';
    for (var l = [
                { label: "Іпотека/оренда", id: "home1" },
                { label: "Послуги за утримання/квартплата", id: "home2" },
                { label: "Теплопостачання", id: "home3" },
                { label: "Меблі та техніка", id: "home4" },
                { label: "Ремонт та технічне обслуговування", id: "home5" },
                { label: "Електрика", id: "home6" },
                { label: "Газ", id: "home7" },
                { label: "Водопостачання", id: "home8" },
                { label: "Інтернет", id: "home9" },
                { label: "Кабельне TV", id: "home10" },
                { label: "Домашній телефон", id: "home11" },
                { label: "Мобільний телефон", id: "home12" },
                { label: "Інші витрати", id: "homeOther" }
            ],
            c = "",
            d = 0; d < l.length; d++)
        c = c + '<div class="item core ' + l[d].id + '"><label for="' + l[d].id + '">' + l[d].label + '</label><input type="text" class="amount" id="' + l[d].id + '"/><select id="' + l[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="home-utilities"><h3>Помешкання та комунальні<span/></h3>' + c + '</div>';
    for (var m = [
                { label: "Страхування авто", id: "insurance1" },
                { label: "Страхування нерухомості", id: "insurance2" },
                { label: "Страхування життя", id: "insurance3" },
                { label: "Медичне страхування", id: "insurance4" },
                { label: "Страхування автокредиту", id: "insurance5" },
                { label: "Страхування кредитної картки", id: "insurance6" },
                { label: "Інші кредити", id: "insurance7" },
                { label: "Страхування сплати кредитів" },
                { label: "Страхування депозитів", id: "insurance9" },
                { label: "Страхування інвестицій", id: "insurance10" },
                { label: "Благодійність", id: "insurance11" },
                { label: "Інше", id: "insuranceOther" }
            ],
            c = "",
            d = 0; d < m.length; d++)
        c = c + '<div class="item core ' + m[d].id + '"><label for="' + m[d].id + '">' + m[d].label + '</label><input type="text" class="amount" id="' + m[d].id + '"/><select id="' + m[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="insurance-financial"><h3>Фінанси та страхування<span/></h3>' + c + '</div>';
    for (var n = [
                { label: "Супермаркет", id: "groceries1" },
                { label: "М`ясні продукти" },
                { label: "Фрукти та овочі", id: "groceries3" },
                { label: "Морепродукти" },
                { label: "Кулінарія та хлібобулочні вироби" },
                { label: "Напої" },
                { label: "Інше", id: "groceriesOther" }
            ],
            c = "",
            d = 0; d < n.length; d++)
        c = c + '<div class="item core ' + n[d].id + '"><label for="' + n[d].id + '">' + n[d].label + '</label><input type="text" class="amount" id="' + n[d].id + '"/><select id="' + n[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="groceries"><h3>Продукти<span/></h3>' + c + '</div>';
    for (var p = [
                { label: " Косметика та туалетні засоби", id: "personal1" },
                { label: "Салони", id: "personal2" },
                { label: "Медицина та аптека", id: "personal3" },
                { label: "Окуляри та догляд за очима", id: "personal4" },
                { label: "Лікування зубів", id: "personal5" },
                { label: "Лікарі", id: "personal6" },
                { label: "Хоббі", id: "personal7" },
                { label: "Одяг та взуття", id: "personal8" },
                { label: "Ювелірні вироби та аксесуари" },
                { label: "Комп`ютери та гаджети" },
                { label: "Спорт та тренажерний зал", id: "personal11" },
                { label: "Освіта", id: "personal12" },
                { label: "Утримання домашніх тварин", id: "personal13" },
                { label: "Інше", id: "personalOther" }
            ],
            c = "",
            d = 0; d < p.length; d++)
        c = c + '<div class="item core ' + p[d].id + '"><label for="' + p[d].id + '">' + p[d].label + '</label><input type="text" class="amount" id="' + p[d].id + '"/><select id="' + p[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="personal-medical"><h3>Догляд та медицина<span/></h3>' + c + '</div>';
    for (var r = [
                { label: "Кава та чай", id: "entertainment1" },
                { label: "Обіди у закладах", id: "entertainment2" },
                { label: "Харчування на роботі", id: "entertainment3" },
                { label: "Цигарки", id: "entertainment4" },
                { label: "Напої та алкоголь", id: "entertainment5" },
                { label: "Бари та клуби", id: "entertainment6" },
                { label: "Ресторани", id: "entertainment7" },
                { label: "Книги", id: "entertainment8" },
                { label: "Газети та журнали", id: "entertainment9" },
                { label: "Фільми та музика", id: "entertainment10" },
                { label: "Дні народження", id: "entertainment11" },
                { label: "Свята та благодійність", id: "entertainment12" },
                { label: "Інше", id: "entertainmentOther" }
            ],
            c = "",
            d = 0; d < r.length; d++)
        c = c + '<div class="item core ' + r[d].id + '"><label for="' + r[d].id + '">' + r[d].label + '</label><input type="text" class="amount" id="' + r[d].id + '"/><select id="' + r[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="entertainment-eatout"><h3>Розваги та харчування за межами<span/></h3>' + c + '</div>';
    for (var q = [
                { label: "Автобус, залізниця, пароми", id: "transport1" },
                { label: "Пальне", id: "transport2", old: "shopping12" },
                { label: "Транспортні витрати та паркування", id: "transport3" },
                { label: "Дозволи", id: "transport4" },
                { label: "Ремонт та технічне обслуговування", id: "transport5" },
                { label: "Штрафи", id: "transport6" },
                { label: "Авіаквитки", id: "transport7" },
                { label: "Інше", id: "transportOther" }
            ],
            c = "",
            d = 0; d < q.length; d++)
        c = c + '<div class="item core ' + q[d].id + '"><label for="' + q[d].id + '">' + q[d].label + '</label><input type="text" class="amount" id="' + q[d].id + '"/><select id="' + q[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="transport-auto"><h3>Транспорт та авто<span/></h3>' + c + '</div>';
    for (var s = [
                { label: "Дитяче харчування", id: "children1" },
                { label: "Іграшки", id: "children2" },
                { label: "Догляд за дитиною", id: "children3" },
                { label: "Няня", id: "children4" },
                { label: "Спорт та активність", id: "children5" },
                { label: "Шкільні витрати", id: "children6" },
                { label: "Екскурсії", id: "children7" },
                { label: "Шкільна форма", id: "children8" },
                { label: "Інші потреби на школу", id: "children9" },
                { label: "Виплати на утримання дитини", id: "children10" },
                { label: "Інше", id: "childrenOther" }
            ],
            c = "",
            d = 0; d < s.length; d++)
        c = c + '<div class="item core ' + s[d].id + '"><label for="' + s[d].id + '">' + s[d].label + '</label><input type="text" class="amount" id="' + s[d].id + '"/><select id="' + s[d].id + '"/><span class="total"></span></div>';
    b = b + '<div class="category" id="children"><h3>Діти<span/></h3>' + c + '</div>';
    b += '</div></div><div class="footer"/>',
        $("#calculator-container").html(b),
        b = '<label for="profile-list" class="hide"></label><select id="profile-list"></select><a class="save icon" title="Зберегти" href="javascript:void(0);">Save</a><a class="delete icon" title="Видалити" href="javascript:void(0);">Delete</a><a class="new icon" title="Новий" href="javascript:void(0);">New</a><a class="print icon" title="Друкувати" href="javascript:void(0);">Print</a><a class="settings icon" title="Налаштування" href="javascript:void(0);">Settings</a>',
        $("#calculator-container #toolbar").html(b),
        b = '<div id="summary"><h3>Всього <span/></h3><div id="result"/></div>',
        $(".input").append(b),
        $("#calculator-container label").append(' <a href="javascript:void(0);" class="custom">[Додайте розділ]</a>'),
        0 === useDecimals ? $(".item input").addClass("int") : $(".item input").addClass("float"),
        $(".input select").html('<option value="52">Щотижня</option><option value="26">Двотижнево</option><option value="12">Щомісяця</option><option value="4">Щокварталу</option><option value="1">Щороку</option>'),
        $(".input").prepend('<div style="padding:0;margin:0"><h3 >Дивитись: <select id="frequency"><option value="1">Річний</option><option value="4">Квартальний</option><option value="12">Місячний</option><option value="26">Двотижневий</option><option value="52">Тижневий</option></select></h3></div>'),
        CheckLoggedIn(),
        "" !== appprofile && ($("#profile-list").prepend(profileListDefault), $("#profile-list").val(""), appprofile = ""),
        ismobile && $("input.amount").attr("pattern", "[0-9]*"),
        $(".item, #result").hide(),
        UpdateBudget();
}

function updateSummary() {
    totalIncome = cleanVal($("#income h3 span").text()),
        totalHome = cleanVal($("#home-utilities h3 span").text()),
        totalInsurance = cleanVal($("#insurance-financial h3 span").text()),
        totalGroceries = cleanVal($("#groceries h3 span").text()),
        totalPersonal = cleanVal($("#personal-medical h3 span").text()),
        totalEntertainment = cleanVal($("#entertainment-eatout h3 span").text()),
        totalTransport = cleanVal($("#transport-auto h3 span").text()),
        totalChildren = cleanVal($("#children h3 span").text()),
        totalNett = totalIncome - totalHome - totalInsurance - totalGroceries - totalPersonal - totalEntertainment - totalTransport - totalChildren;
    var a = "( Доходи: " + formatNumber(totalIncome, 0, useDecimals, !0, useCurrency) + " - Витрати: " + formatNumber(totalHome + totalInsurance + totalGroceries + totalPersonal + totalEntertainment + totalTransport + totalChildren, 0, useDecimals, !0, useCurrency) + ")",
        b = '<h4 style="text-align:center;margin-top:15px">' + $("#frequency option:selected").text() + ' розподіл витрат:</h4><div id="chart"/>';
    totalNett >= 0 ? (b = '<h4 class="neutral">Вітаю! Ваш бюджет позитивний. ' + a + "</h4>" + b, b += '<h4>Наступні кроки</h4><ul><li>Перевірте: чи збільшуються щомісяця залишки на банківському рахунку? Якщо результат негативний, скористайтесь мобільними додатками, таблицями щоденних витрат, калькулятором бюджету, щоб відстежувати фактичні витрати.</li><li>Якщо у вас накопичуються кошти щомісяця, подумайте як краще їх використати для досягнення цілей або використати для сплати існуючих боргів.</li></ul>',
            0 === totalNett && (b = '<h4 class="neutral">Ви витратили все що заробили.</h4>' + b, b += '<h4>Наступні кроки</h4><ul><li>Розгляньте можливість скорочення витрат і заощадженя коштів кожного періоду. Знову попрацюйте з бюджетом, щоб побачити де можна скоротити витрати.</li><li>З`ясуйте для себе реальний стан справ: чи збільшуються щомісяця залишки на банківському рахунку? Якщо результат негативний, скористайтесь скористайтесь мобільними додатками, таблицями щоденних витрат, калькулятором бюджету,щоб відстежувати фактичні витрати.</li></ul>')) : (b = '<h4 class="deficit">Ви витрачаєте більше ніж заробляєте. ' + a + "</h4>" + b, b += '<h4>Наступні кроки</h4><ul><li>Розгляньте можливість скорочення витрат і заощадженя коштів кожного періоду. Знову попрацюйте з бюджетом, щоб побачити де можна скоротити витрати.</li><li>З`ясуйте для себе реальний стан справ: чи збільшуються щомісяця залишки на банківському рахунку? Якщо результат негативний, скористайтесь мобільними додатками, таблицями щоденних витрат, калькулятором бюджету,щоб відстежувати фактичні витрати. </li></ul>'),
        $("#result").html(b);
    var c = [
        ["Помешкання та комунальні", totalHome],
        ["Фінанси та страхування", totalInsurance],
        ["Продукти", totalGroceries],
        ["Догляд та медицина", totalPersonal],
        ["Розваги та харчування за межами", totalEntertainment],
        ["Транспорт та авто", totalTransport],
        ["Діти", totalChildren]
    ];
    drawSpendingChart(c);
}

function child(a, b, c, d) {
    "undefined" === typeof a && (a = new Date, a = "c" + a.getTime(), b = "", c = "");
    var e = '<div class="item child ' + a + '"><label><input type="text" class="name" placeholder="Додайте розділ" value="' + b + '"><a class="delete-item" href="javascript:void(0);" title="Видалити розділ">Delete</a></label><input type="text" class="amount" id="' + a + '" value="' + c + '"><select id="' + a + '-freq"><option value="52">Щотижня</option><option value="26">Двотижнево</option><option value="12">Щомісяця</option><option value="4">Щокварталу</option><option value="1">Щороку</option></select><span class="total"></span></div>';
    return e;
}

function restoreChild(a, b, c, d, e) {
    var f = child(b, c, d, e);
    $(".item.core." + a).after(f),
        $(".item.core." + a).find("input, select, span").addClass("hide"),
        $("#" + b + "-freq").val(e),
        $(".delete-item").hide(),
        $(".item.core." + a).is(":visible") || $(".item.child." + b).hide();
}

function MSLoggedInCallBack() {
    CheckLoggedIn(),
        positionAppToolbox();
}

function CheckLoggedIn() {
    var a = new Date;
    $("#profile-list").html(profileListDefault);
    var b = apphost + "/ws/moneysmart/userinput/" + appid + "?" + a.getTime();
    $.ajax({
        type: "GET",
        url: b,
        cache: !1,
        dataType: "text",
        success: function(a) {
            profileXML = a,
                MSloggedIn = !0,
                restoreProfiles();
        },
        error: function(a, b, c) {
            return MSloggedIn = !1, !1;
        }
    });
}

function LoadProfile(a) {
    var b = $("#toolbar select").val(),
        c = "Restored " + b;
    if (0 === b) return !1;
    if (1 !== a) return showAppToolbox("load-profile"), !1;
    var d = new Date,
        e = apphost + "/ws/moneysmart/userinput/" + appid + "?appver=" + appversion + "&Profile=" + b + "&" + d.getTime();
    $.ajax({
        url: e,
        cache: !1,
        dataType: "html",
        success: function(a) {
            profileXML = a;
            var d = restoreFromXML();
            ShowStatus(c + d),
                appprofile = b,
                trackApp("Load profile", b);
        }
    });
}

function DeleteProfile(a) {
    var b = $("#toolbar select").val(),
        c = "No budget seleted for deletion";
    if (0 === b) return $(".delete-error").text(c), !1;
    var d = apphost + "/ws/MoneySmart/DeleteUserInput/" + appid + "?appver=" + appversion + "&Profile=" + b;
    $.ajax({
        contentType: "application/xml",
        type: "POST",
        processData: !1,
        url: d,
        success: function(a) {
            DrawBP(),
                ShowStatus("Successfully deleted " + b),
                trackApp("Deleted profile", b);
        },
        dataType: "xml",
        error: function(a, c, d) {
            ShowStatus("Failed to delete " + b),
                trackApp("Error - Deleting profile", a.status + d);
        }
    });
}

function buildAppXML() {
    var a = 0,
        b = '<AppUserInputRequest xmlns="http://moneysmart.gov.au/AppUserInputRequest">\r<xmlUserInput><budgetplan>';
    return b += "<core-items>",
        $(".item.core").each(function(c) {
            a = cleanVal($(this).find("input.amount").val()),
                a > 0 && (b = b + '<item id="' + $(this).find("input.amount").attr("id") + '">', b = b + "<amount>" + a + "</amount>", b = b + "<frequency>" + $(this).find("select").val() + "</frequency>", b += "</item>");
        }),
        b += "</core-items>",
        b += "<custom-items>",
        $(".item.child").each(function(c) {
            a = cleanVal($(this).find("input.amount").val()),
                a > 0 && (b = b + '<item id="' + $(this).find("input.amount").attr("id") + '">', b = b + "<parent>" + $(this).prevAll(".item.core:first").find("input.amount").attr("id") + "</parent>", b = b + "<name>" + $(this).find("input.name").val() + "</name>", b = b + "<amount>" + a + "</amount>", b = b + "<frequency>" + $(this).find("select").val() + "</frequency>", b += "</item>");
        }),
        b += "</custom-items>",
        b = b + "<settings><currency>" + useCurrency + "</currency><decimals>" + useDecimals + "</decimals><custom>" + useCustomCategories + "</custom></settings>",
        b += "</budgetplan>",
        b += "</xmlUserInput>",
        b += "</AppUserInputRequest>";
}

function SaveProfile(a) {
    var b = $("#toolbar select").val(),
        c = buildAppXML(),
        d = $("#save-profile-name").val(),
        e = "Встановіть назву бюджету";
    if ($(".save-as-error").text(""), "saveas" === a) {
        if (!(d.length > 0))
            return $(".save-as-error").text(e), !1;
        if (b = d, void 0 !== $('#toolbar select option[name="' + b + '"]').val())
            return $(".save-as-error").text("Таке ім`я вже існує"), !1;
        $("#save-profile-name").val(""),
            $("#toolbox .close").trigger("click");
    }
    var f = apphost + "/ws/moneysmart/userinput/" + appid + "?appver=" + appversion + "&Profile=" + b;
    return "0" === b || "" === b ? (showAppToolbox("save-as"), !1) : void $.ajax({
        contentType: "application/xml",
        type: "POST",
        processData: !1,
        url: f,
        data: c,
        success: function(c) {
            CheckLoggedIn(),
                appprofile = b,
                ShowStatus("Successfully saved " + b),
                "saveas" === a ? trackApp("Save as", b) : trackApp("Save", b);
        },
        dataType: "xml",
        error: function(a, c, d) {
            return ShowStatus("Failed to save " + b),
                trackApp("Error - Saving profile", a.status + d), !1;
        }
    });
}

function restoreFromXML() {
    var b,
        c,
        d,
        e,
        f,
        a = profileXML,
        g = "";
    DrawBP();
    var h = new Array;
    for (h[1] = "income", h[2] = "financial", h[3] = "utilities", h[4] = "education", h[5] = "shopping", h[6] = "entertainment", i = 1; i < h.length; i++)
        $.fromXMLString(a).find(h[i]).each(function() {
            b = $(this).attr("id"),
                d = parseInt($(this).find("frequency").text()),
                e = parseFloat($(this).find("amount").text());
            var a = parseFloat($("input." + b).val()),
                c = parseFloat($("select." + b).val());
            a > 0 && (e = e * d + a * c, d = 1, g = "This budget was created using an older version of the budget planner. FYI some items/amounts from the old budget have now been merged into a single item in the new budget.<br/>For a further explanation of these items, please refer to the FAQ section below."),
                $("input." + b).val(e),
                $("select." + b).val(d);
        });
    $.fromXMLString(a).find("core-items").find("item").each(function() {
        b = $(this).attr("id"),
            d = $(this).find("frequency").text(),
            e = $(this).find("amount").text(),
            $("#" + b).val(e),
            $("#" + b + "-freq").val(d);
    });
    var c;
    return $.fromXMLString(a).find("custom-items").find("item").each(function() {
            b = $(this).attr("id"),
                c = $(this).find("parent").text(),
                f = $(this).find("name").text(),
                d = $(this).find("frequency").text(),
                e = $(this).find("amount").text(),
                restoreChild(c, b, f, e, d);
        }),
        $.fromXMLString(a).find("settings").each(function() {
            useCurrency = $(this).find("currency").text(),
                useDecimals = $(this).find("decimals").text(),
                useCustomCategories = cleanVal($(this).find("custom").text());
        }),
        UpdateBudget(),
        "" !== g && (g === g.replace("utilities14", "Utilities (other)"),
            g = g.replace("education7", "Education (other)"),
            g = g.replace("entertainment9", "Celebrations"),
            g = g.replace("entertainment15", "Eating out (other)"),
            g = "<p><strong>Important</strong><br/>" + g + "</p>"),
        g;
}

function restoreProfiles() {
    var a = $("#profile-xml").val(),
        a = profileXML,
        b = "";
    $.fromXMLString(a).find("ProfileName").each(function() {
            b = b + '<option name="' + $(this).text() + '" value="' + $(this).text() + '">' + $(this).text() + "</option>";
        }),
        b += '<option name="save-as" value="0">Save as*</option>',
        $("#profile-list").append(b),
        $("#profile-list").hide().show();
}

function ShowStatus(a) {
    showAppToolbox("alert", a);
}

function positionAppToolbox() {
    var a = $("#calculator-container").position();
    $(".dialog").css("top", a.top + 220),
        $(".dialog").css("right", "34px");
}

function showAppToolbox(a, b) {
    var c = "";
    switch (a) {
        case "settings":
            2 === useDecimals && (c = 'checked="checked"'),
                c = '<p><label for="currency">Символ іноземної валюти:</label> <input type="text" value="' + useCurrency + '" id="currency"></p><p><label for="cents">Увімкнути копійки:</label> <input type="checkbox" id="cents" ' + c + "></p>",
                c += 1 === useCustomCategories ? ' <p><label for="customCategories">Увімкнути спеціальні елементи:</label> <input type="checkbox" id="customCategories" checked="checked"></p>' : '<p><label for="customCategories">Увімкнути спеціальні елементи:</label> <input type="checkbox" id="customCategories"></p>',
                c += '<p><button id="save-settings">Зберегти</button></p>',
                MSuser.showDialog("toolbox-" + a, "Налаштування", c);
            break;
        case "load-profile":
            c = '<p>Підтвердіть відкриття існуючого бюджету. Всі не збережені дані поточного бюджету будуть втрачені.</p><p>Ви впевнені, що хочете продовжувати?</p><p><button class="cancel">Відмінити</button>&nbsp;<button id="load-profile">Відкрити</button></p>',
                MSuser.showDialog("toolbox-" + a, "Підтвердити відкриття бюджету", c);
            break;
        case "reset":
            c = '<p>Створення нового бюджету видалить всі поточні дані. Ви впевнені, що хочете продовжувати?</p><p><button class="cancel">Ні</button>&nbsp;<button id="reset">Так</button></p>',
                MSuser.showDialog("toolbox-" + a, "Створити новий бюджет", c);
            break;
        case "save-as":
            c = '<p>Будь ласка введіть ім`я бюджету.</p><p>eg. "Фактичні витрати 2016"<br/>or "Заплановані витрати 2017"</p><p class="save-as-error"></p><p><label for="save-profile-name">Ім`я:</label>&nbsp;&nbsp;<input type="text" id="save-profile-name"/></p><p><button class="cancel">Видалити</button>&nbsp;<button id="save-as">Зберегти</button></p>',
                MSuser.showDialog("toolbox-" + a, "Зберегти як", c);
            break;
        case "delete":
            c = "<p>Ви впевнені, що хочете видалити " + b + '?</p><p class="delete-error"></p><p><button class="cancel">Відмінити</button>&nbsp;<button id="delete">Видалити</button></p>',
                MSuser.showDialog("toolbox-" + a, "Підтвердити видалення", c);
            break;
        case "print":
            c = '<p>Переконайтесь, що Ви доповнили категорії, які хочете друкувати.</p><p><button class="print">Друкувати</button></p>',
                MSuser.showDialog("toolbox-" + a, "Підтвердити друк", c);
            break;
        case "alert":
            c = "<p>" + b + "</p>",
                $("#dialog-toolbox-alert").remove(),
                MSuser.showDialog("toolbox-" + a, "Увага", c)
    }
    positionAppToolbox();
}

function UpdateBudget() {
    var a = 1;
    a = parseInt($("#frequency").val()),
        1 === useCustomCategories ? $("a.custom").show() : $("a.custom").hide();
    var b = 0,
        c = 0,
        d = 0;
    $(".category").each(function(e) {
            c = 0;
            var f = this.id;
            $("#" + f + " .item input.amount:not(.hide)").each(function(d) {
                    var e = cleanVal(this.value);
                    b = e * $(this).next("select").val() / a,
                        c += b,
                        b = b > 0 ? formatNumber(b, 0, useDecimals, !0, useCurrency) : "",
                        $(this).nextAll("span.total").text(b),
                        e > 0 && $(this).val(formatNumber(e, 0, useDecimals, !0));
                }),
                e < 1 ? d += c : d -= c,
                e > 0 && c > 0 && (c = -c),
                $(this).find("h3 span").text(formatNumber(c, 0, useDecimals, !0, useCurrency));
        }),
        $("#summary h3 span").removeClass("nagative"),
        $("#summary h3 span").text(formatNumber(d, 0, useDecimals, !0, useCurrency)),
        d < 0 && $("#summary h3 span").addClass("nagative"),
        $("#result").is(":visible") && updateSummary();
}

function drawSpendingChart(a) {
    var b;
    b = new Highcharts.Chart({
        chart: { renderTo: "chart", type: "pie" },
        colors: [" #0047f5", "#6691ff", "#001d66", "#ff9100", "#087191", "#42bfc7", "#0ebcf1"],
        credits: { enabled: !1 },
        title: { text: null },
        plotOptions: {
            pie: {
                allowPointSelect: !0,
                cursor: "pointer",
                showInLegend: !0,
                dataLabels: {
                    enabled: !1,
                    formatter: function() {
                        return this.percentage.toFixed(2) + "%";
                    }
                }
            }
        },
        legend: {
            enabled: !0,
            itemStyle: { color: "#333333", fontFamily: "Arial, Helvetica, sans-serif" },
            useHTML: !0,
            labelFormatter: function() {
                return this.name + ": " + useCurrency + formatNumber(this.y, 0, useDecimals, !0);
            }
        },
        tooltip: {
            formatter: function() {
                return "<b>" + this.point.name + "</b>:<br/>" + useCurrency + formatNumber(this.point.y, 0, useDecimals, !0) + " (" + this.percentage.toFixed(2) + "%)";
            }
        },
        series: [{ type: "pie", name: "Spending", data: a }]
    });
}

function cleanVal(a) {
    return "undefined" === typeof a && (a = 0),
        a = a.replace(/[^0-9.]/g, ""),
        (isNaN(a) || a.length < 1) && (a = 0),
        parseFloat(a);
}

function convertFrequency(a) {
    switch (a) {
        case 1:
            return "annually";
        case 4:
            return "quarterly";
        case 12:
            return "monthly";
        case 26:
            return "fortnightly";
        case 52:
            return "weekly";
    }
}

function formatNumber(a, b, c, d, e) {
    var f = !1;
    a < 0 && (f = !0),
        void 0 === e && (e = ""),
        a = a.toString();
    for (var g = "", h = 0; h < a.length; ++h)
        "0123456789.".indexOf(a.charAt(h)) >= 0 && (g += a.charAt(h));
    a = parseFloat(g),
        isNaN(a) && (a = 0),
        null === d && (d = !1),
        0 === b && (b = 1);
    for (var i = c > 0 ? Math.floor(a) : Math.round(a), j = "", h = 0; h < b || i > 0; ++h) d && j.match(/^\d\d\d/) && (j = "," + j),
        j = i % 10 + j,
        i = Math.floor(i / 10);
    return c > 0 && (a -= Math.floor(a), a *= Math.pow(10, c), j += "." + formatNumber(a, c, 0)),
        j = e + j, f && (j = "-" + j), j;
}

// function trackApp(a, b) {
//     _gaq.push(["_trackEvent", "Calculator - " + appName, a, b, 0, !0]);
// }
var apphost = "",
    appName = "Budget planner",
    appid = 3,
    appversion = 1,
    useDecimals = $.cookie("budget-planner-decimals"),
    useCustomCategories = $.cookie("budget-planner-custom"),
    useCurrency = $.cookie("budget-planner-currency");
null === useDecimals && (useDecimals = 0),
    null === useCustomCategories && (useCustomCategories = 0),
    null === useCurrency && (useCurrency = ""),
    useDecimals = parseInt(useDecimals),
    useCustomCategories = parseInt(useCustomCategories);
var appprofile = "",
    url = window.location.href,
    MSloggedIn = !1,
    fadeSpeed = "slow",
    statusTimeout = 5e3,
    chart,
    appXML,
    profileXML,
    profileListDefault = '<option name="default" value="" selected="selected">Збережені бюджети</option>',
    ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),
    totalIncome = 0,
    totalHome = 0,
    totalInsurance = 0,
    totalGroceries = 0,
    totalPersonal = 0,
    totalEntertainment = 0,
    totalTransport = 0,
    totalChildren = 0,
    totalNett = 0;
$(document).ready(function() {
        DrawBP(),
            $(".category h3").click(function() {
                $(this).toggleClass("open"),
                    $(this).nextUntil("h3").slideToggle();
            });

        $("#calculator-container").on("click", "#summary h3", function() {
                $("#result").slideToggle(),
                    $("#result").is(":visible") && updateSummary();
            }),
            $("#calculator-container").on("change", ".item select, #frequency", function() {
                UpdateBudget();
            }),
            $("#calculator-container").on("blur focus", ".item input, .item select", function() {
                $(this).parents(".item").toggleClass("highlight");
            }),
            $("#calculator-container").on("blur", '.item input[type="number"].amount', function() {
                this.value = this.value.replace(/[^0-9\,.]/g, "");
            }),
            $("#calculator-container").on("blur", '.item input[type="text"].amount', function() {
                this.value = formatNumber(this.value, 0, useDecimals, !0);
            }),
            $("#calculator-container").on("blur", ".item input.amount", function() {
                parseFloat(this.value) <= 0 && (this.value = "");
            }),
            $(".category > h3, #summary > h3").attr({ tabindex: "0", role: "button" }),

            $(document).on("keyup", "[role~=button]", function(a) {
                13 !== a.keyCode && 32 !== a.keyCode || $(this).trigger("click");
            }),
            $("#calculator-container").on("click", ".item.core label a", function() {
                var a = child(),
                    b = $(this).parents(".item"),
                    c = !1;
                b.next().hasClass("child") || (c = !0), b.after(a),
                    c && (b.next(".child").find(".amount").val(b.find(".amount").val()),
                        b.next(".child").find("select").val(b.find("select").val())),
                    b.find("input, select, span").addClass("hide"),
                    UpdateBudget(),
                    b.next(".child").find("input.name").focus();
            }),
            $("#calculator-container").on("focus", ".child input", function() {
                $(this).next(".delete-item").show();
            }),
            $("#calculator-container").on("blur", ".child input", function() {
                $(this).next(".delete-item").delay(500).hide(0);
            }),
            $("#calculator-container").on("click", ".delete-item", function() {
                var a = $(this).parents(".item");
                a.next().hasClass("child") || a.prev().hasClass("child") || (a.prev().find("input, select, span").removeClass("hide"),
                        a.prev().find("input").val("")),
                    a.remove(),
                    UpdateBudget();
            }),
            $("#calculator-container").on("click", "#profile-list", function() {
                MSloggedIn || (MSuser.showLogin(),
                        positionAppToolbox()),
                    $("#toolbox").find("input:first").focus();
            }),
            $("#calculator-container").on("change", "#profile-list", function() {
                var a = $("#toolbar select").val();
                "" !== a && $('#profile-list option[name="default"]').remove(),
                    "0" === a && showAppToolbox("save-as"),
                    LoadProfile();
            }),
            $("#calculator-container").on("click", "#toolbar .print", function() {
                showAppToolbox("print");
            }),
            $(document).on("click", "button.print", function() {
                $(".close").trigger("click"),
                    window.print();
            }),
            $("#calculator-container").on("click", ".save", function() {
                MSloggedIn ? SaveProfile("quick") : (MSuser.showLogin(), positionAppToolbox())
            }),
            $(document).on("click", "#save-as", function() {
                MSloggedIn ? (SaveProfile("saveas"),
                    $('#profile-list option[name="default"]').remove()) : (MSuser.showLogin(), $("html,body").animate({ scrollTop: $("#toolbox").offset().top }));
            }),
            $("#calculator-container").on("click", ".settings", function() {
                showAppToolbox("settings"),
                    1 === useCustomCategories && $(".item.child").length > 0 && $("#customCategories").attr("disabled", !0);
            }),
            $(document).on("click", "#save-settings", function() {
                $.cookie("budget-planner-currency",
                        $("#currency").val()),
                    useCurrency = $(" #currency ").val(),
                    $("#cents").is(":checked") ? ($.cookie("budget-planner-decimals", "2"), useDecimals = 2) : ($.cookie("budget-planner-decimals", "0"), useDecimals = 0),
                    $("#customCategories").is(":checked") ? ($.cookie("budget-planner-custom", "1"), useCustomCategories = 1) : ($.cookie("budget-planner-custom", "0"), useCustomCategories = 0, $("div.item.child").remove(), $("div.item.core").find("input, select, span").removeClass("hide")),
                    UpdateBudget(),
                    ShowStatus("Ваші налаштування збережено"),
                    trackApp("Settings", useCurrency + " - " + useDecimals);
            }),
            $("#calculator-container").on("click", ".delete", function() {
                var a = $("#profile-list").val();
                "" === a || "0" === a ? ShowStatus("Бюджет не обрано") : ($(".selected-profile").text(a),
                    showAppToolbox("delete", a));
            }),
            $(document).on("click", "#delete", function() {
                DeleteProfile();
            }),
            $("#calculator-container").on("click", ".new", function() {
                showAppToolbox("reset");
            }),
            $(document).on("click", "#reset, #load-profile", function() {
                $(".toolbox").hide(),
                    $("#app-toolbox").hide(),
                    "reset" === this.id && (DrawBP(),
                        ShowStatus("Новий бюджет створено"));
            }),
            $(document).on("click", ".cancel, .close", function() {
                var a = $("#toolbar select").val();
                appprofile !== a && ($("#profile-list").val(appprofile),
                        $('#profile-list option[name="default"]').remove()),
                    "" === appprofile && ($('#profile-list option[name="default"]').remove(),
                        $("#profile-list").prepend(profileListDefault),
                        $("#profile-list").val("")),
                    $(".dialog").slideUp(),
                    $(".dialog-bg").fadeOut(),
                    $("#content").removeClass("dialog-open");
            }),
            $(document).on("click", "#app-toolbox-register-success .close", function() {
                $(".save").trigger("click");
            }),
            $("#calculator-container").on("keypress", "input", function(a) {
                13 === a.keyCode && ($(this).blur(),
                    $(this).parents("div").next().find("input.amount").focus());
            }),
            $(document).on("keypress", ".toolbox input", function(a) {
                13 === a.keyCode && $(this).parents("div:first").find(".button:last").trigger("click");
            }),
            $("#calculator-container").on("blur", ".item input", function() {
                UpdateBudget();
            }),
            $("#calculator-container").on("blur", ".amounts input.dollar", function() {
                UpdateBudget(),
                    $("#freq-" + this.id + "-name").text($("#freq-" + this.id + " option:selected").text()),
                    $("#" + this.id + "-val").text($("#" + this.id).val());
            }),
            $(document).on("click", "#load-profile", function() { LoadProfile(1); }),
            $(document).on("keyup", "#save-profile-name", function() {
                this.value = this.value.replace(/[^a-zA-Z 0-9\,]/g, "");
            }),
            // $("#calculator-container").on("click", ".category h3", function() {
            //     trackApp("Tab", $(this).text());
            // }),
            $("#calculator-container").on("click", ".frequency", function() {
                trackApp("Frequency", $(this).children("option:selected").html());
            }),
            $("#calculator-container").on("click", "#toolbar a", function() {
                trackApp("Toolbar", $(this).attr("title"));
            }),
            $("#calculator-container").on("change", "#profile-list", function() {
                trackApp("Profile", $(this).children("option:selected").html());
            }),
            // $("#calculator-container").on("blur", "input.amount", function() {
            //     trackApp("Input", this.id);
            // }),
            $(document).on("click", ".print-long", function() {
                trackApp("Print", "Long");
            }),
            $(document).on("click", ".print-short", function() {
                trackApp("Print", "Short");
            }),
            $(document).on("click", "#reset", function() {
                trackApp("Reset", "New budget");
            }),
            $(document).on("click", "#save-as", function() {
                trackApp("Click", "Toolbox - Save as");
            }),
            $(document).on("click", "#delete", function() {
                trackApp("Click", "Toolbox - Delete");
            }),
            $(document).on("click", "#reset", function() {
                trackApp("Click", "Toolbox - Create new");
            });
    }),
    jQuery.fromXMLString = function(a) {
        if (window.DOMParser) return jQuery((new DOMParser).parseFromString(a, "text/xml"));
        if (window.ActiveXObject) {
            var b = new ActiveXObject("Microsoft.XMLDOM");
            return b.async = "false",
                b.loadXML(a),
                jQuery(b);
        }
        return jQuery(a);
    };