window.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.crt-loader');
  const pageContent = document.getElementById('page-content');
  const navLinks = document.querySelectorAll("nav a");
  const overlay = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("closePopup");
  const mainContent = document.getElementById("maincontent");
  const popupContents = document.querySelectorAll(".popup-content");
  const boosted = document.querySelector('.scanlines-boost');
  const form = document.getElementById('contactForm');
  const gamesButton = document.getElementById('diceButton');
  const popupGames = document.getElementById('popupGames');


  loader.addEventListener('animationend', () => {
    loader.style.display = 'none';
    pageContent.style.opacity = 1;
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      popupContents.forEach(div => div.style.display = "none");

      // Show the one matching the clicked link text
      const linkText = e.target.textContent.trim().split(" ")[0].toLowerCase();
      const popupDiv = document.getElementById("popup" + linkText.charAt(0).toUpperCase() + linkText.slice(1));

      if (popupDiv) popupDiv.style.display = "block";

      // Fade out main content
      mainContent.style.opacity = "0";

      // Show and fade in overlay
      overlay.classList.add("visible");
    });
  });

  function closePopup() {
    overlay.classList.remove("visible");

    setTimeout(() => {
      mainContent.style.opacity = "1";
      popupContents.forEach(div => div.style.display = "none");
      if (form) form.reset();
    }, 300);
  }

  closeBtn.addEventListener("click", () => {
    closePopup();
  });

  document.querySelectorAll('#title span').forEach(span => {
    // Touch start
    span.addEventListener('touchstart', () => {
      span.classList.add('pop');
    });

    // Optional: remove the effect shortly after for tap
    span.addEventListener('touchend', () => {
      setTimeout(() => span.classList.remove('pop'), 300);
    });

    // Optional: support swipe by keeping it on during move
    span.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el?.tagName === 'SPAN' && el.closest('#title')) {
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 300);
      }
    });
  });

  document.addEventListener('mouseleave', () => {
    boosted.style.opacity = '0'; // fade out when mouse leaves screen
  });

  overlay.addEventListener('click', function (e) {
    const popup = overlay.querySelector('.popup-window');
    if (!popup.contains(e.target)) {
      closePopup();
    }
  });

  form.addEventListener('submit', () => {
    closePopup();
  });

  gamesButton.addEventListener('click', () => {
    document.querySelector('.popup-window').style.display = 'block';
    popupContents.forEach(div => div.style.display = "none");
    if (popupGames) popupGames.style.display = "block";
    mainContent.style.opacity = "0";
    overlay.classList.add("visible");
  });

});


function openGame(url) {
  const dialog = document.getElementById("gameDialog");
  const frame = document.getElementById("gameFrame");
  //const popupWindow = document.querySelectorAll(".popup-window");
  frame.src = url;  
  document.querySelector('.popup-window').style.display = 'none';
  //popupWindow.forEach(div => div.style.display = "none");
  dialog.showModal();
}

function closeGame() {
  const dialog = document.getElementById("gameDialog");
  const frame = document.getElementById("gameFrame");
  const overlay = document.getElementById("popupOverlay");
  const mainContent = document.getElementById("maincontent");
  const popupContents = document.querySelectorAll(".popup-content");
  const form = document.getElementById('contactForm');

  frame.src = "";
  dialog.close();
  overlay.classList.remove("visible");

    setTimeout(() => {
      mainContent.style.opacity = "1";
      document.querySelector('.popup-window').style.display = 'block';
      popupContents.forEach(div => div.style.display = "none");
      if (form) form.reset();
    }, 300);
}