# app.py
from flask import Flask, render_template, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = Flask(__name__)

# Load model and tokenizer
model_name = "microsoft/DialoGPT-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_bot_response():
    user_message = request.json.get('message', '')
    
    # Tokenize the input and generate a response
    inputs = tokenizer.encode(user_message + tokenizer.eos_token, return_tensors='pt')
    chat_history_ids = model.generate(
        inputs,
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=3,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )
    
    # Decode the response
    bot_response = tokenizer.decode(chat_history_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True)
    
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)