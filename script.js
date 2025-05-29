window.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.crt-loader');
    const pageContent = document.getElementById('page-content');
    const navLinks = document.querySelectorAll("nav a");
    const overlay = document.getElementById("popupOverlay");
    const closeBtn = document.getElementById("closePopup");
    const mainContent = document.getElementById("maincontent");
    const popupContents = document.querySelectorAll(".popup-content");
  
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
  
  
  });