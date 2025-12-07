const PUZZLES = [
    {
        groups: [
            { category: "FISH", words: ["BASS", "FLOUNDER", "SALMON", "TROUT"], color: "yellow" },
            { category: "PALINDROMES", words: ["KAYAK", "LEVEL", "RADAR", "ROTOR"], color: "green" },
            { category: "___BOW", words: ["CROSS", "EYE", "LONG", "RAIN"], color: "blue" },
            { category: "STARTS WITH BODY PARTS", words: ["HANDSOME", "LEGEND", "LIPSTICK", "NOSTALGIA"], color: "purple" }
        ]
    },
    {
        groups: [
            { category: "PROGRAMMING LANGUAGES", words: ["JAVA", "PYTHON", "RUBY", "SWIFT"], color: "yellow" },
            { category: "COFFEE DRINKS", words: ["LATTE", "MOCHA", "ESPRESSO", "CAPPUCCINO"], color: "green" },
            { category: "UNITS OF TIME", words: ["SECOND", "MINUTE", "HOUR", "DAY"], color: "blue" },
            { category: "WORDS BEFORE 'BOARD'", words: ["SURF", "KEY", "CLIP", "CARD"], color: "purple" }
        ]
    }
];

let currentPuzzle;
let remainingWords = [];
let selectedWords = [];
let solvedGroups = [];
let mistakes = 0;
const MAX_MISTAKES = 4;

function initGame() {
    currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    remainingWords = [];
    currentPuzzle.groups.forEach(group => {
        remainingWords.push(...group.words);
    });
    shuffleArray(remainingWords);
    
    selectedWords = [];
    solvedGroups = [];
    mistakes = 0;
    
    document.getElementById('solved-groups').innerHTML = '';
    document.getElementById('message').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('grid').style.display = 'grid';
    document.getElementById('mistakes').style.display = 'block';
    
    updateMistakes();
    renderGrid();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    remainingWords.forEach(word => {
        const card = document.createElement('button');
        card.className = 'word-card';
        card.textContent = word;
        card.onclick = () => toggleWord(word);
        
        if (selectedWords.includes(word)) {
            card.classList.add('selected');
        }
        
        grid.appendChild(card);
    });
    
    updateSubmitButton();
}

function toggleWord(word) {
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
    } else if (selectedWords.length < 4) {
        selectedWords.push(word);
    }
    renderGrid();
}

function deselectAll() {
    selectedWords = [];
    renderGrid();
}

function shuffleWords() {
    shuffleArray(remainingWords);
    renderGrid();
}

function updateSubmitButton() {
    const btn = document.getElementById('submit-btn');
    btn.disabled = selectedWords.length !== 4;
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
    
    setTimeout(() => {
        msg.style.display = 'none';
    }, 2000);
}

function updateMistakes() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index < mistakes) {
            dot.classList.add('used');
        } else {
            dot.classList.remove('used');
        }
    });
}

function submitGuess() {
    if (selectedWords.length !== 4) return;
    
    // Check if guess is correct
    let foundGroup = null;
    let matchCount = 0;
    
    for (const group of currentPuzzle.groups) {
        const matches = selectedWords.filter(w => group.words.includes(w)).length;
        if (matches === 4) {
            foundGroup = group;
            break;
        }
        matchCount = Math.max(matchCount, matches);
    }
    
    if (foundGroup) {
        // Correct guess
        showMessage('Correct!', 'success');
        solvedGroups.push(foundGroup);
        remainingWords = remainingWords.filter(w => !selectedWords.includes(w));
        selectedWords = [];
        
        displaySolvedGroup(foundGroup);
        
        if (solvedGroups.length === 4) {
            endGame(true);
        } else {
            renderGrid();
        }
    } else {
        // Incorrect guess
        if (matchCount === 3) {
            showMessage('One away...', 'one-away');
        } else {
            showMessage('Incorrect!', 'error');
        }
        
        mistakes++;
        updateMistakes();
        
        if (mistakes >= MAX_MISTAKES) {
            endGame(false);
        }
        
        selectedWords = [];
        renderGrid();
    }
}

function displaySolvedGroup(group) {
    const container = document.getElementById('solved-groups');
    const div = document.createElement('div');
    div.className = `solved-group ${group.color}`;
    div.innerHTML = `
        <div class="group-title">${group.category}</div>
        <div class="group-words">${group.words.join(', ')}</div>
    `;
    container.appendChild(div);
}

function endGame(won) {
    document.getElementById('grid').style.display = 'none';
    document.getElementById('mistakes').style.display = 'none';
    
    const gameOverDiv = document.getElementById('game-over');
    const messageDiv = document.getElementById('game-over-message');
    
    if (won) {
        messageDiv.textContent = '🎉 Congratulations! You found all the connections!';
    } else {
        messageDiv.textContent = 'Better luck next time!';
        
        // Show remaining unsolved groups
        currentPuzzle.groups.forEach(group => {
            if (!solvedGroups.includes(group)) {
                displaySolvedGroup(group);
            }
        });
    }
    
    gameOverDiv.style.display = 'block';
}

// Initialize game on load
initGame();