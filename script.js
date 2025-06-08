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

  const facePips = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };

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



        function createFace(pipIndexes) {
            const face = document.createElement('div');
            face.className = 'face';
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                if (pipIndexes.includes(i)) {
                    const pip = document.createElement('div');
                    pip.className = 'pip';
                    cell.appendChild(pip);
                }
                face.appendChild(cell);
            }
            return face;
        }

        function createDiceElement() {
            const dice = document.createElement('div');
            dice.classList.add('dice');
            const order = [1, 6, 5, 2, 4, 3];
            const classes = ['front', 'back', 'right', 'left', 'top', 'bottom'];
            for (let i = 0; i < 6; i++) {
                const face = createFace(facePips[order[i]]);
                face.classList.add(classes[i]);
                dice.appendChild(face);
            }
            return dice;
        }

        function rotateDice(dice, face) {
            const finalTransforms = {
                1: 'rotateX(25deg) rotateY(25deg) rotateX(0deg) rotateY(0deg)',
                2: 'rotateX(25deg) rotateY(25deg) rotateX(-90deg) rotateY(0deg)',
                3: 'rotateX(25deg) rotateY(25deg) rotateX(0deg) rotateY(-90deg)',
                4: 'rotateX(25deg) rotateY(25deg) rotateX(0deg) rotateY(90deg)',
                5: 'rotateX(25deg) rotateY(25deg) rotateX(90deg) rotateY(0deg)',
                6: 'rotateX(25deg) rotateY(25deg) rotateX(0deg) rotateY(180deg)'
            };

            // Spin with diagonal tilt included
            const randomX = 360 * (Math.floor(Math.random() * 2) + 1);
            const randomY = 360 * (Math.floor(Math.random() * 2) + 1);
            dice.style.transform = `rotateX(${randomX + 25}deg) rotateY(${randomY + 25}deg)`;

            setTimeout(() => {
                dice.style.transform = finalTransforms[face];
            }, 200);
        }

        function setupRolling(containerId) {
            const container = document.getElementById(containerId);
            const dice = createDiceElement();
            container.appendChild(dice);

            let rollInterval = null;

            function rollOnce() {
                const randomFace = Math.floor(Math.random() * 6) + 1;
                rotateDice(dice, randomFace);
            }

            function startRolling() {
                let rollCount = 0;
                const maxRolls = 15;  // roll ~15 times (about 1.8 seconds if interval is 120ms)
                if (rollInterval) return;  // prevent multiple intervals

                rollInterval = setInterval(() => {
                    rollOnce();
                    rollCount++;
                    if (rollCount >= maxRolls) {
                        clearInterval(rollInterval);
                        rollInterval = null;
                        // Leave dice on last rolled face (no restart)
                    }
                }, 120);
            }

            // Start rolling on mouse enter
            document.getElementById('diceButton').addEventListener('mouseenter', () => {
                startRolling();
            });

            // Optional: stop rolling on mouse leave (or just let current rolls finish)
            // Here, we just let current roll finish, no new roll on leave

            // Initialize dice on first face, stationary
            rotateDice(dice, 1);
        }


        setupRolling('dice1');

        // document.getElementById("diceButton").addEventListener("click", () => {
        //     const dialog = document.getElementById("gamesDialog");
        //     dialog.style.display = dialog.style.display === "none" ? "block" : "none";
        // });

  form.addEventListener('submit', () => {    
    closePopup();    
  });

});