// Elements
const toggleButton = document.getElementById('chat-toggle');
const panel = document.getElementById('chat-panel');
const closeButton = document.getElementById('chat-close');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messageArea = document.getElementById('chat-messages');

// Open / close panel
function openChat() {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
}

function closeChat() {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
}

// Toggle behaviour
toggleButton.addEventListener('click', () => {
    const isHidden = panel.classList.contains('hidden');
    isHidden ? openChat() : closeChat();
});

closeButton.addEventListener('click', () => {
    closeChat();
});

// Add a message to the chat area
function addMessage(text, sender = 'user') {
    const msg = document.createElement('div');
    msg.classList.add('message', `message--${sender}`);
    msg.textContent = text;
    messageArea.appendChild(msg);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Ask the backend for a reply
async function fetchAIResponse(userText) {
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();

        // If backend returns an error field, treat it cleanly
        if (data.error) {
            return "The assistant is unavailable at the moment.";
        }

        return data.reply || "I could not generate a reply.";
    } catch (err) {
        console.error("Network or server error:", err);
        return "I could not reach the server. Please try again later.";
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    // User message
    addMessage(text, 'user');
    input.value = '';

    // Typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.classList.add('message', 'message--bot');
    typingMsg.textContent = "Typing...";
    typingMsg.classList.add('typing');
    messageArea.appendChild(typingMsg);
    messageArea.scrollTop = messageArea.scrollHeight;

    // Fetch the reply
    const reply = await fetchAIResponse(text);

    // Replace typing indicator
    typingMsg.remove();
    addMessage(reply, 'bot');
});
