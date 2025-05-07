// static/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message';
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        try {
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            const typingContent = document.createElement('div');
            typingContent.className = 'message';
            typingContent.textContent = 'Typing...';
            typingDiv.appendChild(typingContent);
            chatBox.appendChild(typingDiv);
            
            // Get response from server
            const response = await fetch('/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            chatBox.removeChild(typingDiv);
            
            // Add bot response to chat
            addMessage(data.response, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again.', false);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});