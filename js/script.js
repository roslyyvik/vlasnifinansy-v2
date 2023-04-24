document.querySelector('#toggleMenu').addEventListener('click', function(event) {
  if (this.classList.contains('active')) {
      hideMenus();
      document.getElementById('headerLogo').classList.remove('mHidden');
      this.classList.remove('active');
      this.classList.add('inactive');
  } else {
      hideMenus();
      document.getElementById('headerTitle').classList.add('hidden');
      document.getElementById('headerLogo').classList.remove('hidden');
      document.getElementById('mainNav').classList.remove('hidden');
      document.querySelector('body').classList.add('noScroll');
      this.classList.remove('inactive');
      this.classList.add('active');
  }
});

var topLevelNav = document.querySelectorAll('.mainNavLevel1Link');
for (var i = 0; i < topLevelNav.length; i++) {
  topLevelNav[i].addEventListener('click', function(event) {
      event.preventDefault();
      var secondLevelNav = document.querySelectorAll('.mainNavLevel2Container');
      for (var i = 0; i < secondLevelNav.length; i++) {
          secondLevelNav[i].classList.add('hidden');
      }
      this.nextElementSibling.classList.remove('hidden');
      var level1Containers = document.querySelectorAll('.mainNavLevel1');
      for (var i = 0; i < level1Containers.length; i++) {
          level1Containers[i].classList.remove('active');
      }
      this.parentElement.classList.add('active');
      var topContainers = document.querySelectorAll('.mainNavLevel1');
      for (var i = 0; i < topContainers.length; i++) {
          topContainers[i].classList.add('hidden');
      }
      document.getElementById('mainNavUl').classList.add('pos2');
      document.getElementById('mainNavUl').classList.remove('pos1');
      // document.getElementById('navFooter').hide();
      document.getElementById('toggleMenu').classList.add('hidden');
      document.getElementById('menuBack').classList.remove('hidden');
      document.getElementById('headerLogo').classList.add('mHidden');
      document.getElementById('navActiveSectionTitle').textContent = this.textContent;
      document.getElementById('navActiveSectionTitle').classList.remove('hidden');
  });
}

document.getElementById('menuBack').addEventListener('click', function(event) {
  var secondLevelNav = document.querySelectorAll('.mainNavLevel2Container');
  for (var i = 0; i < secondLevelNav.length; i++) {
      secondLevelNav[i].classList.add('hidden');
  }
  var topContainers = document.querySelectorAll('.mainNavLevel1');
  for (var i = 0; i < topContainers.length; i++) {
      topContainers[i].classList.remove('active');
  }
  document.getElementById('mainNavUl').classList.remove('pos2');
  document.getElementById('mainNavUl').classList.add('pos1');
  // document.getElementById('navFooter').show();
  document.getElementById('menuBack').classList.add('hidden');
  document.getElementById('toggleMenu').classList.remove('hidden');
  document.getElementById('navActiveSectionTitle').textContent = '';
  document.getElementById('navActiveSectionTitle').classList.add('hidden');
  document.getElementById('headerLogo').classList.remove('mHidden');
});

function hideMenus() {
  // document.getElementById('mask').classList.add('hidden');
  if (e = document.getElementById('jumplinksUl')) e.classList.add('hidden');
  if (e = document.getElementById('jumplinksToggle')) {
      e.classList.remove('active');
      document.getElementById('jumplinksToggle').classList.remove('active');
      document.getElementById('jumplinksToggle').classList.add('inactive');
  }
  document.getElementById('mainNav').classList.add('hidden');
  document.getElementById('mainNavUl').classList.remove('pos2');
  document.getElementById('mainNavUl').classList.add('pos1');
  // document.getElementById('navFooter').show();
  document.getElementById('toggleMenu').classList.remove('active');
  document.getElementById('toggleMenu').classList.add('inactive');
  document.getElementById('toggleMenu').classList.remove('active');
  document.getElementById('menuBack').classList.add('hidden');
  // document.getElementById('searchWrapper').hide();
  // document.getElementById('toggleSearch').classList.remove('active');
  // document.getElementById('toggleSearch').classList.add('inactive')
  document.getElementById('navActiveSectionTitle').classList.add('hidden');
  document.getElementById('headerTitle').classList.add('hidden');
  document.getElementById('headerLogo').classList.remove('active');
  document.getElementById('headerLogo').classList.remove('mHidden');
  document.querySelector('body').classList.remove('noScroll');
}

// ================copy element
function copyToClipboard(element) {
var $temp = $("<input>");
$("body").append($temp);
$temp.val($(element).text()).select();
document.execCommand("copy");
$temp.remove();
}
//========================
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("donate-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
}
}