// static/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const themeToggle = document.getElementById('themeToggle');
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        } else {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
        }
    });

    function getCurrentTime() {
        const now = new Date();
        return now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    }

    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        
        const icon = document.createElement('i');
        icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
        avatarDiv.appendChild(icon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message';
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = isUser ? 'You' : 'AI Assistant';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'time';
        timeSpan.textContent = getCurrentTime();
        
        messageHeader.appendChild(nameSpan);
        messageHeader.appendChild(timeSpan);
        
        const messageContentText = document.createElement('div');
        messageContentText.className = 'message-content';
        messageContentText.textContent = message;
        
        messageContent.appendChild(messageHeader);
        messageContent.appendChild(messageContentText);
        
        messageDiv.appendChild(avatarDiv);
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
            
            const typingAvatar = document.createElement('div');
            typingAvatar.className = 'avatar';
            
            const botIcon = document.createElement('i');
            botIcon.className = 'fas fa-robot';
            typingAvatar.appendChild(botIcon);
            
            const typingContent = document.createElement('div');
            typingContent.className = 'message';
            
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('span');
                typingIndicator.appendChild(dot);
            }
            
            typingContent.appendChild(typingIndicator);
            typingDiv.appendChild(typingAvatar);
            typingDiv.appendChild(typingContent);
            
            chatBox.appendChild(typingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            
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
    
    // Auto-focus the input field when page loads
    userInput.focus();
});