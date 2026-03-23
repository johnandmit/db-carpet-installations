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
const realReviewsData = [
    { name: "Mike Mead", stars: "★★★★★", text: "\"The service was very prompt and friendly from start to finish, the workmanship was top quality, and the pricing was fair and transparent.\"" },
    { name: "M Y", stars: "★★★★★", text: "\"The team arrived on time and got straight to work. The carpet repairs were completed with exemplary workmanship.\"" },
    { name: "Lauren Bezuidenhout", stars: "★★★★★", text: "\"We had all our downstairs carpets replaced and the service was absolutely amazing! David was incredibly helpful throughout the whole process.\"" },
    { name: "Mel Abbott", stars: "★★★★★", text: "\"I had a small job of putting a couple of corners of carpet back down. David was very helpful, fitted me in... Great to deal with.\"" },
    { name: "Candice", stars: "★★★★★", text: "\"David was fantastic! He handled everything himself and did an amazing job with the carpet. Super professional, friendly.\"" },
    { name: "Jessica Broun", stars: "★★★★★", text: "\"David's communication was excellent throughout. He couldn’t have been more helpful, and the workmanship is excellent.\"" },
    { name: "Angelique Kruger", stars: "★★★★★", text: "\"They have done an amazing job installing our carpets, so fast and efficient! Friendly and professional. They absolutely know their stuff!\"" },
    { name: "Kimberley Bell", stars: "★★★★★", text: "\"David did an awesome job of our carpet repair! Very reasonably priced, great communication, and appreciated his attention to detail.\"" },
    { name: "MissChloe Kim", stars: "★★★★★", text: "\"I couldn’t be happier with the result and the price. His quote was unbelievably more affordable than the usual well known carpet companies.\"" },
    { name: "David M", stars: "★★★★★", text: "\"David and his crew were extremely helpful and the quality of their work was exceptional. Their communication was fantastic too.\"" }
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
        const oldestPopup = currentPopups[0];
        removePopup(oldestPopup);
    }

    // Create new popup
    const review = realReviewsData[Math.floor(Math.random() * realReviewsData.length)];
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

    // To stack reviews, they need to stay on screen long enough for the next one to appear.
    // If intervals are every 10s, we keep them for (maxPopups * 10s - 1s) to allow maxPopups on screen.
    const displayTime = (maxPopups * 10000) - 1000; 
    setTimeout(() => {
        if (popup.parentElement && !popup.classList.contains('removing')) {
            removePopup(popup);
        }
    }, displayTime);
}

function removePopup(popup) {
    popup.classList.add('removing');
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 400); // 400ms matches CSS transition
}

// Start sequence (delay first popup slightly, then every 10s)
setTimeout(() => {
    // Show the first one immediately
    showReviewPopup();
    
    // On larger screens, optionally show a second one sooner so it doesn't look empty for too long,
    // or just rely on the standard 10s interval. We'll use the interval.
    setInterval(showReviewPopup, 10000);
}, 2000);
