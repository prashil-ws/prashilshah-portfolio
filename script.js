// Smooth scroll effect for navigation menu

const navLinks = document.querySelectorAll('nav ul li a');

for (const link of navLinks) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({
            behavior: 'smooth'
        });
    });
}