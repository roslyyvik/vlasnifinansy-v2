
        // while we have basic authentication turned on the user may be directed to the homepage, so lets redirect back to where they want to go
        if (window.URLSearchParams) { // IE11 and maybe others doesn't support this
          var urlParams = new URLSearchParams(location.search);
          if (urlParams.has('ReturnUrl')) {
              location.href = urlParams.get('ReturnUrl')
          }
      } else {
          if (location.search.indexOf("welcome") > 0) {
              location.href = "/welcome-to-the-next-generation-of-moneysmart"
          } // hack for ie11
      }

      var SLIDES_AUTO_PLAY = true;
      document.addEventListener("DOMContentLoaded", function(e) {

          //detect if can't support filter
          function supportsProperty(prop) {
              var el = document.createElement("div");
              el.style.cssText = prop + ":initial";
              return el.style[prop] === "initial";
          }
          if (supportsProperty("filter") == false) {
              document.getElementById('hp-tabs').classList.add('no-filter');
          }

          //default active tab if desktop mode
          var isDesktop = Math.ceil((document.getElementById("starter-pack").offsetWidth / 16)) >= 60;
          if (isDesktop) {
              var firstMenu = document.getElementById('tabs-list').firstChild.nextSibling;
              firstMenu.classList.add('active');
          }

          //toggle active tab
          var topLevelTab = document.getElementsByClassName('tabLevel1Link');
          for (var i = 0; i < topLevelTab.length; i++) {
              topLevelTab[i].addEventListener('click', function(event) {
                  var mainTab = document.getElementById('tabs-list');
                  var items = mainTab.getElementsByTagName("li");
                  var currentState = this.parentElement.className;
                  for (var i = 0; i < items.length; i++) {
                      items[i].classList.remove('active');
                  }
                  //OPTION 1: Can collapse menu on mobile
                  if (currentState != "active" && !isDesktop) {
                      this.parentElement.classList.add('active');
                  } else if (isDesktop) {
                      this.parentElement.classList.add('active');
                  }

                  //if all menus are collapsed and isMobile then go to first menu item at the top of the page
                  var activeTabs = document.getElementsByClassName('active');
                  if (!isDesktop && activeTabs.length == 0) {
                      window.location.href = "#" + items[0].id;
                  } else {
                      window.location.href = "#" + this.parentElement.id;
                  }

                  //OPTION 2: Always have at least one menu item open - this makes it consistent with the desktop view

                  // this.parentElement.classList.add('active');
                  // window.location.href = "#" + this.parentElement.id;
              });
          }

          var slides = document.getElementsByClassName('slide');
          var slideNavs = document.getElementsByClassName('snav');

          //slideshow preload - don't start animation until first background image loaded
          var imageUrl;
          //SET THIS TO FIRST SLIDE IMAGE DEPENDING ON ORIENTATION
          if (window.innerWidth > window.innerHeight) {
              imageUrl = "/assets/financial-literacy_portraite.png"
          } else {
              imageUrl = "/assets/financial-literacy.jpg"
          }

          var bgElement = document.querySelector("body");
          bgElement.classList.add("loading");
          var preloaderImg = document.createElement("img");
          preloaderImg.src = imageUrl;

          var isScrolling;
          var currentSlide = 1;
          var slideshowContainer = document.getElementById("slideshow-container");
          var slideProgressBar = document.getElementById("slide-progress-bar");

          preloaderImg.addEventListener("load", function(event) {
              bgElement.classList.remove("loading");
              bgElement.classList.add("loaded");
              preloaderImg = null;

              //if touchscreen device , start slide-left animation
              if (matchMedia('(pointer:coarse)').matches) {
                  if (SLIDES_AUTO_PLAY) {
                      //start animation
                      slideProgressBar.classList.add('play-progress-bar');
                      isScrolling = setInterval(function() {
                          //get slideWidth to know how far to scroll
                          var slideWidth = slideshowContainer.offsetWidth;

                          slideshowContainer.scrollTo({
                              left: currentSlide * slideWidth,
                              behavior: 'smooth'
                          });
                          currentSlide++;
                          if (currentSlide == slides.length) {
                              //stop scrolling if on last slide
                              clearInterval(isScrolling);
                          }
                      }, 6000);
                  }
              } else {
                  //start slides going with playSlide class
                  for (var i = 0; i < slideNavs.length; i++) {
                      var progressBlock = slideNavs[i].getElementsByClassName('slide-progress');
                      if (SLIDES_AUTO_PLAY) {
                          progressBlock[0].classList.add('playSlide');
                      } else {
                          if (i == 0) {
                              progressBlock[0].parentElement.classList.add('selected');
                          }
                      }

                      slideNavs[i].addEventListener('click', function(event) {
                          //if nav button clicked, jump to that slide
                          jumpSlide(this.dataset.index);
                      });
                  }

                  for (var i = 0; i < slides.length; i++) {
                      if (SLIDES_AUTO_PLAY) {
                          slides[i].classList.add('playSlide');
                      }
                  }
              }
          });

          //if slide link gets focus make sure it's visible - this is needed if tabbing through slides
          for (var i = 0; i < slides.length; i++) {
              var slideLink = slides[i].getElementsByTagName('a');
              if (slideLink.length > 0) {
                  slideLink[0].addEventListener('focus', function(event) {
                      jumpSlide(this.dataset.index);
                  });
              }
          }

          function jumpSlide(slideIndex) {
              for (var j = 0; j < slideNavs.length; j++) {
                  slideNavs[j].classList.remove('selected');
                  slideNavs[j].classList.add('unselected');

                  var innerProgressBlock = slideNavs[j].getElementsByClassName('slide-progress');
                  innerProgressBlock[0].classList.add('unselected');
              }
              slideNavs[slideIndex - 1].classList.remove('unselected');
              slideNavs[slideIndex - 1].classList.add('selected');

              for (var j = 0; j < slides.length; j++) {
                  slides[j].classList.add('hideSlide');
                  slides[j].classList.remove('showSlide');
              }

              slides[slideIndex - 1].classList.remove('hideSlide');
              slides[slideIndex - 1].classList.add('showSlide');

              //focus on slide link
              document.getElementById('slide' + slideIndex + '-link').focus();

          }


          function stopSlides() {
              for (var i = 0; i < slides.length; i++) {
                  slides[i].classList.remove('playSlide');
              }
              for (var i = 0; i < slideNavs.length; i++) {
                  slideNavs[i].classList.remove('playSlide');
              }
          }

        //   updateHeight();

          //stop scrolling animation if user touches slide
          slideshowContainer.addEventListener('touchstart', function(event) {
              clearInterval(isScrolling);
              slideProgressBar.remove();
          }, {
              passive: true
          });

      });


      //FOLLOWING CODE IS ALL SO TABLETS AND MOBILES WILL NOT CUT OFF ON THE BOTTOM WHEN USING 100 VH

      var OPERATING_SYSTEM = getMobileOperatingSystem();
      /**
       * Determine the mobile operating system.
       * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
       *
       * @returns {String}
       */
      function getMobileOperatingSystem() {
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          // Windows Phone must come first because its UA also contains "Android"
          if (/windows phone/i.test(userAgent)) {
              return "Windows Phone";
          }

          if (/android/i.test(userAgent)) {
              return "Android";
          }

          // iOS detection from: http://stackoverflow.com/a/9039885/177710
          if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
              return "iOS";
          }

          //additional check for iPad after iOS 13 removed iPad from userAgent
          if ((navigator.userAgent.indexOf("iPad") !== -1 || navigator.userAgent.indexOf('Mac') > -1) && 'ontouchend' in document) {
              return "iOS";
          }

          return "unknown";
      }

      /* https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ */
      // Set css variable to be screen height to display full screen sections
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    //   var vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
    //   document.documentElement.style.setProperty('--vh', vh + "px");

    //   function updateHeight() {
    //       var vh = window.innerHeight * 0.01;
    //       document.documentElement.style.setProperty('--vh', vh + "px");
    //   }

    //   window.onorientationchange = debounce(function() {
    //       updateHeight();
    //   }, 200);

    //   window.onresize = debounce(function(event) {
    //       //don't update if android or ios
    //       if (OPERATING_SYSTEM == "" || OPERATING_SYSTEM == "unknown") {
    //           updateHeight();
    //       }
    //   }, 200);

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