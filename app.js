// Main Application Logic

// Mock contacts - in a real app, these would come from the user's phone
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
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');
    
    // Special handling for specific screens
    if (screenId === 'receive-quest') {
        startCountdown();
        startReveal();
    }
}

// Quest Selection
function selectQuest(type) {
    // Clear previous selection
    document.querySelectorAll('.fragment').forEach(f => f.classList.remove('selected'));
    
    // Mark as selected
    event.target.closest('.fragment').classList.add('selected');
    
    currentQuest = type;
    
    // Pre-fill for demo (only for tacos)
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
    
    // Reset selections
    selectedContacts = [];
    contactAssignments = {};
    
    // Populate contacts list
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    const fragments = questTypes[currentQuest].fragments;
    
    // Show up to 6 contacts
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
        // Deselect
        selectedContacts = selectedContacts.filter(c => c !== contact);
        delete contactAssignments[contact];
        contactEl.classList.remove('selected');
        document.getElementById(`fragment-${contact}`).textContent = '';
    } else if (selectedContacts.length < fragments.length) {
        // Select and assign fragment
        selectedContacts.push(contact);
        const fragmentIndex = selectedContacts.length - 1;
        contactAssignments[contact] = fragments[fragmentIndex];
        contactEl.classList.add('selected');
        document.getElementById(`fragment-${contact}`).textContent = fragments[fragmentIndex].cryptic;
    }
    
    updateAssignmentsList();
}

// Update Assignments Display
function updateAssignmentsList() {
    const list = document.getElementById('assignment-list');
    const fragments = questTypes[currentQuest].fragments;
    
    list.innerHTML = '';
    
    // Show assigned fragments
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
    
    // Show unassigned count
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
    
    // Update final assignments display
    const finalAssignments = document.getElementById('final-assignments');
    finalAssignments.innerHTML = '';
    
    selectedContacts.forEach(contact => {
        const assignment = contactAssignments[contact];
        finalAssignments.innerHTML += `
            <div style="margin: 15px 0;">${contact} → "${assignment.cryptic}"</div>
        `;
    });
    
    // Update time and place
    const time = document.getElementById('quest-time').value || 'WHEN THE STARS ALIGN';
    const place = document.getElementById('quest-place').value || 'WHERE PATHS CONVERGE';
    document.getElementById('final-time').textContent = `CONVERGENCE AT ${time}`;
    document.getElementById('final-place').textContent = place;
    
    showScreen('summons-sent');
}

// Accept Quest
function acceptQuest() {
    // Update reveal details based on current quest or default
    const quest = currentQuest ? questTypes[currentQuest] : questTypes.tacos;
    const time = document.getElementById('quest-time').value || 'THE APPOINTED HOUR';
    const place = document.getElementById('quest-place').value || 'THE CHOSEN PLACE';
    
    document.getElementById('reveal-details').innerHTML = `
        ${quest.location}<br>
        ${place}<br>
        ${time}
    `;
    
    const fragment = quest.fragments[0]; // Show first fragment as example
    document.getElementById('reveal-task').innerHTML = `
        YOUR OFFERING: ${fragment.real.toUpperCase()}<br>
        ("${fragment.cryptic}")
    `;
    
    showScreen('quest-accepted');
}

// Countdown Timer
function startCountdown() {
    // Clear any existing countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
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

// Progressive Reveal
function startReveal() {
    // Clear any existing timeouts
    revealTimeouts.forEach(timeout => clearTimeout(timeout));
    revealTimeouts = [];
    
    const msg = document.getElementById('cryptic-msg');
    const location = document.getElementById('location-hint');
    
    // Reset to initial state
    msg.className = 'cryptic-message';
    msg.textContent = 'BRING THE CRIMSON ESSENCE';
    location.innerHTML = '<span style="color: #666;">LOCATION REVEALS IN TIME...</span>';
    
    // Update participants (demo data)
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = `
        <div class="participant">
            <span>SEEKER ALPHA</span>
            <span class="participant-role">BRINGS THE HEAT</span>
        </div>
        <div class="participant">
            <span>SEEKER BETA</span>
            <span class="participant-role">BRINGS THE VESSEL</span>
        </div>
        <div class="participant">
            <span>YOU</span>
            <span class="participant-role">BRINGS THE CRIMSON</span>
        </div>
    `;
    
    // Gradually reveal message
    revealTimeouts.push(setTimeout(() => {
        msg.classList.add('revealing');
        msg.textContent = 'BRING THE SAUCE OF FIRE';
    }, 3000));
    
    revealTimeouts.push(setTimeout(() => {
        msg.classList.add('revealed');
        msg.textContent = 'BRING HOT SAUCE';
    }, 6000));
    
    // Reveal location hints
    revealTimeouts.push(setTimeout(() => {
        location.innerHTML = '<span style="color: #9b59b6;">SOMEWHERE ON 3RD...</span>';
    }, 8000));
    
    revealTimeouts.push(setTimeout(() => {
        location.innerHTML = '<span style="color: #9b59b6;">THE CORNER CALLS...</span>';
    }, 11000));
}
