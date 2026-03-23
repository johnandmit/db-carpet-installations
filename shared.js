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
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
        <!-- Floating Button -->
        <div id="chatBtn" onclick="openChat()">
            <svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/><path d="M7 9H9V11H7zM11 9H13V11H11zM15 9H17V11H15z"/></svg>
        </div>
        <!-- Full Page Chat UI -->
        <div id="chatView">
            <header class="chat-header">
                <div class="header-left">
                    <div class="header-icon"><svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
                    <div><div class="header-title">David's Carpet Cleaning</div><div class="header-status"><div class="status-dot"></div> Online now</div></div>
                </div>
                <button class="close-btn" onclick="closeChat()"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
            </header>
            <main class="chat-body" id="chatBody"></main>
            <footer class="chat-footer">
                <input type="text" id="chatInput" placeholder="Type a message..." onkeypress="handleEnter(event)">
                <button id="sendBtn" onclick="handleSend()"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
            </footer>
        </div>
    `);

    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            if(e.target.parentElement.classList) e.target.parentElement.classList.remove('error');
        }
    });
});

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
    document.getElementById('chatView').style.display = 'flex';
    setTimeout(() => document.getElementById('chatView').classList.add('active'), 10);
    if (window.isFirstLoad) { window.isFirstLoad = false; initChat(); }
}

window.closeChat = function() {
    document.getElementById('chatView').classList.remove('active');
    setTimeout(() => {
        document.getElementById('chatView').style.display = 'none';
        document.getElementById('chatBtn').style.display = 'flex';
    }, 300);
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
        bubble.innerText = content;
        row.appendChild(bubble);
    }
    if (nodeHTML) row.appendChild(nodeHTML);
    const time = document.createElement('div');
    time.className = 'msg-time';
    time.innerText = getTimestamp();
    row.appendChild(time);
    document.getElementById('chatBody').appendChild(row);
    scrollToBottom();
    return row;
}

window.showSystemMsg = function(text) {
    const div = document.createElement('div');
    div.className = 'system-msg';
    div.innerText = text;
    document.getElementById('chatBody').appendChild(div);
    scrollToBottom();
}

window.typeMessage = function(row, text, callback) {
    const bubble = row.querySelector('.msg-bubble');
    bubble.innerText = '';
    let i = 0;
    const interval = setInterval(() => {
        bubble.innerText += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            scrollToBottom();
            if (callback) callback();
        }
    }, 20);
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
    if (text) sendUserMessage(text);
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
            headers: { 'Content-Type': 'application/json' },
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
    if (txt.includes('service')) return "We offer deep carpet cleaning, stain removal, upholstery cleaning, and flood restoration. Need to see our prices? [SHOW_QUOTE_FORM]";
    if (txt.includes('area') || txt.includes('where')) return "We proudly service the entire Auckland region, from Rodney down to Pukekohe!";
    return "I can certainly help you with that. Would you like to get a quote? [SHOW_QUOTE_FORM]";
}

window.handleBotReply = function(rawText) {
    setTyping(false);
    const codes = ['[SHOW_QUOTE_FORM]', '[SHOW_BOOKING]', '[SHOW_WAITLIST]'];
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
        typeMessage(row, cleanText, () => foundCodes.forEach(code => triggerUIAction(code)));
    } else {
        foundCodes.forEach(code => triggerUIAction(code));
    }
    document.getElementById('sendBtn').disabled = false;
}

window.triggerUIAction = function(code) {
    let container = document.createElement('div');
    if (code === '[SHOW_QUOTE_FORM]') {
        container.innerHTML = `
        <div class="inline-form" id="quoteForm">
            <h4>Get a Custom Quote</h4>
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
    } else if (code === '[SHOW_BOOKING]') {
        container.innerHTML = `
        <div class="inline-form">
            <h4>Book an Appointment</h4>
            <div class="form-group"><label>Name *</label><input type="text" id="bName"></div>
            <div class="form-group"><label>Phone *</label><input type="tel" id="bPhone"></div>
            <div class="form-group"><label>Address *</label><input type="text" id="bAddr"></div>
            <div class="form-group"><label>Preferred Days</label><input type="text" id="bDays" placeholder="e.g. Wednesday mornings"></div>
            <button class="form-submit" onclick="submitGeneric(this, 'BOOKING_REQUESTED')">Request Booking</button>
        </div>`;
    } else if (code === '[SHOW_WAITLIST]') {
        container.innerHTML = `
        <div class="inline-form">
            <h4>Join Waitlist</h4>
            <div class="form-group"><label>Name *</label><input type="text" id="wName"></div>
            <div class="form-group"><label>Phone *</label><input type="tel" id="wPhone"></div>
            <button class="form-submit" onclick="submitGeneric(this, 'JOINED_WAITLIST')">Join Now</button>
        </div>`;
    }
    addMessage('assistant', null, container);
    setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
    btn.disabled = true; btn.innerText = "Submitting...";
    const addons = Array.from(form.querySelectorAll('.qAddon:checked')).map(cb => cb.value);
    const payloadData = {
        name: form.querySelector('#qName').value.trim(),
        phone: form.querySelector('#qPhone').value.trim(),
        address: form.querySelector('#qAddr').value.trim(),
        rooms: parseInt(form.querySelector('#qRooms').value) || 1,
        sizes: form.querySelector('#qSizes').value,
        carpetType: form.querySelector('#qType').value,
        condition: form.querySelector('#qCond').value,
        addons: addons
    };
    const summaryStr = `I submitted my details for a quote: ${payloadData.rooms} room(s) at ${payloadData.address}.`;
    addToHistory('system', '', 'QUOTE_FORM_SUBMITTED', payloadData);
    showSystemMsg('Quote requested securely.');
    addToHistory('user', summaryStr);
    addMessage('user', summaryStr);
    processToWebhook();
    btn.innerText = "Submitted!";
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
    btn.disabled = true; btn.innerText = "Submitted!";
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
            const qrBox = document.createElement('div');
            qrBox.className = 'quick-replies';
            qrBox.innerHTML = `
                <button class="qr-btn" onclick="clickAction(this, 'Get a Quote', 'GET_QUOTE')">💰 Get a Quote</button>
                <button class="qr-btn" onclick="clickAction(this, 'What services do you offer?', 'SERVICES')">🧹 What services do you offer?</button>
                <button class="qr-btn" onclick="clickAction(this, 'What areas do you cover?', 'AREAS')">📍 What areas do you cover?</button>
            `;
            document.getElementById('chatBody').appendChild(qrBox);
            scrollToBottom();
        });
    }, 800);
}
