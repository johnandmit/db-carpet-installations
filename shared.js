// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        hamburger.textContent = mobileNav.classList.contains('open') ? '\u2715' : '\u2630';
    });
}

// Scroll animations
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => observer.observe(el));

// Header scroll shadow
window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (header) {
        header.style.boxShadow = window.scrollY > 50 ? '0 2px 12px rgba(0,0,0,0.08)' : 'none';
    }
});

// Review Popups Logic
const reviewMockData = [
    { name: "Mike Mead", stars: "★★★★★", text: "\"David was prompt and friendly. His workmanship was top quality, and the pricing was fair.\"" },
    { name: "M Y", stars: "★★★★★", text: "\"I was referred to DB Carpet Installations, and I'm very pleased with the service I received.\"" },
    { name: "Lauren B.", stars: "★★★★★", text: "\"The service was absolutely amazing! David was incredibly helpful throughout the whole process.\"" },
    { name: "Mel Abbott", stars: "★★★★★", text: "\"David was very helpful. Great to deal with.\"" },
    { name: "Candice", stars: "★★★★★", text: "\"David was fantastic! Super professional, friendly, and the results look great.\"" },
    { name: "Jessica B.", stars: "★★★★★", text: "\"Communication was excellent throughout, from coordinating the job to picking up the carpet.\"" },
    { name: "Kimberley B.", stars: "★★★★★", text: "\"David did an awesome job of our carpet repair! Very reasonably priced, great communication.\"" },
    { name: "MissChloe Kim", stars: "★★★★★", text: "\"Unbelievably more affordable than the usual well known carpet companies.\"" },
    { name: "David M", stars: "★★★★★", text: "\"David and his crew were extremely helpful. Communication was fantastic. Highly recommend.\"" },
    { name: "Angelique K.", stars: "★★★★★", text: "\"They have done an amazing job, so fast and efficient!\"" }
];

function showReviewPopup() {
    // Determine max popups based on screen width
    let maxPopups = 1; // Mobile default
    if (window.innerWidth >= 1500) {
        maxPopups = 3; // 4K / Ultrawide
    } else if (window.innerWidth >= 768) {
        maxPopups = 2; // Desktop / Tablet
    }

    // Get or create container
    let container = document.querySelector('.review-popup-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'review-popup-container';
        document.body.appendChild(container);
    }

    // Check current popups count, remove oldest if at max
    const currentPopups = container.querySelectorAll('.review-popup:not(.removing)');
    if (currentPopups.length >= maxPopups) {
        const oldestPopup = currentPopups[0]; // Gets the first one in the DOM (oldest since appendChild adds to end)
        removePopup(oldestPopup);
    }

    // Create new popup
    const review = reviewMockData[Math.floor(Math.random() * reviewMockData.length)];
    const popup = document.createElement('div');
    popup.className = 'review-popup';
    
    popup.innerHTML = `
        <div class="review-popup-header">
            <span class="review-popup-name">${review.name}</span>
            <span class="review-popup-stars">${review.stars}</span>
        </div>
        <div class="review-popup-text">${review.text}</div>
    `;

    container.appendChild(popup);

    // Auto remove after 8 seconds
    setTimeout(() => {
        if (popup.parentElement && !popup.classList.contains('removing')) {
            removePopup(popup);
        }
    }, 8000);
}

function removePopup(popup) {
    popup.classList.add('removing');
    // Wait for transition to finish before removing from DOM
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 400); // 400ms matches CSS transition
}

// Start sequence (delay first popup slightly, then every 10s)
setTimeout(() => {
    showReviewPopup();
    setInterval(showReviewPopup, 10000);
}, 2000);
