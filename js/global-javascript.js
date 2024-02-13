/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//==========================================================================================
// vlasnifinansy.com - GlobalJavascript.js
//==========================================================================================


//BEGIN DATE CHECKING
/**
 * DHTML date validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
// Declaring valid date character, minimum year and maximum year
var dtCh = "/";
var minYear = 1900;
var maxYear = 2100;

function isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary(year) {
    // February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
}

function DaysArray(n) {
    for (var i = 1; i <= n; i++) {
        this[i] = 31
        if (i == 4 || i == 6 || i == 9 || i == 11) { this[i] = 30 }
        if (i == 2) { this[i] = 29 }
    }
    return this
}

function isDate(dtStr) {
    var daysInMonth = DaysArray(12)
    var pos1 = dtStr.indexOf(dtCh)
    var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
    var strMonth = dtStr.substring(0, pos1)
    var strDay = dtStr.substring(pos1 + 1, pos2)
    var strYear = dtStr.substring(pos2 + 1)
    strYr = strYear
    if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1)
    if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1)
    for (var i = 1; i <= 3; i++) {
        if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1)
    }
    month = parseInt(strMonth)
    day = parseInt(strDay)
    year = parseInt(strYr)
    if (pos1 == -1 || pos2 == -1) {
        alert("The date format should be : mm/dd/yyyy")
        return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
        alert("Please enter a valid month")
        return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
        alert("Please enter a valid day")
        return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
        alert("Please enter a valid 4 digit year between " + minYear + " and " + maxYear)
        return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
        alert("Please enter a valid date")
        return false
    }
    return true
}
//END DATE CHECKING

function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}


if (document.all && !document.getElementById) {
    document.getElementById = function(id) {
        return document.all[id];
    }
}



// element rotation

rotationNum = 3; //number of elements
// generate random number 0-2
//randomnumber=Math.floor(Math.random()*rotationNum);
theCount = 1; //randomnumber + 1;
function timedCount(isDelay) {
    if (theCount > rotationNum) { theCount = 1; }

    if (!isDelay) {
        tabSwitch('tab' + theCount, 'content' + theCount);
        theCount++;
    }
    t = setTimeout("timedCount()", 5000);
}

function stopTimer(countNum) {
    clearTimeout(t);
    if (countNum) theCount = countNum + 1;
}

// end element rotation


//id.innerhtml = id.title
function titleToHtml(html, title) {
    //find IDs
    if (html) var htmlID = findId(html);
    if (title) var titleID = findId(title);
    //Text switching
    if (htmlID && titleID) htmlID.innerHTML = titleID.title;
    return false;
}

function blankToHtml(blankID) {
    if (blankID) {
        var blankID = findId(blankID);
        blankID.innerHTML = "";
    }
    return false;
}


//START dhtml tabs
function tabSwitch(link_id, content_id) {
    //tabStart = 'default-link-on'
    //tabTextStart= 'default-text-on'
    //Link = onclick="tabSwitch('tab_link_1','tab_text_1');

    //find IDs
    var tabLinkStartID = findId(tabStart);
    var tabLinkNewID = findId(link_id);

    var tabTextStartID = findId(tabTextStart);
    var tabTextNewID = findId(content_id);

    //Link switching
    if (tabLinkStartID) tabLinkStartID.className = tabLinkStartID.className == '' ? 'on' : '';
    if (tabLinkNewID) tabLinkNewID.className = tabLinkNewID.className == '' ? 'on' : '';
    tabStart = link_id;

    //Text switching
    if (content_id) HideShow(content_id);
    if (tabTextStart) HideShow(tabTextStart);
    tabTextStart = content_id;

    return false;
}

//END dhtml tabs

function getoffset(theTable, theDiv) {
    var Div = new getObj(theDiv);
    if (Div) {
        tableWidth = theTable.offsetWidth;
        offset = tableWidth - Div.obj.offsetWidth;
        return offset;
    }
}

function getHeight(theElementID) {
    var theElement = new getObj(theElementID);
    if (theElement) {
        theElementHeight = theElement.obj.offsetHeight;
        return theElementHeight * -1;
    }
}
//force forms to click certain buttons on enter click
function handleEnterKey(buttonName) {
    if (event.keyCode == 13) {
        event.returnValue = false;
        event.cancel = true;
        document.getElementById(buttonName).click();
    }
}

function position(thediv, theanchor) {
    xOffset = -50;
    yOffset = 0;
    lyr = findId(thediv);
    theimage = findId(theanchor);
    if (lyr) {
        if (theimage) {
            locY = findPosY(theimage) + yOffset;
            locX = findPosX(theimage) + xOffset;
            lyr.style.left = locX + "px";
            lyr.style.top = locY + "px";
        }
    }
}

function value_remove_focus(el) {
    if (el.V) {
        if (el.value == el.V) {
            el.value = '';
        }
    } else {
        el.V = el.value;
        el.value = '';
    }
}

function DR_SwapClass(id, classString) {
    theClass = findId(id);
    theClassName = theClass.className;
    if (!theClassName.match(classString)) {
        theClassName_on = theClassName + classString;
        theClass.className = theClassName_on;
        //alert( "theClass.className: " + theClass.className )
    }
}


function DR_SwapClassRestore() {
    theClass.className = theClassName
}

function ExpandCollapse(id, theClass) {
    // find all divs
    var divs = document.getElementsByTagName('div');
    if (divs) {
        // loop through all
        for (var i = 0; i < divs.length; i++) {
            // hide all with class passed
            if (divs[i].className == theClass) {
                // if id then hide all
                if (id) { divs[i].style.display = 'none'; }
                // if no id then show all
                else { divs[i].style.display = ''; }
            }
        }
    }

    // if id passed, show the one	
    if (id) {
        if (document.getElementById(id)) { document.getElementById(id).style.display = ""; }
    }
}


function position(thediv, theanchor, X, Y) {

    if (X) { xOffset = X } else(xOffset = 10)
    if (Y) { yOffset = Y } else(yOffset = 10)

    lyr = findId(thediv);
    theimage = findId(theanchor)
    if (lyr) {
        if (theimage) {
            locY = findPosY(theimage) + yOffset;
            locX = findPosX(theimage) + xOffset;
            lyr.style.left = locX + 'px';
            lyr.style.top = locY + 'px';
        }
    }
}


function getoffset(theTable, theDiv) {
    var Div = new getObj(theDiv);
    if (Div) {
        tableWidth = theTable.offsetWidth;
        offset = tableWidth - Div.obj.offsetWidth;
        return offset;
    }
}

function HideShow(id) {
    theElement = findId(id);
    if (theElement) { theElement.style.display = theElement.style.display == '' ? 'none' : '' };
}

function HideShowMult() {
    for (i = 0; i <= arguments.length; i++) {
        theElement = findId(arguments[i]);
        if (theElement) { theElement.style.display = theElement.style.display == '' ? 'none' : '' };
    }
}

//** Drop Nav Centered on Site **//
// IE and Mozilla friendly way to get id's
function findId(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (document.all) {
        return document.all.id;
    }
}
//  END IE and Mozilla friendly way to get id's

tdLastId = "";
tdCurrentId = "";
waiting = 0;
waitTime = 50;
timeoutId = "";

function navFlip(id, that, xOffset, yPos) {
    //alert(xOffset)
    if (!xOffset) xOffset = 1;
    if (!yPos) yPos = 1;
    if (waiting) {
        if (id != tdLastId) {
            clearTimeout(timeoutId);
            that_saved = that;
            timeoutId = setTimeout('clearWait(' + xOffset + ', ' + yPos + ')', waitTime);
        }
        tdLastId = id;
        return;
    }

    if (tdCurrentId != id) {
        if (id) {
            lyr = findId(id);
            xOffset = xOffset - 10;
            yPos = yPos - 30;
            if (lyr) { //Error fix 4/20/04
                if (that) {
                    lyr.style.left = findPosX(that) + xOffset + 'px';
                    if (yPos != 0) {
                        lyr.style.top = findPosY(that) + yPos + 'px';
                    }
                }

                lyr.style.visibility = "visible";

                waiting = id;
            } // end lyr
        }

        if (tdCurrentId) {
            //alert('dis: ' + tdCurrentId + ' waiting:' + waiting);

            lyr = findId(tdCurrentId);
            if (lyr) { //Error fix 4/20/04
                lyr.style.visibility = "hidden";
            } // end if
        }
        tdCurrentId = id;
    }
    tdLastId = id;
}

function clearWait(xOffset, yPos) {
    //alert('clearing: ' + waiting);
    waiting = 0;
    navFlip(tdLastId, that_saved, xOffset, yPos);
}

// Functions to find positions of static images
function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent)
        while (1) {
            curleft += obj.offsetLeft;
            if (!obj.offsetParent) break;
            obj = obj.offsetParent;
        }
    else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent)
        while (1) {
            curtop += obj.offsetTop;
            if (!obj.offsetParent) break;
            obj = obj.offsetParent;
        }
    else if (obj.y)
        curtop += obj.y;
    return curtop;
}
// END ** Drop Nav Centered on Site **//

function getObj(name) {
    if (document.getElementById) {
        this.obj = document.getElementById(name);
        this.style = document.getElementById(name).style;
    } else if (document.all) {
        this.obj = document.all[name];
        this.style = document.all[name].style;
    } else if (document.layers) {
        this.obj = document.layers[name];
        this.style = document.layers[name];
    }
}

//Mouseover Script


function MM_openBrWindow(theURL, winName, features) { //v2.0
    window.open(theURL, winName, features);
}

function MM_swapImgRestore() { //v3.0
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
}

function MM_preloadImages() { //v3.0
    var d = document;
    if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length,
            a = MM_preloadImages.arguments;
        for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") !== 0) {
                d.MM_p[j] = new Image;
                d.MM_p[j++].src = a[i];
            }
    }
}

function MM_findObj(n, d) { //v4.01
    var p, i, x;
    if (!d) d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n);
    return x;
}

function MM_swapImage() { //v3.0
    var i, j = 0,
        x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3)
        if ((x = MM_findObj(a[i])) !== null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc) x.oSrc = x.src;
            x.src = a[i + 2];
        }
}

browser = navigator.appName;
ie = "Microsoft Internet Explorer";
netscape = "Netscape";

function SetFormValue(formStr, field, value) {

    form = (MM_findObj(formStr));

    if (form) {
        if (null !== (form.elements[field])) {
            if ((browser === netscape) && (form.elements[field].type === 'select-one')) {
                sellength = form.elements[field].length;
                for (i = 0; i < sellength; i++) {
                    if (form.elements[field].options[i].value === value)
                        form.elements[field].options[i].selected = true;
                }
            } else
                form.elements[field].value = value;
        }
    }
}

function SubmitForm(formStr) {
    form = (MM_findObj(formStr));
    if (form) form.submit();
}
//-->

/*	sIFR 2.0.1 Official Add-ons 1.2
	Copyright 2005 Mark Wubben

	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
*/

if (typeof sIFR == "function")(function() {
    var j = document;
    var h = j.documentElement;
    sIFR.removeDecoyClasses = function() {
        function a(b) { if (b && b.className != null) b.className = b.className.replace(/\bsIFR-hasFlash\b/, "") }
        return function() {
            a(h);
            a(j.getElementsByTagName("body")[0])
        }
    }();
    sIFR.preferenceManager = {
        storage: {
            sCookieId: "sifr",
            set: function(a) {
                var b = new Date();
                b.setFullYear(b.getFullYear() + 3);
                j.cookie = [this.sCookieId, "=", a, ";expires=", b.toGMTString(), ";path=/"].join("")
            },
            get: function() {
                var a = j.cookie.match(new RegExp(";?" + this.sCookieId + "=([^;]+);?"));
                if (a != null && a[1] == "false") return false;
                else return true
            },
            reset: function() {
                var a = new Date();
                a.setFullYear(a.getFullYear() - 1);
                j.cookie = [this.sCookieId, "=true;expires=", a.toGMTString(), ";path=/"].join("")
            }
        },
        disable: function() { this.storage.set(false) },
        enable: function() { this.storage.set(true) },
        test: function() { return this.storage.get() }
    };
    if (sIFR.preferenceManager.test() == false) {
        sIFR.bIsDisabled = true;
        sIFR.removeDecoyClasses()
    }
    sIFR.rollback = function() {
        function a(b) {
            var c, d, e, f, g, h;
            var l = parseSelector(b);
            var i = l.length - 1;
            var m = false;
            while (i >= 0) {
                c = l[i];
                l.length--;
                d = c.parentNode;
                if (c.getAttribute("sifr") == "true") {
                    h = 0;
                    while (h < d.childNodes.length) {
                        c = d.childNodes[h];
                        if (c.className == "sIFR-alternate") {
                            e = c;
                            h++;
                            continue
                        }
                        d.removeChild(c)
                    }
                    if (e != null) {
                        f = e.firstChild;
                        while (f != null) {
                            g = f.nextSibling;
                            d.appendChild(e.removeChild(f));
                            f = g
                        }
                        d.removeChild(e)
                    }
                    if (!sIFR.UA.bIsXML && sIFR.UA.bUseInnerHTMLHack) d.innerHTML += "";
                    d.className = d.className.replace(/\bsIFR\-replaced\b/, "")
                };
                m = true;
                i--
            }
            return m
        }
        return function(k) {
            named.extract(arguments, { sSelector: function(a) { k = a } });
            if (k == null) k = "";
            else k += ">";
            sIFR.removeDecoyClasses();
            sIFR.bHideBrowserText = false;
            if (a(k + "embed") == false) a(k + "object")
        }
    }()
})()

/*	sIFR 2.0.1
	Copyright 2004 - 2005 Mike Davidson, Shaun Inman, Tomas Jogin and Mark Wubben

	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
*/

var hasFlash = function() { var a = 6; if (navigator.appVersion.indexOf("MSIE") != -1 && navigator.appVersion.indexOf("Windows") > -1) { document.write('<script language="VBScript"\> \non error resume next \nhasFlash = (IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." & ' + a + '))) \n</script\> \n'); if (window.hasFlash != null) return window.hasFlash } if (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) { var b = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description; return parseInt(b.charAt(b.indexOf(".") - 1)) >= a } return false }();
String.prototype.normalize = function() { return this.replace(/\s+/g, " ") };
if (Array.prototype.push == null) {
    Array.prototype.push = function() {
        var i = 0,
            a = this.length,
            b = arguments.length;
        while (i < b) { this[a++] = arguments[i++] }
        return this.length
    }
}
if (!Function.prototype.apply) {
    Function.prototype.apply = function(a, b) {
        var c = [];
        var d, e;
        if (!a) a = window;
        if (!b) b = [];
        for (var i = 0; i < b.length; i++) { c[i] = "b[" + i + "]" }
        e = "a.__applyTemp__(" + c.join(",") + ");";
        a.__applyTemp__ = this;
        d = eval(e);
        a.__applyTemp__ = null;
        return d
    }
}

function named(a) { return new named.Arguments(a) }
named.Arguments = function(a) { this.oArgs = a };
named.Arguments.prototype.constructor = named.Arguments;
named.extract = function(a, b) {
    var c, d;
    var i = a.length;
    while (i--) { d = a[i]; if (d != null && d.constructor != null && d.constructor == named.Arguments) { c = a[i].oArgs; break } }
    if (c == null) return;
    for (e in c)
        if (b[e] != null) b[e](c[e]);
    return
};
var parseSelector = function() {
    var a = /^([^#.>`]*)(#|\.|\>|\`)(.+)$/;

    function r(s, t) { var u = s.split(/\s*\,\s*/); var v = []; for (var i = 0; i < u.length; i++) v = v.concat(b(u[i], t)); return v }

    function b(c, d, e) {
        c = c.normalize().replace(" ", "`");
        var f = c.match(a);
        var g, h, i, j, k, n;
        var l = [];
        if (f == null) f = [c, c];
        if (f[1] == "") f[1] = "*";
        if (e == null) e = "`";
        if (d == null) d = document;
        switch (f[2]) {
            case "#":
                k = f[3].match(a);
                if (k == null) k = [null, f[3]];
                g = document.getElementById(k[1]);
                if (g == null || (f[1] != "*" && !o(g, f[1]))) return l;
                if (k.length == 2) { l.push(g); return l }
                return b(k[3], g, k[2]);
            case ".":
                if (e != ">") h = m(d, f[1]);
                else h = d.childNodes;
                for (i = 0, n = h.length; i < n; i++) {
                    g = h[i];
                    if (g.nodeType != 1) continue;
                    k = f[3].match(a);
                    if (k != null) {
                        if (g.className == null || g.className.match("\\b" + k[1] + "\\b") == null) continue;
                        j = b(k[3], g, k[2]);
                        l = l.concat(j)
                    } else if (g.className != null && g.className.match("\\b" + f[3] + "\\b") != null) l.push(g)
                }
                return l;
            case ">":
                if (e != ">") h = m(d, f[1]);
                else h = d.childNodes;
                for (i = 0, n = h.length; i < n; i++) {
                    g = h[i];
                    if (g.nodeType != 1) continue;
                    if (!o(g, f[1])) continue;
                    j = b(f[3], g, ">");
                    l = l.concat(j)
                }
                return l;
            case "`":
                h = m(d, f[1]);
                for (i = 0, n = h.length; i < n; i++) {
                    g = h[i];
                    j = b(f[3], g, "`");
                    l = l.concat(j)
                }
                return l;
            default:
                if (e != ">") h = m(d, f[1]);
                else h = d.childNodes;
                for (i = 0, n = h.length; i < n; i++) {
                    g = h[i];
                    if (g.nodeType != 1) continue;
                    if (!o(g, f[1])) continue;
                    l.push(g)
                }
                return l
        }
    }

    function m(d, o) { if (o == "*" && d.all != null) return d.all; return d.getElementsByTagName(o) }

    function o(p, q) { return q == "*" ? true : p.nodeName.toLowerCase().replace("html:", "") == q.toLowerCase() }
    return r
}();
var sIFR = function() {
    var a = "http://www.w3.org/1999/xhtml";
    var b = false;
    var c = false;
    var d;
    var ah = [];
    var al = document;
    var ak = al.documentElement;
    var am = window;
    var au = al.addEventListener;
    var av = am.addEventListener;
    var f = function() {
        var g = navigator.userAgent.toLowerCase();
        var f = { a: g.indexOf("applewebkit") > -1, b: g.indexOf("safari") > -1, c: navigator.product != null && navigator.product.toLowerCase().indexOf("konqueror") > -1, d: g.indexOf("opera") > -1, e: al.contentType != null && al.contentType.indexOf("xml") > -1, f: true, g: true, h: null, i: null, j: null, k: null };
        f.l = f.a || f.c;
        f.m = !f.a && navigator.product != null && navigator.product.toLowerCase() == "gecko";
        if (f.m) f.j = new Number(g.match(/.*gecko\/(\d{8}).*/)[1]);
        f.n = g.indexOf("msie") > -1 && !f.d && !f.l && !f.m;
        f.o = f.n && g.match(/.*mac.*/) != null;
        if (f.d) f.i = new Number(g.match(/.*opera(\s|\/)(\d+\.\d+)/)[2]);
        if (f.n || (f.d && f.i < 7.6)) f.g = false;
        if (f.a) f.k = new Number(g.match(/.*applewebkit\/(\d+).*/)[1]);
        if (am.hasFlash && (!f.n || f.o)) {
            var aj = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description;
            f.h = parseInt(aj.charAt(aj.indexOf(".") - 1))
        }
        if (g.match(/.*(windows|mac).*/) == null || f.o || f.c || (f.d && (g.match(/.*mac.*/) != null || f.i < 7.6)) || (f.b && f.h < 7) || (!f.b && f.a && f.k < 124) || (f.m && f.j < 20020523)) f.f = false;
        if (!f.o && !f.m && al.createElementNS) try { al.createElementNS(a, "i").innerHTML = "" } catch (e) { f.e = true }
        f.p = f.c || (f.a && f.k < 312) || f.n;
        return f
    }();

    function at() { return { bIsWebKit: f.a, bIsSafari: f.b, bIsKonq: f.c, bIsOpera: f.d, bIsXML: f.e, bHasTransparencySupport: f.f, bUseDOM: f.g, nFlashVersion: f.h, nOperaVersion: f.i, nGeckoBuildDate: f.j, nWebKitVersion: f.k, bIsKHTML: f.l, bIsGecko: f.m, bIsIE: f.n, bIsIEMac: f.o, bUseInnerHTMLHack: f.p } }
    if (am.hasFlash == false || !al.getElementsByTagName || !al.getElementById || (f.e && f.p)) return { UA: at() };

    function af(e) {
        if ((!k.bAutoInit && (am.event || e) != null) || !l(e)) return;
        b = true;
        for (var i = 0, h = ah.length; i < h; i++) j.apply(null, ah[i]);
        ah = []
    }
    var k = af;

    function l(e) { if (c == false || k.bIsDisabled == true || ((f.e && f.m || f.l) && e == null && b == false) || (al.body == null || al.getElementsByTagName("body").length == 0)) return false; return true }

    function m(n) { if (f.n) return n.replace(new RegExp("%\d{0}", "g"), "%25"); return n.replace(new RegExp("%(?!\d)", "g"), "%25") }

    function as(p, q) { return q == "*" ? true : p.nodeName.toLowerCase().replace("html:", "") == q.toLowerCase() }

    function o(p, q, r, s, t) {
        var u = "";
        var v = p.firstChild;
        var w, x, y, z;
        if (s == null) s = 0;
        if (t == null) t = "";
        while (v) {
            if (v.nodeType == 3) {
                z = v.nodeValue.replace("<", "&lt;");
                switch (r) {
                    case "lower":
                        u += z.toLowerCase();
                        break;
                    case "upper":
                        u += z.toUpperCase();
                        break;
                    default:
                        u += z
                }
            } else if (v.nodeType == 1) {
                if (as(v, "a") && !v.getAttribute("href") == false) {
                    if (v.getAttribute("target")) t += "&sifr_url_" + s + "_target=" + v.getAttribute("target");
                    t += "&sifr_url_" + s + "=" + m(v.getAttribute("href")).replace(/&/g, "%26");
                    u += '<a href="asfunction:_root.launchURL,' + s + '">';
                    s++
                } else if (as(v, "br")) u += "<br/>";
                if (v.hasChildNodes()) {
                    y = o(v, null, r, s, t);
                    u += y.u;
                    s = y.s;
                    t = y.t
                }
                if (as(v, "a")) u += "</a>"
            }
            w = v;
            v = v.nextSibling;
            if (q != null) {
                x = w.parentNode.removeChild(w);
                q.appendChild(x)
            }
        }
        return { "u": u, "s": s, "t": t }
    }

    function A(B) { if (al.createElementNS && f.g) return al.createElementNS(a, B); return al.createElement(B) }

    function C(D, E, z) {
        var p = A("param");
        p.setAttribute("name", E);
        p.setAttribute("value", z);
        D.appendChild(p)
    }

    function F(p, G) {
        var H = p.className;
        if (H == null) H = G;
        else H = H.normalize() + (H == "" ? "" : " ") + G;
        p.className = H
    }

    function aq(ar) {
        var a = ak;
        if (k.bHideBrowserText == false) a = al.getElementsByTagName("body")[0];
        if ((k.bHideBrowserText == false || ar) && a)
            if (a.className == null || a.className.match(/\bsIFR\-hasFlash\b/) == null) F(a, "sIFR-hasFlash")
    }

    function j(I, J, K, L, M, N, O, P, Q, R, S, r, T) {
        if (!l()) return ah.push(arguments);
        aq();
        named.extract(arguments, { sSelector: function(ap) { I = ap }, sFlashSrc: function(ap) { J = ap }, sColor: function(ap) { K = ap }, sLinkColor: function(ap) { L = ap }, sHoverColor: function(ap) { M = ap }, sBgColor: function(ap) { N = ap }, nPaddingTop: function(ap) { O = ap }, nPaddingRight: function(ap) { P = ap }, nPaddingBottom: function(ap) { Q = ap }, nPaddingLeft: function(ap) { R = ap }, sFlashVars: function(ap) { S = ap }, sCase: function(ap) { r = ap }, sWmode: function(ap) { T = ap } });
        var U = parseSelector(I);
        if (U.length == 0) return false;
        if (S != null) S = "&" + S.normalize();
        else S = "";
        if (K != null) S += "&textcolor=" + K;
        if (M != null) S += "&hovercolor=" + M;
        if (M != null || L != null) S += "&linkcolor=" + (L || K);
        if (O == null) O = 0;
        if (P == null) P = 0;
        if (Q == null) Q = 0;
        if (R == null) R = 0;
        if (N == null) N = "#FFFFFF";
        if (T == "transparent")
            if (!f.f) T = "opaque";
            else N = "transparent";
        if (T == null) T = "";
        var p, V, W, X, Y, Z, aa, ab, ac;
        var ad = null;
        for (var i = 0, h = U.length; i < h; i++) {
            p = U[i];
            if (p.className != null && p.className.match(/\bsIFR\-replaced\b/) != null) continue;
            V = p.offsetWidth - R - P;
            W = p.offsetHeight - O - Q;
            aa = A("span");
            aa.className = "sIFR-alternate";
            ac = o(p, aa, r);
            Z = "txt=" + m(ac.u).replace(/\+/g, "%2B").replace(/&/g, "%26").replace(/\"/g, "%22").normalize() + S + "&w=" + V + "&h=" + W + ac.t;
            F(p, "sIFR-replaced");
            if (ad == null || !f.g) {
                if (!f.g) p.innerHTML = ['<embed class="sIFR-flash" type="application/x-shockwave-flash" src="', J, '" quality="best" wmode="', T, '" bgcolor="', N, '" flashvars="', Z, '" width="', V, '" height="', W, '" sifr="true"></embed>'].join("");
                else {
                    if (f.d) {
                        ab = A("object");
                        ab.setAttribute("data", J);
                        C(ab, "quality", "best");
                        C(ab, "wmode", T);
                        C(ab, "bgcolor", N)
                    } else {
                        ab = A("embed");
                        ab.setAttribute("src", J);
                        ab.setAttribute("quality", "best");
                        ab.setAttribute("flashvars", Z);
                        ab.setAttribute("wmode", T);
                        ab.setAttribute("bgcolor", N)
                    }
                    ab.setAttribute("sifr", "true");
                    ab.setAttribute("type", "application/x-shockwave-flash");
                    ab.className = "sIFR-flash";
                    if (!f.l || !f.e) ad = ab.cloneNode(true)
                }
            } else ab = ad.cloneNode(true);
            if (f.g) {
                if (f.d) C(ab, "flashvars", Z);
                else ab.setAttribute("flashvars", Z);
                ab.setAttribute("width", V);
                ab.setAttribute("height", W);
                ab.style.width = V + "px";
                ab.style.height = W + "px";
                p.appendChild(ab)
            }
            p.appendChild(aa);
            if (f.p) p.innerHTML += ""
        }
        if (f.n && k.bFixFragIdBug) setTimeout(function() { al.title = d }, 0)
    }

    function ai() { d = al.title }

    function ae() {
        if (k.bIsDisabled == true) return;
        c = true;
        if (k.bHideBrowserText) aq(true);
        if (am.attachEvent) am.attachEvent("onload", af);
        else if (!f.c && (al.addEventListener || am.addEventListener)) {
            if (f.a && f.k >= 132 && am.addEventListener) am.addEventListener("load", function() { setTimeout("sIFR({})", 1) }, false);
            else { if (al.addEventListener) al.addEventListener("load", af, false); if (am.addEventListener) am.addEventListener("load", af, false) }
        } else if (typeof am.onload == "function") {
            var ag = am.onload;
            am.onload = function() {
                ag();
                af()
            }
        } else am.onload = af;
        if (!f.n || am.location.hash == "") k.bFixFragIdBug = false;
        else ai()
    }
    k.UA = at();
    k.bAutoInit = true;
    k.bFixFragIdBug = true;
    k.replaceElement = j;
    k.updateDocumentTitle = ai;
    k.appendToClassName = F;
    k.setup = ae;
    k.debug = function() { aq(true) };
    k.debug.replaceNow = function() {
        ae();
        k()
    };
    k.bIsDisabled = false;
    k.bHideBrowserText = true;
    return k
}();

if (typeof sIFR == "function" && !sIFR.UA.bIsIEMac) {
    sIFR.setup();
};
/*
	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
*/



/*	Unobtrusive Flash Objects (UFO) v3.20 <http://www.bobbyvandersluis.com/ufo/>
	Copyright 2005, 2006 Bobby van der Sluis
	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
	
	*************** start *************	
*/

var UFO = {
    req: ["movie", "width", "height", "majorversion", "build"],
    opt: ["play", "loop", "menu", "quality", "scale", "salign", "wmode", "bgcolor", "base", "flashvars", "devicefont", "allowscriptaccess", "seamlesstabbing"],
    optAtt: ["id", "name", "align"],
    optExc: ["swliveconnect"],
    ximovie: "ufo.swf",
    xiwidth: "215",
    xiheight: "138",
    ua: navigator.userAgent.toLowerCase(),
    pluginType: "",
    fv: [0, 0],
    foList: [],

    create: function(FO, id) {
        if (!UFO.uaHas("w3cdom") || UFO.uaHas("ieMac")) return;
        UFO.getFlashVersion();
        UFO.foList[id] = UFO.updateFO(FO);
        UFO.createCSS("#" + id, "visibility:hidden;");
        UFO.domLoad(id);
    },

    updateFO: function(FO) {
        if (typeof FO.xi != "undefined" && FO.xi == "true") {
            if (typeof FO.ximovie == "undefined") FO.ximovie = UFO.ximovie;
            if (typeof FO.xiwidth == "undefined") FO.xiwidth = UFO.xiwidth;
            if (typeof FO.xiheight == "undefined") FO.xiheight = UFO.xiheight;
        }
        FO.mainCalled = false;
        return FO;
    },

    domLoad: function(id) {
        var _t = setInterval(function() {
            if ((document.getElementsByTagName("body")[0] != null || document.body != null) && document.getElementById(id) != null) {
                UFO.main(id);
                clearInterval(_t);
            }
        }, 250);
        if (typeof document.addEventListener != "undefined") {
            document.addEventListener("DOMContentLoaded", function() {
                UFO.main(id);
                clearInterval(_t);
            }, null); // Gecko, Opera 9+
        }
    },

    main: function(id) {
        var _fo = UFO.foList[id];
        if (_fo.mainCalled) return;
        UFO.foList[id].mainCalled = true;
        document.getElementById(id).style.visibility = "hidden";
        if (UFO.hasRequired(id)) {
            if (UFO.hasFlashVersion(parseInt(_fo.majorversion, 10), parseInt(_fo.build, 10))) {
                if (typeof _fo.setcontainercss != "undefined" && _fo.setcontainercss == "true") UFO.setContainerCSS(id);
                UFO.writeSWF(id);
            } else if (_fo.xi == "true" && UFO.hasFlashVersion(6, 65)) {
                UFO.createDialog(id);
            }
        }
        document.getElementById(id).style.visibility = "visible";
    },

    createCSS: function(selector, declaration) {
        var _h = document.getElementsByTagName("head")[0];
        var _s = UFO.createElement("style");
        if (!UFO.uaHas("ieWin")) _s.appendChild(document.createTextNode(selector + " {" + declaration + "}")); // bugs in IE/Win
        _s.setAttribute("type", "text/css");
        _s.setAttribute("media", "screen");
        _h.appendChild(_s);
        if (UFO.uaHas("ieWin") && document.styleSheets && document.styleSheets.length > 0) {
            var _ls = document.styleSheets[document.styleSheets.length - 1];
            if (typeof _ls.addRule == "object") _ls.addRule(selector, declaration);
        }
    },

    setContainerCSS: function(id) {
        var _fo = UFO.foList[id];
        var _w = /%/.test(_fo.width) ? "" : "px";
        var _h = /%/.test(_fo.height) ? "" : "px";
        UFO.createCSS("#" + id, "width:" + _fo.width + _w + "; height:" + _fo.height + _h + ";");
        if (_fo.width == "100%") {
            UFO.createCSS("body", "margin-left:0; margin-right:0; padding-left:0; padding-right:0;");
        }
        if (_fo.height == "100%") {
            UFO.createCSS("html", "height:100%; overflow:hidden;");
            UFO.createCSS("body", "margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0; height:100%;");
        }
    },

    createElement: function(el) {
        return (UFO.uaHas("xml") && typeof document.createElementNS != "undefined") ? document.createElementNS("http://www.w3.org/1999/xhtml", el) : document.createElement(el);
    },

    createObjParam: function(el, aName, aValue) {
        var _p = UFO.createElement("param");
        _p.setAttribute("name", aName);
        _p.setAttribute("value", aValue);
        el.appendChild(_p);
    },

    uaHas: function(ft) {
        var _u = UFO.ua;
        switch (ft) {
            case "w3cdom":
                return (typeof document.getElementById != "undefined" && typeof document.getElementsByTagName != "undefined" && (typeof document.createElement != "undefined" || typeof document.createElementNS != "undefined"));
            case "xml":
                var _m = document.getElementsByTagName("meta");
                var _l = _m.length;
                for (var i = 0; i < _l; i++) {
                    if (/content-type/i.test(_m[i].getAttribute("http-equiv")) && /xml/i.test(_m[i].getAttribute("content"))) return true;
                }
                return false;
            case "ieMac":
                return /msie/.test(_u) && !/opera/.test(_u) && /mac/.test(_u);
            case "ieWin":
                return /msie/.test(_u) && !/opera/.test(_u) && /win/.test(_u);
            case "gecko":
                return /gecko/.test(_u) && !/applewebkit/.test(_u);
            case "opera":
                return /opera/.test(_u);
            case "safari":
                return /applewebkit/.test(_u);
            default:
                return false;
        }
    },

    getFlashVersion: function() {
        if (UFO.fv[0] != 0) return;
        if (navigator.plugins && typeof navigator.plugins["Shockwave Flash"] == "object") {
            UFO.pluginType = "npapi";
            var _d = navigator.plugins["Shockwave Flash"].description;
            if (typeof _d != "undefined") {
                _d = _d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                var _m = parseInt(_d.replace(/^(.*)\..*$/, "$1"), 10);
                var _r = /r/.test(_d) ? parseInt(_d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
                UFO.fv = [_m, _r];
            }
        } else if (window.ActiveXObject) {
            UFO.pluginType = "ax";
            try { // avoid fp 6 crashes
                var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
            } catch (e) {
                try {
                    var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    UFO.fv = [6, 0];
                    _a.AllowScriptAccess = "always"; // throws if fp < 6.47 
                } catch (e) {
                    if (UFO.fv[0] == 6) return;
                }
                try {
                    var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                } catch (e) {}
            }
            if (typeof _a == "object") {
                var _d = _a.GetVariable("$version"); // bugs in fp 6.21/6.23
                if (typeof _d != "undefined") {
                    _d = _d.replace(/^\S+\s+(.*)$/, "$1").split(",");
                    UFO.fv = [parseInt(_d[0], 10), parseInt(_d[2], 10)];
                }
            }
        }
    },

    hasRequired: function(id) {
        var _l = UFO.req.length;
        for (var i = 0; i < _l; i++) {
            if (typeof UFO.foList[id][UFO.req[i]] == "undefined") return false;
        }
        return true;
    },

    hasFlashVersion: function(major, release) {
        return (UFO.fv[0] > major || (UFO.fv[0] == major && UFO.fv[1] >= release)) ? true : false;
    },

    writeSWF: function(id) {
        var _fo = UFO.foList[id];
        var _e = document.getElementById(id);
        if (UFO.pluginType == "npapi") {
            if (UFO.uaHas("gecko") || UFO.uaHas("xml")) {
                while (_e.hasChildNodes()) {
                    _e.removeChild(_e.firstChild);
                }
                var _obj = UFO.createElement("object");
                _obj.setAttribute("type", "application/x-shockwave-flash");
                _obj.setAttribute("data", _fo.movie);
                _obj.setAttribute("width", _fo.width);
                _obj.setAttribute("height", _fo.height);
                var _l = UFO.optAtt.length;
                for (var i = 0; i < _l; i++) {
                    if (typeof _fo[UFO.optAtt[i]] != "undefined") _obj.setAttribute(UFO.optAtt[i], _fo[UFO.optAtt[i]]);
                }
                var _o = UFO.opt.concat(UFO.optExc);
                var _l = _o.length;
                for (var i = 0; i < _l; i++) {
                    if (typeof _fo[_o[i]] != "undefined") UFO.createObjParam(_obj, _o[i], _fo[_o[i]]);
                }
                _e.appendChild(_obj);
            } else {
                var _emb = "";
                var _o = UFO.opt.concat(UFO.optAtt).concat(UFO.optExc);
                var _l = _o.length;
                for (var i = 0; i < _l; i++) {
                    if (typeof _fo[_o[i]] != "undefined") _emb += ' ' + _o[i] + '="' + _fo[_o[i]] + '"';
                }
                _e.innerHTML = '<embed type="application/x-shockwave-flash" src="' + _fo.movie + '" width="' + _fo.width + '" height="' + _fo.height + '" pluginspage="http://www.macromedia.com/go/getflashplayer"' + _emb + '></embed>';
            }
        } else if (UFO.pluginType == "ax") {
            var _objAtt = "";
            var _l = UFO.optAtt.length;
            for (var i = 0; i < _l; i++) {
                if (typeof _fo[UFO.optAtt[i]] != "undefined") _objAtt += ' ' + UFO.optAtt[i] + '="' + _fo[UFO.optAtt[i]] + '"';
            }
            var _objPar = "";
            var _l = UFO.opt.length;
            for (var i = 0; i < _l; i++) {
                if (typeof _fo[UFO.opt[i]] != "undefined") _objPar += '<param name="' + UFO.opt[i] + '" value="' + _fo[UFO.opt[i]] + '" />';
            }
            var _p = window.location.protocol == "https:" ? "https:" : "http:";
            _e.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + _objAtt + ' width="' + _fo.width + '" height="' + _fo.height + '" codebase="' + _p + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + _fo.majorversion + ',0,' + _fo.build + ',0"><param name="movie" value="' + _fo.movie + '" />' + _objPar + '</object>';
        }
    },

    createDialog: function(id) {
        var _fo = UFO.foList[id];
        UFO.createCSS("html", "height:100%; overflow:hidden;");
        UFO.createCSS("body", "height:100%; overflow:hidden;");
        UFO.createCSS("#xi-con", "position:absolute; left:0; top:0; z-index:1000; width:100%; height:100%; background-color:#fff; filter:alpha(opacity:75); opacity:0.75;");
        UFO.createCSS("#xi-dia", "position:absolute; left:50%; top:50%; margin-left: -" + Math.round(parseInt(_fo.xiwidth, 10) / 2) + "px; margin-top: -" + Math.round(parseInt(_fo.xiheight, 10) / 2) + "px; width:" + _fo.xiwidth + "px; height:" + _fo.xiheight + "px;");
        var _b = document.getElementsByTagName("body")[0];
        var _c = UFO.createElement("div");
        _c.setAttribute("id", "xi-con");
        var _d = UFO.createElement("div");
        _d.setAttribute("id", "xi-dia");
        _c.appendChild(_d);
        _b.appendChild(_c);
        var _mmu = window.location;
        if (UFO.uaHas("xml") && UFO.uaHas("safari")) {
            var _mmd = document.getElementsByTagName("title")[0].firstChild.nodeValue = document.getElementsByTagName("title")[0].firstChild.nodeValue.slice(0, 47) + " - Flash Player Installation";
        } else {
            var _mmd = document.title = document.title.slice(0, 47) + " - Flash Player Installation";
        }
        var _mmp = UFO.pluginType == "ax" ? "ActiveX" : "PlugIn";
        var _uc = typeof _fo.xiurlcancel != "undefined" ? "&xiUrlCancel=" + _fo.xiurlcancel : "";
        var _uf = typeof _fo.xiurlfailed != "undefined" ? "&xiUrlFailed=" + _fo.xiurlfailed : "";
        UFO.foList["xi-dia"] = { movie: _fo.ximovie, width: _fo.xiwidth, height: _fo.xiheight, majorversion: "6", build: "65", flashvars: "MMredirectURL=" + _mmu + "&MMplayerType=" + _mmp + "&MMdoctitle=" + _mmd + _uc + _uf };
        UFO.writeSWF("xi-dia");
    },

    expressInstallCallback: function() {
        var _b = document.getElementsByTagName("body")[0];
        var _c = document.getElementById("xi-con");
        _b.removeChild(_c);
        UFO.createCSS("body", "height:auto; overflow:auto;");
        UFO.createCSS("html", "height:auto; overflow:auto;");
    },

    cleanupIELeaks: function() {
        var _o = document.getElementsByTagName("object");
        var _l = _o.length
        for (var i = 0; i < _l; i++) {
            _o[i].style.display = "none";
            for (var x in _o[i]) {
                if (typeof _o[i][x] == "function") {
                    _o[i][x] = null;
                }
            }
        }
    }

};

if (typeof window.attachEvent != "undefined" && UFO.uaHas("ieWin")) {
    window.attachEvent("onunload", UFO.cleanupIELeaks);
}

/*	Unobtrusive Flash Objects (UFO) v3.02 <http://www.bobbyvandersluis.com/ufo/>
	Copyright 2005, 2006 Bobby van der Sluis
	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
	------------------------------
	v3.01 Fixed bug: updated domLoad function
	
	*************** END *************	
*/



//-- Urchin Tracking Module II (UTM II),$Revision: 1.6 $,
//-- Copyright 2003 Urchin Software Corporation, All Rights Reserved.

/*--------------------------------------------------
   UTM II User Settings
--------------------------------------------------*/
var __utmfsc = 1; /*-- set client info flag (1=on|0=off) --*/
var __utmdn = "auto"; /*-- (auto|none|domain) set the domain name for cookies --*/
var __utmhash = "on"; /*-- (on|off) unique domain hash for cookies --*/
var __utmgifpath = "/Images/CommonImages/__utm.gif"; /*-- set the web path to the __utm.gif file --*/
var __utmtimeout = "1800"; /*-- set the inactive session timeout in seconds --*/

/*--------------------------------------------------
   UTM II Campaign Tracking Settings
--------------------------------------------------*/
var __utmctm = 1; /*-- set campaign tracking module (1=on|0=off) --*/
var __utmcto = "15768000"; /*-- set the campaign timeout in seconds (6 month default) --*/

var __utmccn = "utm_campaign"; /*-- campaign name --*/
var __utmcpr = "utm_program"; /*-- campaign program --*/
var __utmcrs = "utm_refsite"; /*-- campaign referral site --*/
var __utmcrl = "utm_refloc"; /*-- campaign referral location --*/
var __utmctr = "utm_term"; /*-- campaign term/keyword --*/
var __utmcct = "utm_content"; /*-- campaign content --*/

var __utmcui = "utm_userid"; /*-- campaign userid --*/
var __utmccu = "utm_custom"; /*-- campaign custom field --*/

/*--------------------------------------------------
   Don't modify below this point
--------------------------------------------------*/
var __utmf, __utmdh, __utmd, __utmdom = "",
    __utmu, __utmjv = "-",
    __utmfns;

if (!__utmf) {
    var __utma, __utmb, __utmc;
    var __utmexp = "",
        __utms = "",
        __utmst = 0,
        __utmlf = 0;

    /*--------------------------------------------------
       get useful information
    --------------------------------------------------*/
    __utmdh = __utmSetDomain(); /*--- set the domain and get the domain hash ---*/
    __utma = document.cookie.indexOf("__utma=" + __utmdh); /*--- cookie a ---*/
    __utmb = document.cookie.indexOf("__utmb=" + __utmdh); /*--- cookie b ---*/
    __utmc = document.cookie.indexOf("__utmc=" + __utmdh); /*--- cookie c ---*/
    __utmu = Math.round(Math.random() * 4294967295); /*--- unique number ---*/
    __utmd = new Date(); /*--- current date/time epoch ---*/
    __utmst = Math.round(__utmd.getTime() / 1000); /*--- session time ---*/

    if (__utmdn && __utmdn != "") { __utmdom = " domain=" + __utmdn + ";"; } /*--- domain ---*/
    /*--- timeout ---*/
    if (__utmtimeout && __utmtimeout != "") {
        __utmexp = new Date(__utmd.getTime() + (__utmtimeout * 1000));
        __utmexp = " expires=" + __utmexp.toGMTString() + ";";
    }

    /*--------------------------------------------------
       grab cookies from the commandline
    --------------------------------------------------*/
    __utms = document.location.search;
    if (__utms && __utms != "" && __utms.indexOf("__utma=") >= 0) {
        __utma = __utmGetCookie(__utms, "__utma=", "&");
        __utmb = __utmGetCookie(__utms, "__utmb=", "&");
        __utmc = __utmGetCookie(__utms, "__utmc=", "&");
        if (__utma != "-" && __utmb != "-" && __utmc != "-") __utmlf = 1;
        else if (__utma != "-") __utmlf = 2;
    }

    /*--------------------------------------------------
       based on the logic set cookies
    --------------------------------------------------*/
    if (__utmlf == 1) {
        document.cookie = "__utma=" + __utma + "; path=/; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
        document.cookie = "__utmb=" + __utmb + "; path=/;" + __utmexp;
        document.cookie = "__utmc=" + __utmc + "; path=/;";
        __utmfns = 1;
    } else if (__utmlf == 2) {
        __utma = __utmFixA(__utms, "&", __utmst);
        document.cookie = "__utma=" + __utma + "; path=/; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
        document.cookie = "__utmb=" + __utmdh + "; path=/;" + __utmexp;
        document.cookie = "__utmc=" + __utmdh + "; path=/;"
        __utmfns = 1;
    } else if (__utma >= 0 && __utmb >= 0 && __utmc >= 0) {
        document.cookie = "__utmb=" + __utmdh + "; path=/;" + __utmexp + __utmdom;
    } else if (__utma >= 0) {
        __utma = __utmFixA(document.cookie, ";", __utmst);
        document.cookie = "__utma=" + __utma + "; path=/; expires=Sun, 18 Jan 2038 00:00:00 GMT;" + __utmdom;
        document.cookie = "__utmb=" + __utmdh + "; path=/;" + __utmexp + __utmdom;
        document.cookie = "__utmc=" + __utmdh + "; path=/;" + __utmdom;
        __utmfns = 1;
    } else if (__utma < 0 && __utmb < 0 && __utmc < 0) {
        __utma = __utmCheckUTMI(__utmd);
        if (__utma == "-") __utma = __utmdh + "." + __utmu + "." + __utmst + "." + __utmst + "." + __utmst + ".1";
        else __utma = __utmdh + "." + __utma;
        document.cookie = "__utma=" + __utma + "; path=/; expires=Sun, 18 Jan 2038 00:00:00 GMT;" + __utmdom;
        document.cookie = "__utmb=" + __utmdh + "; path=/;" + __utmexp + __utmdom;
        document.cookie = "__utmc=" + __utmdh + "; path=/;" + __utmdom;
        __utmfns = 1;
    } else {
        __utma = __utmdh + "." + __utmu + "." + __utmst + "." + __utmst + "." + __utmst + ".1";
        document.cookie = "__utma=" + __utma + "; path=/; expires=Sun, 18 Jan 2038 00:00:00 GMT;" + __utmdom;
        document.cookie = "__utmb=" + __utmdh + "; path=/;" + __utmexp + __utmdom;
        document.cookie = "__utmc=" + __utmdh + "; path=/;" + __utmdom;
        __utmfns = 1;
    }
    __utmSetInfo();
    __utmf = 1;
}

function __utmSetInfo() {
    var __utmr = "-",
        __utmp;
    var __utmi = new Image(1, 1);
    var __utmsrc = __utmgifpath + "?";
    var loc = document.location;
    __utmr = document.referrer;
    if (!__utmr || __utmr == "") { __utmr = "-"; } else {
        __utmp = __utmr.indexOf(document.domain);
        if ((__utmp >= 0) && (__utmp <= 8)) { __utmr = "0"; }
        if (__utmr.indexOf("[") == 0 && __utmr.lastIndexOf("]") == (__utmr.length - 1)) { __utmr = "-"; }
    }
    __utmsrc += "utmn=" + __utmu;
    if (__utmfsc && __utmfns) { __utmsrc += __utmGetClientInfo(); }
    if (__utmctm) { __utmsrc += __utmSetCampaignInfo(); }
    __utmsrc += "&utmr=" + __utmr + "&utmp=" + loc.pathname + loc.search;
    // __utmi.src = __utmsrc;
    return 0;
}

function __utmSetCampaignInfo() {
    var __utmcc = "";
    var __utmtmp = "-";
    var __utmcnew = "&utmcn=1";
    var __utmx = document.location.search;
    var __utmz = document.cookie.indexOf("__utmz=" + __utmdh);
    if (__utmz > -1) {
        __utmz = __utmGetCookie(document.cookie, "__utmz=", ";");
    } else { __utmz = "-"; }

    /*--- check for campaign info ---*/
    __utmtmp = __utmGetCookie(__utmx, __utmccn + "=", "&");
    if (__utmtmp == "-" || __utmtmp == "") { return ""; }
    __utmcc += "utmccn=" + __utmtmp;
    __utmtmp = __utmGetCookie(__utmx, __utmcpr + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") __utmcc += "|utmcpr=" + __utmtmp;
    __utmtmp = __utmGetCookie(__utmx, __utmcrs + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") __utmcc += "|utmcrs=" + __utmtmp;
    __utmtmp = __utmGetCookie(__utmx, __utmcrl + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") __utmcc += "|utmcrl=" + __utmtmp;
    __utmtmp = __utmGetCookie(__utmx, __utmctr + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") __utmcc += "|utmctr=" + __utmtmp;
    __utmtmp = __utmGetCookie(__utmx, __utmcct + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") __utmcc += "|utmcct=" + __utmtmp;

    /*--- check if campaign is already set ---*/
    if (!__utmfns && __utmz.indexOf(__utmcc) != -1) __utmcnew = "";


    /*--- check for userid in cookie ---*/
    __utmtmp = __utmGetCookie(__utmx, __utmcui + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") {
        __utmcc += "|utmcui=" + __utmtmp;
    } else {
        __utmtmp = __utmGetCookie(__utmz, "utmcui=", "|");
        if (__utmtmp != "-" && __utmtmp != "") { __utmcc += "|utmcui=" + __utmtmp; }
    }

    /*--- check for email in cookie ---*/
    __utmtmp = __utmGetCookie(__utmx, __utmccu + "=", "&");
    if (__utmtmp != "-" && __utmtmp != "") {
        __utmcc += "|utmccu=" + __utmtmp;
    } else {
        __utmtmp = __utmGetCookie(__utmz, "utmccu=", "|");
        if (__utmtmp != "-" && __utmtmp != "") { __utmcc += "|utmccu=" + __utmtmp; }
    }

    /*--- set the cookie ---*/
    if (!__utmcto || __utmcto == "") { __utmcto = "15768000"; }
    var __utmcx = new Date(__utmd.getTime() + (__utmcto * 1000));
    __utmcx = " expires=" + __utmcx.toGMTString() + ";";
    document.cookie = "__utmz=" + __utmdh + "." + __utmst + "." + __utmcc + "; path=/; " + __utmcx + __utmdom;

    /*--- set the new campaign flag  ---*/
    return __utmcnew;
}

function __utmGetClientInfo() {
    var __utmtmp = "-",
        __utmsr = "-",
        __utmsa = "-",
        __utmsc = "-",
        __utmbs = "-",
        __utmul = "-";
    var __utmje = 1,
        __utmce = 1,
        __utmtz = 0;
    if (self.screen) {
        __utmsr = screen.width + "x" + screen.height;
        __utmsa = screen.availWidth + "x" + screen.availHeight;
        __utmsc = screen.colorDepth + "-bit";
    } else if (self.java) {
        var __utmjk = java.awt.Toolkit.getDefaultToolkit();
        var __utmjksize = __utmjk.getScreenSize();
        __utmsr = __utmjksize.width + "x" + __utmjksize.height;
    }
    if (typeof(window.innerWidth) == 'number') {
        __utmbs = window.innerWidth + "x" + window.innerHeight;
    } else {
        if (document.documentElement &&
            (document.documentElement.offsetHeight || document.documentElement.offsetWidth)) {
            __utmbs = document.documentElement.offsetWidth + "x" + document.documentElement.offsetHeight;
        } else if (document.body && (document.body.offsetWidth || document.body.offsetHeight)) {
            __utmbs = document.body.offsetWidth + "x" + document.body.offsetHeight;
        }
    }
    for (var i = 5; i >= 0; i--) {
        var __utmtmp = "<script language='JavaScript1." + i + "'>__utmjv='1." + i + "';</script>";
        document.write(__utmtmp);
        if (__utmjv != "-") break;
    }
    if (navigator.language) { __utmul = navigator.language.toLowerCase(); } else if (navigator.browserLanguage) { __utmul = navigator.browserLanguage.toLowerCase(); }
    __utmje = navigator.javaEnabled() ? 1 : 0;
    if (document.cookie.indexOf("__utmb=") < 0) { __utmce = "0"; }
    if (document.cookie.indexOf("__utmc=") < 0) { __utmce = "0"; }
    __utmtz = __utmd.getTimezoneOffset();
    __utmtz = __utmTZConvert(__utmtz);
    __utmtmp = "";
    __utmtmp += "&utmsr=" + __utmsr + "&utmsa=" + __utmsa + "&utmsc=" + __utmsc + "&utmbs=" + __utmbs;
    __utmtmp += "&utmul=" + __utmul + "&utmje=" + __utmje + "&utmce=" + __utmce + "&utmtz=" + __utmtz + "&utmjv=" + __utmjv;
    return __utmtmp;
}

function __utmLinker(__utmlink) {
    var __utmlp, __utmi, __utmi2, __utmta = "-",
        __utmtb = "-",
        __utmtc = "-",
        __utmtz = "-";

    if (__utmlink && __utmlink != "") {
        if (document.cookie) {
            __utmta = __utmGetCookie(document.cookie, "__utma=" + __utmdh, ";");
            __utmtb = __utmGetCookie(document.cookie, "__utmb=" + __utmdh, ";");
            __utmtc = __utmGetCookie(document.cookie, "__utmc=" + __utmdh, ";");
            __utmtz = __utmGetCookie(document.cookie, "__utmz=" + __utmdh, ";");
            __utmlp = "__utma=" + __utmta + "&__utmb=" + __utmtb + "&__utmc=" + __utmtc + "&__utmz=" + __utmtz;
        }
        if (__utmlp) {
            if (__utmlink.indexOf("?") <= -1) { document.location = __utmlink + "?" + __utmlp; } else { document.location = __utmlink + "&" + __utmlp; }
        } else { document.location = __utmlink; }
    }
}

function __utmGetCookie(__utmclist, __utmcname, __utmcsep) {
    if (!__utmclist || __utmclist == "") return "-";
    if (!__utmcname || __utmcname == "") return "-";
    if (!__utmcsep || __utmcsep == "") return "-";
    var __utmi, __utmi2, __utmi3, __utmtc = "-";

    __utmi = __utmclist.indexOf(__utmcname);
    __utmi3 = __utmcname.indexOf("=") + 1;
    if (__utmi > -1) {
        __utmi2 = __utmclist.indexOf(__utmcsep, __utmi);
        if (__utmi2 < 0) { __utmi2 = __utmclist.length; }
        __utmtc = __utmclist.substring((__utmi + __utmi3), __utmi2);
    }
    return __utmtc;
}

function __utmSetDomain() {
    if (!__utmdn || __utmdn == "" || __utmdn == "none") { __utmdn = ""; return 1; }
    if (__utmdn == "auto") {
        var __utmdomain = document.domain;
        if (__utmdomain.substring(0, 4) == "www.") {
            __utmdomain = __utmdomain.substring(4, __utmdomain.length);
        }
        __utmdn = __utmdomain;
    }
    if (__utmhash == "off") return 1;
    return __utmHash(__utmdn);
}

function __utmHash(__utmd) {
    if (!__utmd || __utmd == "") return 1;
    var __utmhash = 0,
        __utmg = 0;
    for (var i = __utmd.length - 1; i >= 0; i--) {
        var __utmc = parseInt(__utmd.charCodeAt(i));
        __utmhash = ((__utmhash << 6) & 0xfffffff) + __utmc + (__utmc << 14);
        if ((__utmg = __utmhash & 0xfe00000) != 0) __utmhash = (__utmhash ^ (__utmg >> 21));
    }
    return __utmhash;
}

function __utmFixA(__utmcs, __utmsp, __utmst) {
    if (!__utmcs || __utmcs == "") return "-";
    if (!__utmsp || __utmsp == "") return "-";
    if (!__utmst || __utmst == "") return "-";
    var __utmt = __utmGetCookie(__utmcs, "__utma=", __utmsp);
    var __utmlt = 0;
    var __utmns = 0;
    var __utmi = 0;

    if ((__utmi = __utmt.lastIndexOf(".")) > 9) {
        __utmns = __utmt.substring(__utmi + 1, __utmt.length);
        __utmns = (__utmns * 1) + 1;
        __utmt = __utmt.substring(0, (__utmi));

        if ((__utmi = __utmt.lastIndexOf(".")) > 7) {
            __utmlt = __utmt.substring(__utmi + 1, __utmt.length);
            __utmt = __utmt.substring(0, (__utmi));
        }

        if ((__utmi = __utmt.lastIndexOf(".")) > 5) {
            __utmt = __utmt.substring(0, (__utmi));
        }
        __utmt += "." + __utmlt + "." + __utmst + "." + __utmns;
    }
    return __utmt;
}

function __utmCheckUTMI(__utmd) {
    var __utm1A = new Array();
    var __utmlst = 0,
        __utmpst = 0,
        __utmlvt = 0,
        __utmlu = 0,
        __utmi = 0,
        __utmpi = 0;
    var __utmap = "-";
    var __utmld = "";
    var __utmt2;
    var __utmt = document.cookie;

    while ((__utmi = __utmt.indexOf("__utm1=")) >= 0) {
        __utm1A[__utm1A.length] = __utmGetCookie(__utmt, "__utm1=", ";");
        __utmt = __utmt.substring(__utmi + 7, __utmt.length);
    }
    if (__utm1A.length) {
        var __utmcts = Math.round(__utmd.getTime() / 1000);
        var __utmlex = " expires=" + __utmd.toGMTString() + ";";
        __utmt = document.cookie;
        if ((__utmi = __utmt.lastIndexOf("__utm3=")) >= 0) {
            __utmlst = __utmt.substring(__utmi, __utmt.length);
            __utmlst = __utmGetCookie(__utmlst, "__utm3=", ";");
        }
        if ((__utmi = __utmt.lastIndexOf("__utm2=")) >= 0) {
            __utmpst = __utmt.substring(__utmi, __utmt.length);
            __utmpst = __utmGetCookie(__utmpst, "__utm2=", ";");
        }
        for (var i = 0; i < __utm1A.length; i++) {
            __utmt = __utm1A[i];
            if ((__utmi = __utmt.lastIndexOf(".")) >= 0) {
                __utmt2 = (__utmt.substring(0, __utmi)) * 1;
                __utmt = (__utmt.substring(__utmi + 1, __utmt.length)) * 1;
                if (__utmlvt == 0 || __utmt < __utmlvt) {
                    __utmlvt = __utmt;
                    __utmlu = __utmt2;
                }
            }
        }
        if (__utmlvt && __utmlst) {
            if (!__utmpst || __utmpst > __utmlst) __utmpst = __utmlst;
            __utmap = __utmlu + "." + __utmlvt + "." + __utmpst + "." + __utmlst + ".2";
        } else if (__utmlvt) {
            if (!__utmpst || __utmpst > __utmcts) __utmpst = __utmcts;
            __utmap = __utmlu + "." + __utmlvt + "." + __utmpst + "." + __utmcts + ".2";
        }
        __utmld = __utmt = document.domain;
        __utmi = __utmpi = 0;
        while ((__utmi = __utmt.indexOf(".", __utmpi + 1)) >= 0) {
            if (__utmpi > 0) __utmld = __utmt.substring(__utmpi + 1, __utmt.length);
            __utmld = " domain=" + __utmld + ";";
            document.cookie = "__utm1=1; path=/;" + __utmlex + __utmld;
            document.cookie = "__utm2=1; path=/;" + __utmlex + __utmld;
            document.cookie = "__utm3=1; path=/;" + __utmlex + __utmld;
            __utmpi = __utmi;
        }
        document.cookie = "__utm1=1; path=/;" + __utmlex;
        document.cookie = "__utm2=1; path=/;" + __utmlex;
        document.cookie = "__utm3=1; path=/;" + __utmlex;
    }
    return __utmap;
}

function __utmTZConvert(__utmmz) {
    var __utmhr = 0,
        __utmmn = 0,
        __utmsg = '+';
    if (__utmmz && __utmmz != "") {
        if (__utmmz <= 0) {
            __utmsg = '+';
            __utmmz *= -1;
        } else {
            __utmsg = '-';
            __utmmz *= 1;
        }
        __utmhr = Math.floor((__utmmz / 60));
        __utmmn = Math.floor((__utmmz % 60));
    }
    if (__utmhr < 10) __utmhr = "0" + __utmhr;
    if (__utmmn < 10) __utmmn = "0" + __utmmn;
    return __utmsg + __utmhr + __utmmn;
}