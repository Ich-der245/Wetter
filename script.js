let responses = [];

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('save-dialog').addEventListener('click', saveDialog);

// Verhindert Multi-Touch-Zoom
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Auto-Scroll bei Keyboard-Anzeige
window.addEventListener('resize', () => {
    document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
});

// Schlüsselwörter und Antworten laden
fetch('Schlüsselwörter.txt')
    .then(response => response.text())
    .then(data => {
        responses = parseKeywordsFile(data);
        console.log('Schlüsselwörter geladen:', responses);
    })
    .catch(error => {
        console.error('Fehler beim Laden der Schlüsselwörter:', error);
        // Fallback: Standardantworten
        responses = [
            {
                keywords: ['auto', 'wagen', 'car'],
                response: 'Dein Auto? Egal, ob Kleinwagen oder Luxuskarre – wir kaufen dein Auto! 😎 Sag mir, was für’n Schlitten du fährst, und wir legen los!'
            },
            {
                keywords: ['verkaufen', 'verkauf'],
                response: 'Verkaufen? Perfekt! Bei Wir kaufen dein Auto.de kriegst du in null Komma nichts ein faires Angebot. Was für’n Wagen willst du loswerden?'
            },
            {
                keywords: ['schnell', 'schneller'],
                response: 'Schnell wie ich auf der Rennstrecke! 🏎️ Wir kaufen dein Auto.de macht’s in Rekordzeit – Angebot einholen, fertig! Was geht?'
            },
            {
                keywords: ['hallo', 'hi', 'hey'],
                response: 'Hey, wie läuft’s? Ich bin Ralf Schumacher, und bei Wir kaufen dein Auto.de holen wir jeden Wagen ab – egal, welcher! 😜 Was hast du für mich?'
            },
            {
                keywords: ['preis', 'angebot'],
                response: 'Neugierig auf den Preis? Gib mir ein paar Infos zu deinem Auto, und Wir kaufen dein Auto.de macht dir ein Angebot, das passt! What fährst du so?'
            },
            {
                keywords: [penis, vagina ],
                response: 'nicht pervers werden!!!'
            }        
        ];
    });

function parseKeywordsFile(data) {
    const lines = data.split('\n');
    const parsedResponses = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) { // Ignoriere Leerzeilen und Kommentare
            const [keywordsPart, response] = line.split('|');
            if (keywordsPart && response) {
                const keywords = keywordsPart.split(',').map(k => k.trim().toLowerCase());
                parsedResponses.push({ keywords, response: response.trim() });
            }
        }
    });
    
    return parsedResponses;
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    appendMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    setTimeout(() => {
        const botResponse = getBotResponse(userInput);
        appendMessage(botResponse, 'bot');
    }, 1000);
}

function appendMessage(message, sender) {
    const chatBody = document.getElementById('chat-body');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(input) {
    const normalizedInput = input.toLowerCase();
    for (const { keywords, response } of responses) {
        if (keywords.some(keyword => normalizedInput.includes(keyword))) {
            return response;
        }
    }
    return 'Hä, hab ich die Kurve nicht gekriegt? 😅 Erzähl mir mehr von deinem Auto, und wir legen los – Wir kaufen dein Auto.de ist immer bereit!';
}

function saveDialog() {
    const chatBody = document.getElementById('chat-body');
    const messages = Array.from(chatBody.getElementsByClassName('message'));
    let dialogText = 'Ralf Schumacher Chatbot Dialog\n\n';
    
    messages.forEach(message => {
        const text = message.querySelector('p').textContent;
        const sender = message.classList.contains('bot-message') ? 'Ralf' : 'Du';
        dialogText += `${sender}: ${text}\n`;
    });

    const blob = new Blob([dialogText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ralf_schumacher_chat.txt';
    a.click();
    URL.revokeObjectURL(url);
}
