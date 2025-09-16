// Main Application Logic

// Mock contacts
const mockContacts = [
    'ALEX', 'SAM', 'JORDAN', 'CASEY', 'RILEY', 'MORGAN',
    'TAYLOR', 'DREW', 'BLAIR', 'AVERY', 'QUINN', 'SAGE'
];

// App State
let currentQuest = null;
let selectedContacts = [];
let contactAssignments = {};
let countdownInterval = null;
let revealTimeouts = [];

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for quests.js to load, then populate
    setTimeout(populateQuestTypes, 100);
});

// Populate quest types - check for questTypes availability
function populateQuestTypes() {
    const container = document.getElementById('quest-types-container');
    if (!container) return;
    
    // Check if questTypes is available (from quests.js)
    if (typeof window.questTypes === 'undefined') {
        console.error('questTypes not available');
        return;
    }
    
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

// Rest of the functions exactly as they were...
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    if (screenId === 'receive-quest') {
        startCountdown();
        startReveal();
    }
}

function selectQuest(type) {
    document.querySelectorAll('.fragment').forEach(f => f.classList.remove('selected'));
    
    if (event && event.target) {
        event.target.closest('.fragment').classList.add('selected');
    }
    
    currentQuest = type;
    
    if (type === 'tacos') {
        document.getElementById('quest-time').value = 'MIDNIGHT';
        document.getElementById('quest-place').value = 'THE CORNER OF DESIRES';
    } else {
        document.getElementById('quest-time').value = '';
        document.getElementById('quest-place').value = '';
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
    if (!contactsList) return;
    
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
        const fragmentEl = document.getElementById(`fragment-${contact}`);
        if (fragmentEl) fragmentEl.textContent = '';
    } else if (selectedContacts.length < fragments.length) {
        selectedContacts.push(contact);
        const fragmentIndex = selectedContacts.length - 1;
        contactAssignments[contact] = fragments[fragmentIndex];
        contactEl.classList.add('selected');
        const fragmentEl = document.getElementById(`fragment-${contact}`);
        if (fragmentEl) fragmentEl.textContent = fragments[fragmentIndex].cryptic;
    }
    
    updateAssignmentsList();
}

function updateAssignmentsList() {
    const list = document.getElementById('assignment-list');
    if (!list || !currentQuest) return;
    
    const fragments = window.questTypes[currentQuest].fragments;
    
    list.innerHTML = '';
    
    selectedContacts.forEach(contact => {
        const assignment = contactAssignments[contact];
        if (assignment) {
            const item = document.createElement('div');
            item.className = 'assignment-item';
            item.innerHTML = `
                <span>${contact}</span>
                <span style="color: #9b59b6;">"${assignment.cryptic}"</span>
            `;
            list.appendChild(item);
        }
    });
    
    const unassignedCount = fragments.length - selectedContacts.length;
    if (unassignedCount > 0) {
        const unassignedEl = document.createElement('div');
        unassignedEl.style.marginTop = '10px';
        unassignedEl.style.color = '#666';
        unassignedEl.style.fontSize = '12px';
        unassignedEl.textContent = `${unassignedCount} fragments still need seekers...`;
        list.appendChild(unassignedEl);
    }
}

function sendSummons() {
    if (selectedContacts.length === 0) {
        alert('Select at least one seeker!');
        return;
    }
    
    const finalAssignments = document.getElementById('final-assignments');
    if (finalAssignments) {
        finalAssignments.innerHTML = '';
        
        selectedContacts.forEach(contact => {
            const assignment = contactAssignments[contact];
            if (assignment) {
                finalAssignments.innerHTML += `
                    <div style="margin: 15px 0;">${contact} → "${assignment.cryptic}"</div>
                `;
            }
        });
    }
    
    const time = document.getElementById('quest-time').value || 'WHEN THE STARS ALIGN';
    const place = document.getElementById('quest-place').value || 'WHERE PATHS CONVERGE';
    
    const finalTime = document.getElementById('final-time');
    const finalPlace = document.getElementById('final-place');
    
    if (finalTime) finalTime.textContent = `CONVERGENCE AT ${time}`;
    if (finalPlace) finalPlace.textContent = place;
    
    showScreen('summons-sent');
}

function acceptQuest() {
    let quest;
    let fragment;
    
    if (currentQuest && window.questTypes[currentQuest]) {
        quest = window.questTypes[currentQuest];
        fragment = quest.fragments[Math.floor(Math.random() * quest.fragments.length)];
    } else {
        quest = window.questTypes.tacos;
        fragment = quest.fragments[0];
    }
    
    const time = document.getElementById('quest-time').value || 'THE APPOINTED HOUR';
    const place = document.getElementById('quest-place').value || 'THE CHOSEN PLACE';
    
    const revealDetails = document.getElementById('reveal-details');
    if (revealDetails) {
        revealDetails.innerHTML = `
            ${quest.location}<br>
            ${place}<br>
            ${time}
        `;
    }
    
    const revealTask = document.getElementById('reveal-task');
    if (revealTask) {
        revealTask.innerHTML = `
            YOUR OFFERING: ${fragment.real.toUpperCase()}<br>
            ("${fragment.cryptic}")
        `;
    }
    
    showScreen('quest-accepted');
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    let hours = 2, minutes = 47, seconds = 33;
    const countdownEl = document.getElementById('countdown');
    
    if (!countdownEl) return;
    
    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    clearInterval(countdownInterval);
                    return;
                }
            }
        }
        
        countdownEl.textContent = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }, 1000);
}

function startReveal() {
    revealTimeouts.forEach(timeout => clearTimeout(timeout));
    revealTimeouts = [];
    
    const msg = document.getElementById('cryptic-msg');
    const location = document.getElementById('location-hint');
    
    if (!msg || !location) return;
    
    let quest;
    let yourFragment;
    
    if (currentQuest && window.questTypes[currentQuest]) {
        quest = window.questTypes[currentQuest];
        yourFragment = quest.fragments[Math.floor(Math.random() * quest.fragments.length)];
    } else {
        quest = window.questTypes.tacos;
        yourFragment = quest.fragments[0];
    }
    
    const otherFragments = quest.fragments.filter(f => f !== yourFragment);
    const fragment1 = otherFragments[0] || quest.fragments[0];
    const fragment2 = otherFragments[1] || quest.fragments[1];
    
    msg.className = 'cryptic-message';
    msg.textContent = yourFragment.cryptic;
    location.innerHTML = '<span style="color: #666;">LOCATION REVEALS IN TIME...</span>';
    
    const participantsList = document.getElementById('participants-list');
    if (participantsList) {
        participantsList.innerHTML = `
            <div class="participant">
                <span>SEEKER ALPHA</span>
                <span class="participant-role">${fragment1.cryptic}</span>
            </div>
            <div class="participant">
                <span>SEEKER BETA</span>
                <span class="participant-role">${fragment2.cryptic}</span>
            </div>
            <div class="participant">
                <span>YOU</span>
                <span class="participant-role">${yourFragment.cryptic}</span>
            </div>
        `;
    }
    
    revealTimeouts.push(setTimeout(() => {
        msg.classList.add('revealing');
        const midReveal = yourFragment.cryptic.replace('BRING THE', 'ACQUIRE THE');
        msg.textContent = midReveal;
    }, 3000));
    
    revealTimeouts.push(setTimeout(() => {
        msg.classList.add('revealed');
        msg.textContent = `BRING: ${yourFragment.real.toUpperCase()}`;
    }, 6000));
    
    revealTimeouts.push(setTimeout(() => {
        location.innerHTML = `<span style="color: #9b59b6;">SOMEWHERE NEAR...</span>`;
    }, 8000));
    
    revealTimeouts.push(setTi
