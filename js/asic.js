/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ASIC = {
    experiments: function() {
        if ("undefined" != typeof Storage) {
            var a = localStorage.getItem("experiment");
            a && $.getScript(a);
        }
    },
    youtube: function() {
        $('a[href*="youtube.com"].embed').each(function() {
            $(this).removeClass("external-link");
            var a = $(this).attr("class"),
                e = "Youtube video: " + $(this).text(),
                o = decodeURI((RegExp("v=(.+?)(&|$)").exec($(this).attr("href")) || [, null])[1]);
            $(this).replaceWith('<div class="ytresp"><iframe title="' + e + '" class="youtube ' + a + '" src="https://www.youtube.com/embed/' + o + '?showinfo=0&rel=0&html5=1" frameborder="0" allowfullscreen></iframe></div>')
        });
    },
    hashBang: location.hash.split("#!")[1] || !1,
    anchorScroll: function() {
        $(document).on("click", 'a[href^="#"]', function(a) {
            var e = this.hash;
            "#!" !== e.substring(0, 2) && $(e).length && (a.preventDefault(),
                $(e).is(":visible") || $(e).parents(".collapsed-content:first").prev("h2").trigger("click"),
                $("html, body").animate({ scrollTop: $(e).offset().top }, 800));
        });
    },
    formatContent: function() {
        $(".pdf").removeClass("pdf"),
            $('a[href$=".pdf"]:not(:has(img))').addClass("pdf"),
            $("a.button").parents("p").prev("p").addClass("cta"),
            $('a.button[href*="calculators-and-apps/"]').addClass("calc").parents("p").prev("p").addClass("calc")
    },
    accessibility: function() {
        $("#aspnetForm").attr("onsubmit", "return false"),
            $('#secondary-nav a[href="' + location.pathname + '"]').addClass("active"),
            $("#SearchBox, #MainNavigation, #content, #Footer").attr("tabindex", "-1"),
            $(".skip a").click(function() {
                $($(this).attr("href")).focus()
            }),
            $("h2.collapse").wrapInner("<span/>").append('<button type="button" class="toggle" aria-label="Toggle hidden content"/>'),
            $("#content h2.collapse").each(function(a) {
                $(this).nextUntil("h2, .after, #lastupdated").wrapAll('<div class="collapsed-content hide"/>'),
                    $(this).nextUntil("h2, .after, #lastupdated").addBack().wrapAll('<div class="collapseable"/>')
            }),
            $(document).on("click", "h2.collapse", function() {
                $(this).toggleClass("open").next(".collapsed-content").slideToggle()
            }),
            $(document).on("click", ".clickable", function(a) {
                a.preventDefault();
                var e = $(this).find("a").attr("href");
                /http/.test(e) ? window.open(e, "_blank") : window.location = e
            }),
            ASIC.anchorScroll()
    },
    mobileNav: function() {
        $.each($("#MainNavigation ul ul li ul"), function() {
                var a = $(this);
                this.children.length || (a.siblings(".showIconSmall").remove(), a.closest("li").addClass("noChildren"))
            }),
            $("#MainNavigation ul:not(:has(li))").remove(),
            $(".primary-nav ul li:not(.noChildren), .primary-nav > li:not(.special, :first)").prepend('<button class="toggle" aria-label="Toggle hidden content"/>'),
            $(".primary-nav ul ul li:not(:has(ul)) button").remove(),
            $(".primary-nav li.current").addClass("open"),
            $(".primary-nav li.current:last").addClass("highlight"),
            $("nav button.toggle").click(function() {
                $(this).parent("li").toggleClass("open");
            }),
            $("#header-nav a").clone().appendTo("ul.primary-nav").wrap('<li class="special">'),
            $("#MainNavigation").append('<a href="/search" class="search">Search</a>'),
            $(".menu-icon").click(function(a) {
                a.preventDefault(),
                    $(this).toggleClass("active"),
                    $(".primary-nav").slideToggle();
            }),
            $("#MainNavigation .search").click(function(a) {
                a.preventDefault(),
                    $("div.search-bar").slideToggle();
            });
    },
    indigenous: function() {
        $(".standard-content").addClass("indigenous");
    },
    eNews: function() {
        $("#Footer .logo-wrapper").append('<form action="https://moneysmart.createsend.com/t/r/s/mudxj/" method="post" class="subscribe"><label for="subscribe" class="visuallyhidden">Subscribe to MoneySmart Tips eNewsletter</label><input id="subscribe" name="cm-mudxj-mudxj" type="email" placeholder="Email to subscribe" required /><button>Subscribe</button></form>')
    },
    tooltip: function(a, e) {
        $("#tooltip").remove();
        var o = $('<div id="tooltip"></div>');
        if (!a || "" === a) return !1;
        e.attr("title", ""),
            o.css("opacity", 0).html(a).appendTo("body");
        var t = function() {
            $(window).width() < 1.5 * o.outerWidth() ? o.css("max-width", $(window).width() / 2) : o.css("max-width", 350);
            var a = e.offset().left + e.outerWidth() / 2 - o.outerWidth() / 2,
                t = e.offset().top - o.outerHeight() - 20;
            if (a < 0 ? (a = e.offset().left + e.outerWidth() / 2 - 20, o.addClass("left")) : o.removeClass("left"), a + o.outerWidth() > $(window).width() ? (a = e.offset().left - o.outerWidth() + e.outerWidth() / 2 + 20, o.addClass("right")) : o.removeClass("right"), t < 0) {
                t = e.offset().top + e.outerHeight();
                o.addClass("top");
            } else o.removeClass("top"),
                o.css({ left: a, top: t }).animate({ top: "+=10", opacity: 1 }, 50);
        };
        t(),
            $(window).resize(t);
        var n = function() {
            o.animate({ top: "-=10", opacity: 0 }, 50, function() {
                    $(this).remove();
                }),
                e.attr("title", a);
        };
        e.bind("mouseleave", n),
            o.bind("click", n);
    },
    glossaryTips: function() {
        $(".glossary-link").removeAttr("title"),
            $(document).on("mouseenter", ".glossary-link", function() {
                $("#ttDrop").length || $("body").append('<div id="ttDrop" style="display:none"/>');
                var a = $(this).attr("href"),
                    e = $(this);
                void 0 === e.attr("title") && void 0 !== a ? (ASIC.tooltip("loading...", e), e.addClass("loading"), $("#ttDrop").load(a + " #content .glossary-item p", function() {
                    ASIC.tooltip($("#ttDrop").text(), e), e.removeClass("loading");
                })) : ASIC.tooltip($(this).attr("title"), $(this));
            });
    },
    feedbackShow: function() {
        var a = location.pathname;
        if ("/" === a || "/feedback" === a)
            return !1;
        $("#lastupdated").after('<div id="feedback"><a class="icon" title="Send comments about this page" href="#feedback"><span class="icon-bubble"/><span>Comments</span></a></div><div id="feedbackwizard" class="hide"/>'),
            $('a[href="#feedback"]').click(function(a) {
                a.preventDefault(),
                    "undefined" == typeof Feedback && $.getScript("https://d11b5fc6vsbqbg.cloudfront.net/scripts/feedback.js"),
                    $("#feedbackwizard").slideToggle();
            });
    },
    linkControl: function() {
        $("a[href*='http://'], a[href*='https://']").addClass("external-link"),
            $("a[href*='moneysmart.gov.au']").removeClass("external-link"),
            $("a[href*='.pdf']:not(.external-link), a[href*='.doc']:not(.external-link), a[href*='.docx']:not(.external-link), a[href*='.xls']:not(.external-link), a[href*='.xlsx']:not(.external-link), a[href*='.ppt']:not(.external-link), a[href*='.pptx']:not(.external-link), a[href*='.rtf']:not(.external-link)").addClass("document-link"),
            $(".external-link, .document-link").attr({ target: "_blank", rel: "noopener" }),
            $('a[target="_blank"]').attr("title", function() {
                return $(this).attr("title") + " (opens in a new tab)";
            });
    },
    // trackEvent: function(a, e, o, t, n) {
    //     n = n || !1, dataLayer.push({ event: "GAEvent", gaEventCategory: a, gaEventAction: e, gaEventLabel: o, gaEventValue: t, gaEventNonInteraction: n })
    // },
    // gtmWrapperForGA: function() {
    //     window._gaq = {},
    //         window._gaq.push = function(a) {
    //             "_trackEvent" === a[0] && ASIC.trackEvent(a[1], a[2], a[3], a[4]),
    //                 "_setCustomVar" === a[0] && dataLayer.push({ School: a[3], event: "logSchool" })
    //         };
    // },
    account: function() {
        $(document).on("click", 'a[href^="/my-account"]', function(a) {
            if (a.preventDefault(), "undefined" == typeof MSuser)
                return $.getScript("https://d11b5fc6vsbqbg.cloudfront.net/scripts/ms-login.js", function() {
                    MSuser.isAuthenticated()
                }), !1;
            MSuser.isLoggedIn ? MSuser.dialog.account() : MSuser.isAuthenticated()
        });
    },
    ajaxTracking: function() {
        $(document).ajaxError(function(a, e, o) {
            200 !== e.status && ASIC.trackEvent("Error - AJAX (" + o.type + ")", o.url, String(e.status), 0, !0);
        });
    },
    init: function() {
        "undefined " !== window._gaq && "object" == typeof window._gaq || ASIC.gtmWrapperForGA(),
            location.pathname.match("/indigenous") && ASIC.indigenous(),
            $('a[href*="youtube.com"].embed').length && ASIC.youtube(),
            ASIC.linkControl(),
            $(document).on("mouseenter focus", "[rel~=help]", function() {
                ASIC.tooltip($(this).attr("title"),
                    $(this));
            }),
            $(".glossary-link").length && ASIC.glossaryTips(),
            ASIC.experiments(),
            ASIC.accessibility(),
            location.host.match("moneysmart") && (ASIC.formatContent(),
                ASIC.calcsNav(),
                ASIC.feedbackShow(),
                ASIC.account(),
                ASIC.eNews(),
                ASIC.megafooter(),
                ASIC.ajaxTracking(),
                $('a[href*=".mp3"]').length && $.getScript("https://d11b5fc6vsbqbg.cloudfront.net/apps/audio-player/audio-player.js")),
            ASIC.mobileNav();
    },
    megafooter: function() {
        var a = "";
        $.each(ASIC.content.footer, function(e, o) {
                a = a + "<div><h3>" + e + "</h3><ul>",
                    $.each(o, function(e, o) {
                        a = a + '<li><a href="' + o + '" title="' + e + '">' + e + "</a></li>";
                    }),
                    a += "</ul></div>";
            }),
            $("#Footer .megafooter").remove(),
            $("#Footer").prepend('<div class="megafooter">' + a + "</div>");
    },
    calcsNav: function() {
        var a = "";
        $.each(ASIC.content.calculators, function(e, o) {
                a += '<li itemprop="name"><a href="' + o.url + '" itemprop="url">' + o.label + "</a>",
                    o.children && (a += "<ul>", $.each(o.children, function(e, o) { a += '<li itemprop="name"><a href="' + o + '" itemprop="url">' + e + "</a></li>" }), a += "</ul>"),
                    a += "</li>";
            }),
            $("#n10 > ul").html(a);
    },
    content: {
        footer: {
            "Top calculators": {
                "Budget planner": "/tools-and-resources/calculators-and-apps/budget-planner",
                "Mortgage calculator": "/tools-and-resources/calculators-and-apps/mortgage-calculator",
                "Income tax calculator": "/tools-and-resources/calculators-and-apps/income-tax-calculator",
                "Compound interest calculator": "/tools-and-resources/calculators-and-apps/compound-interest-calculator",
                "Personal loan calculator": "/tools-and-resources/calculators-and-apps/personal-loan-calculator",
                "Retirement planner": "/tools-and-resources/calculators-and-apps/retirement-planner",
                "Superannuation calculator": "/tools-and-resources/calculators-and-apps/superannuation-calculator"
            },
            Search: {
                "Unclaimed money": "/tools-and-resources/find-unclaimed-money",
                "Calculators & apps": "/tools-and-resources/calculators-and-apps",
                "Financial advisers": "/investing/financial-advice/financial-advisers-register",
                "Financial counsellors": "/managing-your-money/managing-debts/financial-counselling",
                "Unlicensed companies": "/scams/companies-you-should-not-deal-with",
                "ASIC lists": "/tools-and-resources/check-asic-lists",
                "Financial infographics": "/tools-and-resources/financial-infographics"
            },
            "Quick links": {
                Publications: "/tools-and-resources/publications",
                Videos: "/tools-and-resources/videos",
                "How to complain": "/tools-and-resources/how-to-complain",
                "Other languages": "/tools-and-resources/publications/other-languages",
                "Under 25s": "/life-events-and-you/under-25s",
                "Over 55s": "/life-events-and-you/over-55s",
                Indigenous: "/life-events-and-you/indigenous"
            },
            "Life events": {
                "Buying a home": "/life-events-and-you/life-events/buying-a-home",
                "Having a baby": "/life-events-and-you/life-events/having-a-baby",
                "Divorce and separation": "/life-events-and-you/life-events/divorce-or-separation",
                "Losing your job": "/life-events-and-you/life-events/losing-your-job",
                "Buying a car": "/life-events-and-you/life-events/buying-a-car",
                "Getting married": "/life-events-and-you/life-events/getting-married",
                "More life events": "/life-events-and-you/life-events/"
            }
        },
        calculators: {
            node0: {
                label: "Budgeting &amp; saving calculators",
                url: "/tools-and-resources/calculators-and-apps/budgeting-and-saving-calculators",
                children: {
                    "Budget planner": "/tools-and-resources/calculators-and-apps/budget-planner",
                    "Compound interest calculator": "/tools-and-resources/calculators-and-apps/compound-interest-calculator",
                    "GST calculator": "/tools-and-resources/calculators-and-apps/gst-calculator",
                    "Income tax calculator": "/tools-and-resources/calculators-and-apps/income-tax-calculator",
                    "Savings goals calculator": "/tools-and-resources/calculators-and-apps/savings-goals-calculator",
                    "Simple money manager": "/tools-and-resources/calculators-and-apps/simple-money-manager"
                }
            },
            node1: {
                label: "Investment calculators",
                url: "/tools-and-resources/calculators-and-apps/investment-calculators",
                children: {
                    "Financial advisers register": "/investing/financial-advice/financial-advisers-register",
                    "Financial advice toolkit": "/investing/financial-advice/financial-advice-toolkit",
                    "Investing challenge": "/investing/invest-smarter/investing-challenge",
                    "Investor toolkit": "/investing/invest-smarter/investor-toolkit",
                    "Managed funds fee calculator": "/tools-and-resources/calculators-and-apps/managed-funds-fee-calculator"
                }
            },
            node2: {
                label: "Loan, credit &amp; debt calculators",
                url: "/tools-and-resources/calculators-and-apps/loan-credit-and-debt-calculators",
                children: {
                    "Credit card calculator": "/tools-and-resources/calculators-and-apps/credit-card-calculator",
                    "Financial counsellor search": "/managing-your-money/managing-debts/financial-counselling/find-a-financial-counsellor",
                    "Interest-free deal calculator": "/tools-and-resources/calculators-and-apps/interest-free-deal-calculator",
                    "Payday loan calculator": "/tools-and-resources/calculators-and-apps/payday-loan-calculator",
                    "Personal loan calculator": "/tools-and-resources/calculators-and-apps/personal-loan-calculator",
                    "Rent vs buy calculator": "/tools-and-resources/calculators-and-apps/rent-vs-buy-calculator"
                }
            },
            node3: {
                label: "Money health calculators &amp; toolkits",
                url: "/tools-and-resources/calculators-and-apps/money-health-calculators-and-toolkits",
                children: {
                    "Asset stocktake calculator": "/tools-and-resources/calculators-and-apps/asset-stocktake-calculator",
                    "Divorce &amp; separation financial checklist": "/life-events-and-you/life-events/divorce-and-separation/divorce-and-separation-financial-checklist",
                    "Parental leave calculator": "/tools-and-resources/calculators-and-apps/parental-leave-calculator",
                    "Women's money toolkit": "/life-events-and-you/women/womens-money-toolkit",
                    "Your net worth calculator": "/tools-and-resources/calculators-and-apps/your-net-worth-calculator"
                }
            },
            node4: {
                label: "Mortgage calculators",
                url: "/tools-and-resources/calculators-and-apps/mortgage-calculators",
                children: {
                    "Interest-only mortgage calculator": "/tools-and-resources/calculators-and-apps/interest-only-mortgage-calculator",
                    "Mortgage calculator": "/tools-and-resources/calculators-and-apps/mortgage-calculator",
                    "Mortgage switching calculator": "/tools-and-resources/calculators-and-apps/mortgage-switching-calculator",
                    "Reverse mortgage calculator": "/tools-and-resources/calculators-and-apps/reverse-mortgage-calculator",
                    "Super vs mortgage tool": "/tools-and-resources/calculators-and-apps/super-vs-mortgage-calculator"
                }
            },
            node5: {
                label: "Super &amp; retirement calculators",
                url: "/tools-and-resources/calculators-and-apps/super-and-retirement-calculators",
                children: {
                    "Account-based pension calculator": "/tools-and-resources/calculators-and-apps/account-based-pension-calculator",
                    "Employer contributions calculator": "/tools-and-resources/calculators-and-apps/employer-contributions-calculator",
                    "Retirement planner": "/tools-and-resources/calculators-and-apps/retirement-planner",
                    "Superannuation calculator": "/tools-and-resources/calculators-and-apps/superannuation-calculator",
                    "Super and pension age calculator": "/tools-and-resources/calculators-and-apps/super-and-pension-age-calculator",
                    "Super contributions optimiser": "/tools-and-resources/calculators-and-apps/super-contributions-optimiser",
                    "Super co-contribution calculator": "/tools-and-resources/calculators-and-apps/super-co-contribution-calculator",
                    "Super vs mortgage tool": "/tools-and-resources/calculators-and-apps/super-vs-mortgage-calculator"
                }
            },
            node6: {
                label: "Search tools",
                url: "/tools-and-resources/calculators-and-apps/search-tools",
                children: {
                    "ASIC lists": "/tools-and-resources/check-asic-lists",
                    "Financial advisers register": "/investing/financial-advice/financial-advisers-register",
                    "Financial counsellor search": "/managing-your-money/managing-debts/financial-counselling/find-a-financial-counsellor",
                    "Unclaimed money": "/tools-and-resources/find-unclaimed-money",
                    "Unlicensed companies list": "/scams/companies-you-should-not-deal-with"
                }
            },
            node7: {
                label: "Mobile apps",
                url: "/tools-and-resources/calculators-and-apps/mobile-apps",
                children: {
                    "First Business": "/tools-and-resources/calculators-and-apps/mobile-apps/first-business",
                    "Mobile calculator": "/tools-and-resources/calculators-and-apps/mobile-apps/mobile-calculator",
                    "MoneySmart Cars": "/tools-and-resources/calculators-and-apps/mobile-apps/moneysmart-cars",
                    TrackMyGOALS: "/tools-and-resources/calculators-and-apps/mobile-apps/trackmygoals",
                    TrackMySPEND: "/tools-and-resources/calculators-and-apps/mobile-apps/trackmyspend"
                }
            },
            node8: {
                label: "Audio",
                url: "/tools-and-resources/audio",
                children: {}
            },
            node9: {
                label: "Financial infographics",
                url: "/tools-and-resources/financial-infographics",
                children: {}
            },
            node10: {
                label: "Financial news",
                url: "/tools-and-resources/news",
                children: {}
            },
            node11: {
                label: "How to complain",
                url: "/tools-and-resources/how-to-complain",
                children: {}
            },
            node12: {
                label: "Publications",
                url: "/tools-and-resources/publications",
                children: {}
            },
            node13: {
                label: "Quizzes",
                url: "/tools-and-resources/quizzes",
                children: {}
            },
            node14: {
                label: "Seminars",
                url: "/tools-and-resources/seminars",
                children: {}
            },
            node15: {
                label: "Subscribe to our eNewsletter",
                url: "/tools-and-resources/subscribe",
                children: {}
            },
            node16: {
                label: "Videos",
                url: "/tools-and-resources/videos",
                children: {}
            }
        }
    }
};
$(document).ready(function() {
        ASIC.init();
    }),
    jQuery.cookie = function(a, e, o) {
        if (void 0 === e) {
            var t = null;
            if (document.cookie && "" !== document.cookie)
                for (var n = document.cookie.split(";"), l = 0; l < n.length; l++) {
                    var s = jQuery.trim(n[l]);
                    if (s.substring(0, a.length + 1) === a + "=") {
                        t = decodeURIComponent(s.substring(a.length + 1));
                        break
                    }
                }
            return t;
        }
        o = o || {},
            null === e && (e = "", o.expires = -1);
        var r = "";
        if (o.expires && ("number" == typeof o.expires || o.expires.toUTCString)) {
            var c;
            "number" == typeof o.expires ? (c = new Date).setTime(c.getTime() + 24 * o.expires * 60 * 60 * 1e3) : c = o.expires, r = "; expires=" + c.toUTCString()
        }
        var i = o.path ? "; path=" + o.path : "",
            u = o.domain ? "; domain=" + o.domain : "",
            d = o.secure ? "; secure" : "";
        document.cookie = [a, "=", encodeURIComponent(e), r, i, u, d].join("")
    };