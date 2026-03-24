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

/* ═══════════════ REVIEWS CAROUSEL JS ═══════════════ */
(function() {
    let carouselIndex = 0;
    let autoPlayTimer;

    function getPerPage() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    window.moveCarousel = function(dir) {
        const track = document.getElementById('reviewTrack');
        if (!track) return;
        const cards = track.children;
        const total = cards.length;
        const perPage = getPerPage();
        const maxIndex = total - perPage;
        carouselIndex = Math.max(0, Math.min(carouselIndex + dir, maxIndex));
        const cardWidth = 100 / perPage;
        track.style.transform = `translateX(-${carouselIndex * cardWidth}%)`;
        updateDots();
        resetAutoPlay();
    };

    function updateDots() {
        const dotsEl = document.getElementById('carouselDots');
        const track = document.getElementById('reviewTrack');
        if (!dotsEl || !track) return;
        const total = track.children.length;
        const perPage = getPerPage();
        const dotCount = total - perPage + 1;
        dotsEl.innerHTML = '';
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === carouselIndex ? ' active' : '');
            dot.onclick = () => { carouselIndex = i; moveCarousel(0); };
            dotsEl.appendChild(dot);
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            const track = document.getElementById('reviewTrack');
            if (!track) return;
            const total = track.children.length;
            const perPage = getPerPage();
            carouselIndex = carouselIndex >= total - perPage ? 0 : carouselIndex + 1;
            const cardWidth = 100 / perPage;
            track.style.transform = `translateX(-${carouselIndex * cardWidth}%)`;
            updateDots();
        }, 5000);
    }

    // Init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { updateDots(); resetAutoPlay(); });
    } else {
        updateDots(); resetAutoPlay();
    }
    window.addEventListener('resize', () => { carouselIndex = 0; moveCarousel(0); });
})();

// Review Popups Logic
const realReviewsData = [
    { name: "Mike Mead", stars: "★★★★★", text: "\"The service was very prompt and friendly from start to finish, the workmanship was top quality, and the pricing was fair and transparent.\"" },
    { name: "M. Yilmaz", stars: "★★★★★", text: "\"The team arrived on time and got straight to work. The carpet repairs were completed with exemplary workmanship.\"" },
    { name: "Lauren B.", stars: "★★★★★", text: "\"We had all our downstairs carpets replaced and the service was absolutely amazing! David was incredibly helpful throughout the whole process.\"" },
    { name: "Mel Abbott", stars: "★★★★★", text: "\"I had a small job of putting a couple of corners of carpet back down. David was very helpful, fitted me in... Great to deal with.\"" },
    { name: "Candice", stars: "★★★★★", text: "\"David was fantastic! He handled everything himself and did an amazing job with the carpet. Super professional, friendly.\"" },
    { name: "Jessica Broun", stars: "★★★★★", text: "\"David's communication was excellent throughout. He couldn't have been more helpful, and the workmanship is excellent.\"" },
    { name: "Angelique K.", stars: "★★★★★", text: "\"They have done an amazing job installing our carpets, so fast and efficient! Friendly and professional. They absolutely know their stuff!\"" },
    { name: "Kimberley Bell", stars: "★★★★★", text: "\"David did an awesome job of our carpet repair! Very reasonably priced, great communication, and appreciated his attention to detail.\"" },
    { name: "Chloe Kim", stars: "★★★★★", text: "\"I couldn't be happier with the result and the price. His quote was unbelievably more affordable than the usual well known carpet companies.\"" },
    { name: "David M.", stars: "★★★★★", text: "\"David and his crew were extremely helpful and the quality of their work was exceptional. Their communication was fantastic too.\"" }
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

    // Prevent duplicate reviews showing at the same time
    const activePopups = container.querySelectorAll('.review-popup:not(.removing)');
    const activeIndices = new Set();
    activePopups.forEach(p => {
        const idx = p.getAttribute('data-review-idx');
        if (idx !== null) activeIndices.add(parseInt(idx));
    });
    const available = realReviewsData.map((_, i) => i).filter(i => !activeIndices.has(i));
    if (available.length === 0) return;
    const chosenIdx = available[Math.floor(Math.random() * available.length)];
    const review = realReviewsData[chosenIdx];

    const popup = document.createElement('div');
    popup.className = 'review-popup';
    popup.setAttribute('data-review-idx', chosenIdx);
    
    popup.innerHTML = `
        <div class="review-popup-header">
            <span class="review-popup-name">${review.name}</span>
            <span class="review-popup-stars">${review.stars}</span>
        </div>
        <div class="review-popup-text">${review.text}</div>
    `;

    container.appendChild(popup);

    // To stack reviews, they need to stay on screen long enough for the next one to appear.
    // If intervals are every 6s, we keep them for (maxPopups * 6s - 0.4s) to allow maxPopups on screen.
    const displayTime = (maxPopups * 6000) - 400; 
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

// Start sequence (delay first popup slightly, then every 6s)
setTimeout(() => {
    // Show the first one immediately
    showReviewPopup();
    
    // Continue showing a new one every 6s
    setInterval(showReviewPopup, 6000);
}, 2000);

/* ═══════════════ AI CHAT WIDGET ═══════════════ */
(function() {
    document.body.insertAdjacentHTML('beforeend', `
        <!-- Floating Button -->
        <div id="chatBtn" onclick="openChat()">
            <svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/><path d="M7 9H9V11H7zM11 9H13V11H11zM15 9H17V11H15z"/></svg>
            <span class="chat-btn-badge"></span>
        </div>
        <!-- Full Page Chat UI -->
        <div id="chatView">
            <div class="chat-bg-scene">
                <div class="chat-bg-image"></div>
            </div>
            <div class="chat-wrapper">
                <div class="chat-shell">
                    <header class="chat-header">
                        <div class="header-left">
                            <div class="header-avatar">🏠</div>
                            <div class="header-info">
                                <div class="header-title">David's Carpet Cleaning</div>
                                <div class="header-status"><span class="status-dot"></span> Online now</div>
                            </div>
                        </div>
                        <button class="close-btn" onclick="closeChat()"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
                    </header>
                    <main class="chat-body" id="chatBody"></main>
                    <div class="chat-divider"></div>
                    <footer class="chat-footer">
                        <input type="text" id="chatInput" placeholder="Type a message…" onkeypress="handleEnter(event)">
                        <button id="sendBtn" onclick="handleSend()"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
                    </footer>
                </div>
            </div>
        </div>
    `);

    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            if(e.target.parentElement.classList) e.target.parentElement.classList.remove('error');
        }
    });
})();

window.webhookUrl = 'https://n8n.arfquant.com/webhook/dbcarpets';
window.isDemoMode = false;
window.chatHistory = [];
window.isFirstLoad = true;

window.getTimestamp = function() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

window.openChat = function() {
    document.getElementById('chatBtn').style.display = 'none';
    const cv = document.getElementById('chatView');
    cv.style.display = 'flex';
    setTimeout(() => cv.classList.add('active'), 10);
    if (window.isFirstLoad) { window.isFirstLoad = false; initChat(); }
}

window.openChatQuote = function() {
    document.getElementById('chatBtn').style.display = 'none';
    const cv = document.getElementById('chatView');
    cv.style.display = 'flex';
    setTimeout(() => cv.classList.add('active'), 10);
    if (window.isFirstLoad) {
        window.isFirstLoad = false;
        // Run welcome first, then auto-trigger quote after it finishes
        window._autoQuoteAfterInit = true;
        initChat();
    } else {
        handleQuickReply('get_quote');
    }
}

window.closeChat = function() {
    const cv = document.getElementById('chatView');
    cv.classList.remove('active');
    setTimeout(() => {
        cv.style.display = 'none';
        document.getElementById('chatBtn').style.display = 'flex';
    }, 350);
}

window.scrollToBottom = function() {
    const cb = document.getElementById('chatBody');
    if(cb) cb.scrollTo({ top: cb.scrollHeight, behavior: 'smooth' });
}

window.addMessage = function(role, content, nodeHTML = null) {
    if (role === 'system') return;
    const row = document.createElement('div');
    row.className = `msg-row ${role === 'assistant' ? 'bot' : 'user'}`;
    if (content) {
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = content;
        row.appendChild(bubble);
    }
    if (nodeHTML) row.appendChild(nodeHTML);
    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = getTimestamp();
    row.appendChild(time);
    document.getElementById('chatBody').appendChild(row);
    scrollToBottom();
    return row;
}

window.showSystemMsg = function(text) {
    const div = document.createElement('div');
    div.className = 'system-msg';
    div.textContent = text;
    document.getElementById('chatBody').appendChild(div);
    scrollToBottom();
}

window.typeMessage = function(row, text, callback) {
    const bubble = row.querySelector('.msg-bubble');
    bubble.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        bubble.textContent = text.substring(0, i + 1);
        i++;
        scrollToBottom();
        if (i >= text.length) {
            clearInterval(interval);
            scrollToBottom();
            if (callback) callback();
        }
    }, 18);
}

window.setTyping = function(vis) {
    let existing = document.getElementById('typingIndicator');
    if (vis) {
        if(existing) return;
        const row = document.createElement('div');
        row.className = 'msg-row bot';
        row.id = 'typingIndicator';
        row.innerHTML = `<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
        document.getElementById('chatBody').appendChild(row);
        scrollToBottom();
    } else {
        if(existing) existing.remove();
    }
}

// ── QUICK REPLY SYSTEM (Spotfree 2.0 style) ──
const QUICK_ANSWERS = {
    what_services: "David specialises in professional carpet installation, carpet repairs, restretching, and laying new carpet & vinyl. Whether it's a single room or an entire house — David's got you covered! 🏠",
    how_long: "It depends on the job size. A single room carpet install usually takes 1–2 hours. A full house can take a full day. David will give you a more accurate timeframe after seeing your place! ⏱",
    areas: "David services all of Auckland — from the North Shore right down to South Auckland. Drop your suburb and we can confirm! 📍"
};

window.handleQuickReply = function(action) {
    removeQuickReplies();

    if (action === 'get_quote') {
        addToHistory('user', 'Get a Quote');
        addMessage('user', 'Get a Quote');
        addToHistory('system', '', 'USER_CLICKED_GET_QUOTE', {});
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            const msg = "No worries! Fill out the quick form below and we'll sort you out 😊";
            addToHistory('assistant', msg);
            const row = addMessage('assistant', msg);
            typeMessage(row, msg, () => triggerUIAction('[SHOW_QUOTE_FORM]'));
        }, 600);
        return;
    }

    if (action === 'book') {
        addToHistory('user', "📅 I'd like to book a visit");
        addMessage('user', "📅 I'd like to book a visit");
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            const msg = "Awesome! Fill in your details below and David will be in touch to lock in a time 📅";
            addToHistory('assistant', msg);
            const row = addMessage('assistant', msg);
            typeMessage(row, msg, () => showBookingForm());
        }, 600);
        return;
    }

    if (action === 'callback') {
        addToHistory('user', "📞 I'd like to talk to David");
        addMessage('user', "📞 I'd like to talk to David");
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            const msg = "You can reach David directly on 0210 813 0758 📞\n\nOr leave your number below and he'll give you a ring when he's free!";
            addToHistory('assistant', msg);
            const row = addMessage('assistant', msg);
            typeMessage(row, msg, () => showCallbackForm());
        }, 600);
        return;
    }

    // Predetermined answers — no API call needed
    const labels = {
        what_services: "What services do you offer?",
        how_long: "How long does it usually take?",
        areas: "What areas do you service?"
    };
    const text = labels[action] || action;
    addToHistory('user', text);
    addMessage('user', text);

    const answer = QUICK_ANSWERS[action];
    if (answer) {
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            addToHistory('assistant', answer);
            const row = addMessage('assistant', answer);
            typeMessage(row, answer);
        }, 800);
    } else {
        sendUserMessage(text);
    }
}

window.removeQuickReplies = function() {
    const el = document.getElementById('quickReplies');
    if (el) el.remove();
}

window.clickAction = function(btn, text, actionKey) {
    btn.parentElement.remove();
    if (actionKey === 'GET_QUOTE') {
        addToHistory('user', text);
        addMessage('user', text);
        addToHistory('system', '', 'USER_CLICKED_GET_QUOTE', {});
        triggerUIAction('[SHOW_QUOTE_FORM]');
    } else {
        sendUserMessage(text);
    }
}

window.sendUserMessage = function(text) {
    addToHistory('user', text);
    addMessage('user', text);
    document.getElementById('chatInput').value = '';
    document.getElementById('sendBtn').disabled = true;
    processToWebhook();
}

window.handleSend = function() {
    const text = document.getElementById('chatInput').value.trim();
    if (text) {
        removeQuickReplies();
        sendUserMessage(text);
    }
}

window.handleEnter = function(e) {
    if (e.key === 'Enter') handleSend();
}

window.addToHistory = function(role, content, event = null, data = null) {
    const item = { role, timestamp: new Date().toISOString() };
    if (content) item.content = content;
    if (event) item.event = event;
    if (data) item.data = data;
    chatHistory.push(item);
}

window.processToWebhook = async function() {
    setTyping(true);
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'sf_live_7x9Kp2mWqR4vNcBd'
            },
            body: JSON.stringify({ history: chatHistory })
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        let botReply = typeof data === 'object' ? (data.message || data.reply || data.output || JSON.stringify(data)) : data;
        handleBotReply(botReply);
    } catch (err) {
        console.warn("Webhook failed, falling back to Demo Mode:", err);
        isDemoMode = true;
        setTimeout(() => handleBotReply(getDemoReply(chatHistory[chatHistory.length-1]?.content)), 1500);
    }
}

window.getDemoReply = function(lastUserText) {
    const txt = (lastUserText || '').toLowerCase();
    if (txt.includes('service')) return "David offers carpet installation, repairs, restretching, and new carpet & vinyl laying. Want to get a quote?";
    if (txt.includes('area') || txt.includes('where')) return "David services the entire Auckland region, from Rodney down to Pukekohe!";
    if (txt.includes('price') || txt.includes('cost') || txt.includes('quote')) return "Happy to help! Fill in the quick form and we'll give you an estimate. [SHOW_QUOTE_FORM]";
    if (txt.includes('book') || txt.includes('appointment')) return "David would love to sort you out! Let's get your details. [SHOW_BOOKING]";
    return "I can certainly help you with that. Would you like to get a quote or book a visit? 😊";
}

window.handleBotReply = function(rawText) {
    setTyping(false);
    const codes = ['[SHOW_QUOTE_FORM]', '[SHOW_BOOKING]', '[SHOW_WAITLIST]', '[SHOW_CALLBACK]'];
    let cleanText = String(rawText);
    let foundCodes = [];
    codes.forEach(code => {
        if (cleanText.includes(code)) {
            foundCodes.push(code);
            cleanText = cleanText.replace(code, '').trim();
        }
    });

    if (cleanText) {
        addToHistory('assistant', cleanText);
        const row = addMessage('assistant', cleanText);
        typeMessage(row, cleanText, () => foundCodes.forEach(code => {
            if (code === '[SHOW_BOOKING]') showBookingForm();
            else if (code === '[SHOW_CALLBACK]') showCallbackForm();
            else triggerUIAction(code);
        }));
    } else {
        foundCodes.forEach(code => {
            if (code === '[SHOW_BOOKING]') showBookingForm();
            else if (code === '[SHOW_CALLBACK]') showCallbackForm();
            else triggerUIAction(code);
        });
    }
    document.getElementById('sendBtn').disabled = false;
}

window.triggerUIAction = function(code) {
    let container = document.createElement('div');
    if (code === '[SHOW_QUOTE_FORM]') {
        container.innerHTML = `
        <div class="inline-form" id="quoteForm">
            <h4>✏️ Get a Custom Quote</h4>
            <div class="form-group"><label>Name *</label><input type="text" id="qName"></div>
            <div class="form-group"><label>Phone *</label><input type="tel" id="qPhone"></div>
            <div class="form-group"><label>Full Address *</label><input type="text" id="qAddr" placeholder="Street, Suburb, City"></div>
            <div class="form-group"><label>Number of rooms</label><input type="number" id="qRooms" min="1" value="1"></div>
            <div class="form-group"><label>Room Sizes</label>
                <select id="qSizes"><option>All small</option><option>Mix of small and medium</option><option>Mostly large</option><option>Open plan</option></select>
            </div>
            <div class="form-group"><label>Carpet Type</label>
                <select id="qType"><option>Synthetic</option><option>Wool</option><option>Not sure</option></select>
            </div>
            <div class="form-group"><label>Condition</label>
                <select id="qCond"><option>Light soiling</option><option>Moderate</option><option>Heavy soiling</option><option>Pet odour</option><option>Flood damage</option></select>
            </div>
            <div class="form-group checkbox-group">
                <label>Add-ons</label>
                <label class="check-item"><input type="checkbox" value="Stain treatment" class="qAddon"> Stain treatment</label>
                <label class="check-item"><input type="checkbox" value="Deodorising" class="qAddon"> Deodorising</label>
                <label class="check-item"><input type="checkbox" value="Scotch guard" class="qAddon"> Scotch guard</label>
                <label class="check-item"><input type="checkbox" value="Furniture moving" class="qAddon"> Furniture moving</label>
            </div>
            <button class="form-submit" id="qSubmit" onclick="submitQuote(this)">Submit Quote Request</button>
        </div>`;
    } else if (code === '[SHOW_WAITLIST]') {
        container.innerHTML = `
        <div class="inline-form">
            <h4>📋 Join Waitlist</h4>
            <div class="form-group"><label>Name *</label><input type="text" id="wName"></div>
            <div class="form-group"><label>Phone *</label><input type="tel" id="wPhone"></div>
            <button class="form-submit" onclick="submitGeneric(this, 'JOINED_WAITLIST')">Join Now</button>
        </div>`;
    }
    addMessage('assistant', null, container);
    setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ── BOOKING FORM ──
window.showBookingForm = function() {
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="inline-form" id="bookingFormCard">
        <h4>📅 Book a Visit</h4>
        <div class="form-group"><label>Your Name *</label><input type="text" id="bfName" placeholder="First name is fine"></div>
        <div class="form-group"><label>Phone Number *</label><input type="tel" id="bfPhone" placeholder="e.g. 021 123 4567"></div>
        <div class="form-group"><label>Email (optional)</label><input type="email" id="bfEmail" placeholder="your@email.co.nz"></div>
        <div class="form-group"><label>Property Address *</label><input type="text" id="bfAddress" placeholder="e.g. 12 Queen St, Epsom"></div>
        <div class="form-group"><label>Preferred Date *</label><input type="date" id="bfDate"></div>
        <div class="form-group"><label>Preferred Time *</label>
            <select id="bfTime">
                <option value="">Select…</option>
                <option value="morning">Morning (8am – 12pm)</option>
                <option value="afternoon">Afternoon (12pm – 4pm)</option>
                <option value="late_afternoon">Late Arvo (4pm – 6pm)</option>
                <option value="flexible">I'm Flexible</option>
            </select>
        </div>
        <button class="form-submit" id="bfSubmit" onclick="submitBookingForm()">Submit Booking →</button>
    </div>`;
    addMessage('assistant', null, container);
    // Set min date to today
    const dateInput = container.querySelector('#bfDate');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
    setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
}

window.submitBookingForm = function() {
    const btn = document.getElementById('bfSubmit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    const name = document.getElementById('bfName').value.trim();
    const phone = document.getElementById('bfPhone').value.trim();
    const email = document.getElementById('bfEmail').value.trim();
    const address = document.getElementById('bfAddress').value.trim();
    const date = document.getElementById('bfDate').value;
    const time = document.getElementById('bfTime').value;

    let hasError = false;
    if (!name) { document.getElementById('bfName').parentElement.classList.add('error'); hasError = true; }
    if (!phone) { document.getElementById('bfPhone').parentElement.classList.add('error'); hasError = true; }
    if (!address) { document.getElementById('bfAddress').parentElement.classList.add('error'); hasError = true; }
    if (!date) { document.getElementById('bfDate').parentElement.classList.add('error'); hasError = true; }
    if (!time) { document.getElementById('bfTime').parentElement.classList.add('error'); hasError = true; }

    if (hasError) {
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Booking →'; }
        return;
    }

    const formCard = document.getElementById('bookingFormCard');
    if (formCard) formCard.closest('.msg-row').remove();

    const timeLabels = { morning: 'Morning', afternoon: 'Afternoon', late_afternoon: 'Late Arvo', flexible: 'Flexible' };
    const summary = `Booking request:\n• Name: ${name}\n• Phone: ${phone}${email ? '\n• Email: ' + email : ''}\n• Address: ${address}\n• Date: ${date}\n• Time: ${timeLabels[time]}`;
    addToHistory('user', summary);
    addMessage('user', summary);

    const formData = { name, phone, email, address, date, time, type: 'booking' };
    addToHistory('system', '', 'BOOKING_SUBMITTED', formData);

    // POST to chatbot log
    const timeLabelsLong = { morning: 'Morning (8am–12pm)', afternoon: 'Afternoon (12pm–4pm)', late_afternoon: 'Late Arvo (4pm–6pm)', flexible: 'Flexible' };
    const bookNote = `Name: ${name}\nPhone: ${phone}${email ? '\nEmail: ' + email : ''}\nAddress: ${address}\nPreferred Date: ${date}\nPreferred Time: ${timeLabelsLong[time] || time}`;
    fetch('https://n8n.arfquant.com/webhook/chatbotlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'Book a Visit', note: bookNote })
    }).catch(() => {});

    // Confirmation card
    showConfirmation('✅', 'Booking Request Sent!', 'David will be in touch within 24 hours to confirm your appointment.');
    processToWebhook();
}

// ── CALLBACK FORM ──
window.showCallbackForm = function() {
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="inline-form" id="callbackFormCard">
        <h4>📞 Request a Callback</h4>
        <div class="form-group"><label>Your Name *</label><input type="text" id="cfName" placeholder="First name is fine"></div>
        <div class="form-group"><label>Phone Number *</label><input type="tel" id="cfPhone" placeholder="e.g. 021 123 4567"></div>
        <div class="form-group"><label>Email (optional)</label><input type="email" id="cfEmail" placeholder="your@email.co.nz"></div>
        <div class="form-group"><label>Best time to call</label><input type="text" id="cfExtra" placeholder="e.g. After 5pm, anytime"></div>
        <button class="form-submit" id="cfSubmit" onclick="submitCallbackForm()">Submit →</button>
    </div>`;
    addMessage('assistant', null, container);
    setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
}

window.submitCallbackForm = function() {
    const btn = document.getElementById('cfSubmit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    const name = document.getElementById('cfName').value.trim();
    const phone = document.getElementById('cfPhone').value.trim();
    const email = document.getElementById('cfEmail').value.trim();
    const extra = document.getElementById('cfExtra').value.trim();

    let hasError = false;
    if (!name) { document.getElementById('cfName').parentElement.classList.add('error'); hasError = true; }
    if (!phone) { document.getElementById('cfPhone').parentElement.classList.add('error'); hasError = true; }

    if (hasError) {
        if (btn) { btn.disabled = false; btn.textContent = 'Submit →'; }
        return;
    }

    const formCard = document.getElementById('callbackFormCard');
    if (formCard) formCard.closest('.msg-row').remove();

    const summary = `Callback request:\n• Name: ${name}\n• Phone: ${phone}${email ? '\n• Email: ' + email : ''}${extra ? '\n• Best time: ' + extra : ''}`;
    addToHistory('user', summary);
    addMessage('user', summary);

    const formData = { name, phone, email, extra, type: 'callback' };
    addToHistory('system', '', 'CALLBACK_SUBMITTED', formData);

    // POST to chatbot log
    const cbNote = `Name: ${name}\nPhone: ${phone}${email ? '\nEmail: ' + email : ''}${extra ? '\nBest time to call: ' + extra : ''}`;
    fetch('https://n8n.arfquant.com/webhook/chatbotlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'Talk to David', note: cbNote })
    }).catch(() => {});

    showConfirmation('📞', 'Callback Requested!', "David will give you a ring when he's free — usually within a few hours.");
    processToWebhook();
}

// ── CONFIRMATION CARD ──
window.showConfirmation = function(icon, title, text) {
    const card = document.createElement('div');
    card.className = 'inline-form';
    card.style.textAlign = 'center';
    card.style.background = 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)';
    card.style.border = '1.5px solid #6EE7B7';
    card.innerHTML = `
        <div style="font-size:28px;margin-bottom:6px;">${icon}</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:0.95rem;color:#065F46;margin-bottom:4px;">${title}</div>
        <div style="font-size:0.82rem;color:#047857;line-height:1.5;">${text}</div>
    `;
    addMessage('assistant', null, card);
}

window.submitQuote = function(btn) {
    const form = btn.parentElement;
    const fields = [{ id: 'qName' }, { id: 'qPhone' }, { id: 'qAddr' }];
    let valid = true;
    fields.forEach(f => {
        const el = form.querySelector('#' + f.id);
        if (!el.value.trim()) { el.parentElement.classList.add('error'); valid = false; }
        else { el.parentElement.classList.remove('error'); }
    });
    if (!valid) return;
    btn.disabled = true; btn.textContent = "Calculating...";
    const addons = Array.from(form.querySelectorAll('.qAddon:checked')).map(cb => cb.value);
    const rooms = parseInt(form.querySelector('#qRooms').value) || 1;
    const sizes = form.querySelector('#qSizes').value;
    const carpetType = form.querySelector('#qType').value;
    const condition = form.querySelector('#qCond').value;

    // ── Approximate pricing logic (NZ carpet installation rates) ──
    const sizeMultiplier = { 'All small': 200, 'Mix of small and medium': 275, 'Mostly large': 350, 'Open plan': 450 };
    const basePerRoom = sizeMultiplier[sizes] || 275;
    let conditionMultiplier = 1;
    if (condition === 'Moderate') conditionMultiplier = 1.1;
    else if (condition === 'Heavy soiling') conditionMultiplier = 1.2;
    else if (condition === 'Pet odour') conditionMultiplier = 1.25;
    else if (condition === 'Flood damage') conditionMultiplier = 1.4;
    if (carpetType === 'Wool') conditionMultiplier *= 1.15;
    const addonPrices = { 'Stain treatment': 50, 'Deodorising': 40, 'Scotch guard': 60, 'Furniture moving': 30 };
    let addonTotal = 0;
    addons.forEach(a => { addonTotal += (addonPrices[a] || 0); });
    const baseCost = Math.round(rooms * basePerRoom * conditionMultiplier + addonTotal);
    const lowEst = Math.round(baseCost * 0.9);
    const highEst = Math.round(baseCost * 1.15);

    const payloadData = {
        name: form.querySelector('#qName').value.trim(),
        phone: form.querySelector('#qPhone').value.trim(),
        address: form.querySelector('#qAddr').value.trim(),
        rooms: rooms,
        sizes: sizes,
        carpetType: carpetType,
        condition: condition,
        addons: addons,
        estimatedPriceLow: lowEst,
        estimatedPriceHigh: highEst
    };

    // POST to chatbotlog
    fetch('https://n8n.arfquant.com/webhook-test/chatbotlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'Get a Quote', ...payloadData })
    }).catch(() => {});

    addToHistory('system', '', 'QUOTE_FORM_SUBMITTED', payloadData);
    const summaryStr = `I submitted my details for a quote: ${rooms} room(s) at ${payloadData.address}.`;
    addToHistory('user', summaryStr);
    addMessage('user', summaryStr);
    btn.textContent = "Submitted!";

    // Show pricing estimate
    setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            const priceMsg = `Based on your details, here's an approximate estimate:\n\n💰 $${lowEst} – $${highEst} NZD\n\n📋 ${rooms} room(s) · ${sizes}\n🧶 ${carpetType} carpet · ${condition}${addons.length ? '\n✅ ' + addons.join(', ') : ''}\n\nThis is a rough guide — David will follow up with an exact quote after inspecting your space! 📞`;
            const row = addMessage('assistant', priceMsg);
            typeMessage(row, priceMsg);
            addToHistory('assistant', priceMsg);
            scrollToBottom();
        }, 1200);
    }, 400);
};

window.submitGeneric = function(btn, eventName) {
    const form = btn.parentElement;
    let valid = true;
    const data = {};
    form.querySelectorAll('input').forEach(el => {
        const val = el.value.trim();
        if ((el.id.includes('Name') || el.id.includes('Phone') || el.id.includes('Addr')) && !val) {
            el.parentElement.classList.add('error');
            valid = false;
        } else {
            el.parentElement.classList.remove('error');
            data[el.id] = val;
        }
    });
    if (!valid) return;
    btn.disabled = true; btn.textContent = "Submitted!";
    addToHistory('system', '', eventName, data);
    showSystemMsg('Form submitted securely.');
    const summaryStr = `I just sent through the ${eventName.replace('_', ' ').toLowerCase()} form.`;
    addToHistory('user', summaryStr);
    addMessage('user', summaryStr);
    processToWebhook();
};

window.initChat = function() {
    setTyping(true);
    const initMsg = "Hey! Welcome to David's Carpet Cleaning 👋 How can I help you today?";
    addToHistory('assistant', initMsg);
    setTimeout(() => {
        setTyping(false);
        const row = addMessage('assistant', initMsg);
        typeMessage(row, initMsg, () => {
            if (window._autoQuoteAfterInit) {
                window._autoQuoteAfterInit = false;
                handleQuickReply('get_quote');
            } else {
                const qrBox = document.createElement('div');
                qrBox.className = 'quick-replies';
                qrBox.id = 'quickReplies';
                qrBox.innerHTML = `
                    <button class="qr-btn primary" onclick="handleQuickReply('get_quote')">Get a Quote</button>
                    <button class="qr-btn primary" onclick="handleQuickReply('book')">📅 Book a Visit</button>
                    <button class="qr-btn primary" onclick="handleQuickReply('callback')">📞 Talk to David</button>
                    <button class="qr-btn" onclick="handleQuickReply('what_services')">🏠 What services?</button>
                    <button class="qr-btn" onclick="handleQuickReply('how_long')">⏱ How long?</button>
                    <button class="qr-btn" onclick="handleQuickReply('areas')">📍 What areas?</button>
                `;
                document.getElementById('chatBody').appendChild(qrBox);
                scrollToBottom();
            }
        });
    }, 800);
}

/* ═══════════════ CARPET ROLLER CANVAS EFFECT ═══════════════ */
(function() {
    // Skip on touch/mobile devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'carpet-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    let segments = [];   // carpet trail segments
    let shimmers = [];   // sparkle particles
    let mouseX = -200, mouseY = -200;
    let lastX = null, lastY = null;
    let angle = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Colors
    const CARPET_DARK = '#6b1520';
    const CARPET_MID  = '#8b2030';
    const CARPET_LIGHT = '#a83040';
    const CARPET_GOLD = '#c49a6c';

    // Diamond pattern offcanvas buffer
    const patW = 24, patH = 24;
    const patCanvas = document.createElement('canvas');
    patCanvas.width = patW; patCanvas.height = patH;
    const patCtx = patCanvas.getContext('2d');
    // Fill base
    patCtx.fillStyle = CARPET_MID;
    patCtx.fillRect(0, 0, patW, patH);
    // Diamond shapes
    patCtx.fillStyle = CARPET_DARK;
    patCtx.beginPath();
    patCtx.moveTo(patW/2, 2); patCtx.lineTo(patW-2, patH/2);
    patCtx.lineTo(patW/2, patH-2); patCtx.lineTo(2, patH/2);
    patCtx.closePath(); patCtx.fill();
    // Inner diamond
    patCtx.fillStyle = CARPET_LIGHT;
    patCtx.beginPath();
    patCtx.moveTo(patW/2, 6); patCtx.lineTo(patW-6, patH/2);
    patCtx.lineTo(patW/2, patH-6); patCtx.lineTo(6, patH/2);
    patCtx.closePath(); patCtx.fill();
    // Center dot
    patCtx.fillStyle = CARPET_GOLD;
    patCtx.beginPath();
    patCtx.arc(patW/2, patH/2, 2, 0, Math.PI * 2);
    patCtx.fill();
    // Corner accents
    patCtx.fillStyle = CARPET_GOLD;
    [0, patW].forEach(x => [0, patH].forEach(y => {
        patCtx.beginPath(); patCtx.arc(x, y, 1.5, 0, Math.PI*2); patCtx.fill();
    }));
    const carpetPattern = ctx.createPattern(patCanvas, 'repeat');

    // Trail segment class
    class CarpetSegment {
        constructor(x, y, ang, w) {
            this.x = x; this.y = y;
            this.angle = ang;
            this.w = w; this.h = 30;
            this.life = 1.0;
            this.decay = 0.012; // ~1.5s
            this.born = performance.now();
        }
        update() { this.life -= this.decay; }
        draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.life * 0.7;
            ctx.fillStyle = carpetPattern;
            const r = 4;
            const hw = this.w / 2, hh = this.h / 2;
            ctx.beginPath();
            ctx.moveTo(-hw + r, -hh);
            ctx.lineTo(hw - r, -hh);
            ctx.quadraticCurveTo(hw, -hh, hw, -hh + r);
            ctx.lineTo(hw, hh - r);
            ctx.quadraticCurveTo(hw, hh, hw - r, hh);
            ctx.lineTo(-hw + r, hh);
            ctx.quadraticCurveTo(-hw, hh, -hw, hh - r);
            ctx.lineTo(-hw, -hh + r);
            ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
            ctx.closePath();
            ctx.fill();
            // Subtle border
            ctx.strokeStyle = `rgba(107, 21, 32, ${0.3 * this.life})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }

    // Shimmer particle
    class Shimmer {
        constructor(x, y) {
            this.x = x + (Math.random() - 0.5) * 30;
            this.y = y + (Math.random() - 0.5) * 30;
            this.size = Math.random() * 2.5 + 1;
            this.life = 1.0;
            this.decay = Math.random() * 0.03 + 0.02;
            this.brightness = Math.random() * 0.5 + 0.5;
        }
        update() { this.life -= this.decay; }
        draw(ctx) {
            if (this.life <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 67, ${this.brightness * this.life * 0.6})`;
            ctx.fill();
        }
    }

    // Draw roller icon
    function drawRoller(ctx, x, y, ang) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);

        // Handle
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.lineTo(0, 30);
        ctx.stroke();
        // Handle grip
        ctx.strokeStyle = '#5a4e45';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 26);
        ctx.lineTo(0, 34);
        ctx.stroke();

        // Roller cylinder
        const rw = 22, rh = 12;
        ctx.fillStyle = '#a83040';
        ctx.beginPath();
        ctx.ellipse(0, 0, rw/2, rh/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#6b1520';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Roller highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, -2, rw/2 - 3, rh/2 - 3, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        // Roller texture lines
        ctx.strokeStyle = 'rgba(107, 21, 32, 0.4)';
        ctx.lineWidth = 0.5;
        for (let i = -8; i <= 8; i += 4) {
            ctx.beginPath();
            ctx.moveTo(i, -rh/2 + 1);
            ctx.lineTo(i, rh/2 - 1);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (lastX !== null && lastY !== null) {
            const dx = mouseX - lastX;
            const dy = mouseY - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 6) {
                angle = Math.atan2(dy, dx) + Math.PI / 2;

                // Stamp carpet segments along the path
                const steps = Math.max(1, Math.floor(dist / 10));
                for (let i = 0; i < steps; i++) {
                    const t = i / steps;
                    const sx = lastX + dx * t;
                    const sy = lastY + dy * t;
                    segments.push(new CarpetSegment(sx, sy, angle, 28 + Math.random() * 4));
                    // Shimmer particles
                    if (Math.random() < 0.4) {
                        shimmers.push(new Shimmer(sx, sy));
                    }
                }
            }
        }
        lastX = mouseX;
        lastY = mouseY;
    });

    window.addEventListener('mouseleave', () => {
        lastX = null; lastY = null;
        mouseX = -200; mouseY = -200;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, W, H);

        // Draw and update carpet trail
        for (let i = segments.length - 1; i >= 0; i--) {
            segments[i].update();
            segments[i].draw(ctx);
            if (segments[i].life <= 0) segments.splice(i, 1);
        }

        // Draw and update shimmers
        for (let i = shimmers.length - 1; i >= 0; i--) {
            shimmers[i].update();
            shimmers[i].draw(ctx);
            if (shimmers[i].life <= 0) shimmers.splice(i, 1);
        }

        // Draw roller at cursor
        if (mouseX > 0 && mouseY > 0) {
            drawRoller(ctx, mouseX, mouseY, angle);
        }

        // Cap arrays to prevent memory issues
        if (segments.length > 500) segments.splice(0, segments.length - 500);
        if (shimmers.length > 200) shimmers.splice(0, shimmers.length - 200);

        requestAnimationFrame(animate);
    }
    animate();
})();

