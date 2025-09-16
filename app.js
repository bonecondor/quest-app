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
    populateQuestTypes();
});

// Populate quest types from quests.js
function populateQuestTypes() {
    const container = document.getElementById('quest-types-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const [key, quest] of Object.entries(questTypes)) {
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

// Screen Navigation
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

// Quest Selection
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

// Contact Selection
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
    
    const fragments = questTypes[currentQuest].fragments;
    
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

// Toggle Contact Selection
function toggleContact(contact, index) {
    const contactEl = event.currentTarget;
    const fragments = questTypes[currentQuest].fragments;
    
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

// Update Assignments Display
function updateAssignmentsList() {
    const list = document.getElementById('assignment-list');
    if (!list || !currentQuest) return;
    
    const fragments = questTypes[currentQuest].fragments;
    
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

// Send Summons
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

// Accept Quest
function acceptQuest() {
    let quest;
    let fragment;
    
    if (currentQuest && questTypes[currentQuest]) {
        quest = questTypes[currentQuest];
        fragment = quest.fragments[Math.floor(Math.random() * quest.fragments.length)];
    } else {
        quest = questTypes.tacos;
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

// Countdown Timer
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
