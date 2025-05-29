window.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.crt-loader');
  const pageContent = document.getElementById('page-content');
  const navLinks = document.querySelectorAll("nav a");
  const overlay = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("closePopup");
  const mainContent = document.getElementById("maincontent");
  const popupContents = document.querySelectorAll(".popup-content");
  const boosted = document.querySelector('.scanlines-boost');


  loader.addEventListener('animationend', () => {
    loader.style.display = 'none';
    pageContent.style.opacity = 1;
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      popupContents.forEach(div => div.style.display = "none");

      // Show the one matching the clicked link text
      const linkText = e.target.textContent.trim().toLowerCase();
      const popupDiv = document.getElementById("popup" + linkText.charAt(0).toUpperCase() + linkText.slice(1));

      if (popupDiv) popupDiv.style.display = "block";

      // Fade out main content
      mainContent.style.opacity = "0";

      // Show and fade in overlay
      overlay.classList.add("visible");
    });
  });

  closeBtn.addEventListener("click", () => {
    // Hide overlay
    overlay.classList.remove("visible");

    // Restore main content after delay (to match overlay fade-out)
    setTimeout(() => {
      mainContent.style.opacity = "1";
      popupContents.forEach(div => div.style.display = "none");
    }, 300);
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

  document.addEventListener('mousemove', (e) => {
    const x = `${e.clientX}px`;
    const y = `${e.clientY}px`;
    boosted.style.setProperty('--x', x);
    boosted.style.setProperty('--y', y);
    //boosted.style.opacity = '0.1'; // fade in
  });

  document.addEventListener('mouseleave', () => {
    boosted.style.opacity = '0'; // fade out when mouse leaves screen
  });

});