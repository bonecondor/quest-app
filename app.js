// Main Application Logic

const mockContacts = [
    'ALEX', 'SAM', 'JORDAN', 'CASEY', 'RILEY', 'MORGAN',
    'TAYLOR', 'DREW', 'BLAIR', 'AVERY', 'QUINN', 'SAGE'
];

let currentQuest = null;
let selectedContacts = [];
let contactAssignments = {};
let countdownInterval = null;
let revealTimeouts = [];

// Wait for page and scripts to load
window.addEventListener('DOMContentLoaded', function() {
    // Check if questTypes is available, if not wait a bit
    if (typeof window.questTypes !== 'undefined') {
        populateQuestTypes();
    } else {
        setTimeout(() => {
            if (typeof window.questTypes !== 'undefined') {
                populateQuestTypes();
            }
        }, 100);
    }
});

function populateQuestTypes() {
    const container = document.getElementById('quest-types-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const [key, quest] of Object.entries(window.questTypes)) {
        const fragment = document.createElement('div');
        fragment.className = 'fragment';
        fragment.onclick = () => selectQuest(key);
        fragment.innerHTML = `
            <div class="fragment-icon">${quest.icon}</div>
            <div class="fragment-text">${quest.name}</div>
        `;
        container.appendChild(fragment);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'receive-quest') {
        startCountdown();
        startReveal();
    }
}

function selectQuest(type) {
    document.querySelectorAll('.fragment').forEach(f => f.classList.remove('selected'));
    event.target.closest('.fragment').classList.add('selected');
    
    currentQuest = type;
    
    if (type === 'tacos') {
        document.getElementById('quest-time').value = 'MIDNIGHT';
        document.getElementById('quest-place').value = 'THE CORNER OF DESIRES';
    }
}

function showContactSelection() {
    if (!currentQuest) {
        alert('Choose a quest type first!');
        return;
    }
    
    selectedContacts = [];
    contactAssignments = {};
    
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    const fragments = window.questTypes[currentQuest].fragments;
    
    mockContacts.slice(0, 6).forEach((contact, index) => {
        const contactEl = document.createElement('div');
        contactEl.className = 'contact-item';
        contactEl.onclick = () => toggleContact(contact, index);
        contactEl.innerHTML = `
            <span class="contact-name">${contact}</span>
            <span class="contact-fragment" id="fragment-${contact}"></span>
        `;
        contactsList.appendChild(contactEl);
    });
    
    updateAssignmentsList();
    showScreen('contact-selection');
}

function toggleContact(contact, index) {
    const contactEl = event.currentTarget;
    const fragments = window.questTypes[currentQuest].fragments;
    
    if (selectedContacts.includes(contact)) {
        selectedContacts = selectedContacts.filter(c => c !== contact);
        delete contactAssignments[contact];
        contactEl.classList.remove('selected');
        document.getElementById(`fragment-${contact}`).textContent = '';
    } else if (selectedContacts.length < fragments.length) {
        selectedContacts.push(contact);
        const fragmentIndex = selectedContacts.length - 1;
        contactAssignments[contact] = fragments[fragmentIndex];
        contactEl.classList.add('selected');
        document.getElementById(`fragment-${contact}`).textContent = fragments[fragmentIndex].cryptic;
    }
    
    updateAssignmentsList();
}

function updateAssignmentsList() {
    const list = document.getElementById('assignment-list');
    const fragments = window.questTypes[currentQuest].fragments;
    
    list.innerHTML = '';
    
    selectedContacts.forEach(contact => {
        const assignment = contactAssignments[contact];
        const item = document.createElement('div');
        item.className = 'assignment-item';
        item.innerHTML = `
            <span>${contact}</span>
            <span style="color: #9b59b6;">"${assignment.cryptic}"</span>
        `;
        list.appendChild(item);
    });
}

function sendSummons() {
    if (selectedContacts.length === 0) {
        alert('Select at least one seeker!');
        return;
    }
    
    const finalAssignments = document.getElementById('final-assignments');
    finalAssignments.innerHTML = '';
    
    selectedContacts.forEach(contact => {
        const assignment = contactAssignments[contact];
        finalAssignments.innerHTML += `
            <div style="margin: 15px 0;">${contact} → "${assignment.cryptic}"</div>
        `;
    });
    
    const time = document.getElementById('quest-time').value || 'WHEN THE STARS ALIGN';
    const place = document.getElementById('quest-place').value || 'WHERE PATHS CONVERGE';
    document.getElementById('final-time').textContent = `CONVERGENCE AT ${time}`;
    document.getElementById('final-place').textContent = place;
    
    showScreen('summons-sent');
}

function acceptQuest() {
    showScreen('quest-accepted');
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    let hours = 2, minutes = 47, seconds = 33;
    const countdownEl = document.getElementById('countdown');
    
    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
            }
        }
        
        countdownEl.textContent = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }, 1000);
}

function startReveal() {
    // Basic reveal functionality
    const msg = document.getElementById('cryptic-msg');
    const location = document.getElementById('location-hint');
    
    setTimeout(() => {
        msg.textContent = 'BRING HOT SAUCE';
    }, 3000);
}
window.showScreen = showScreen;
window.selectQuest = selectQuest;
window.showContactSelection = showContactSelection;
window.sendSummons = sendSummons;
window.acceptQuest = acceptQuest;
