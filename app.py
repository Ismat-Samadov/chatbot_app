# app.py
from flask import Flask, render_template, request, jsonify
import os
import random
import re

app = Flask(__name__)

# Simple rule-based chatbot responses
responses = {
    "greeting": ["Hello!", "Hi there!", "Greetings!", "Hey, how can I help?"],
    "goodbye": ["Goodbye!", "See you later!", "Bye!", "Take care!"],
    "thanks": ["You're welcome!", "Glad I could help!", "No problem!", "Anytime!"],
    "how_are_you": ["I'm doing well, thanks for asking!", "I'm good! How about you?", "I'm fine, how can I help?"],
    "who_are_you": ["I'm a simple chatbot built with Python and Flask.", "I'm your AI assistant, how can I help?"],
    "capabilities": ["I can answer simple questions and have basic conversations.", "I'm a basic chatbot that can respond to various prompts."],
    "default": ["I'm not sure I understand. Could you rephrase that?", "Interesting. Tell me more.", "I'm still learning. Could you elaborate?"]
}

# Basic pattern matching for intents
patterns = {
    "greeting": r"(?i)^(hi|hello|hey|greetings|good (morning|afternoon|evening)).*",
    "goodbye": r"(?i)^(bye|goodbye|see you|farewell|exit|quit).*",
    "thanks": r"(?i)^(thanks|thank you|appreciate it|grateful).*",
    "how_are_you": r"(?i)^(how are you|how('s| is) it going|what('s| is) up|how do you do).*",
    "who_are_you": r"(?i)^(who are you|what are you|tell me about yourself|introduce yourself).*",
    "capabilities": r"(?i)^(what can you do|what are your capabilities|help|functions|features).*"
}

def get_response(message):
    # Match patterns to determine intent
    for intent, pattern in patterns.items():
        if re.match(pattern, message):
            return random.choice(responses[intent])
    
    # Add some basic contextual responses
    if "weather" in message.lower():
        return "I don't have access to real-time weather data, but I hope it's nice where you are!"
    elif "time" in message.lower():
        return "I don't have access to the current time, but you can check your device."
    elif "name" in message.lower():
        return "You can call me NLP Bot. What's your name?"
    elif "course" in message.lower() or "class" in message.lower():
        return "This chatbot was created for a natural language processing course project."
    elif "language" in message.lower() or "python" in message.lower():
        return "I'm built with Python and Flask. Python is a great language for NLP projects!"
    elif "help" in message.lower():
        return "I can answer basic questions. Try asking about who I am or what I can do!"
    
    # Default response if no patterns match
    return random.choice(responses["default"])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_bot_response():
    user_message = request.json.get('message', '')
    bot_response = get_response(user_message)
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))  # Change from 5000 to 8080
    app.run(host='0.0.0.0', port=port)