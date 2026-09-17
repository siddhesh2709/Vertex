import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export function Chatbot() {
  React.useEffect(() => {
    console.log("CHATBOT COMPONENT MOUNTED");
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! I am the Vertex AI assistant. How can I help you with your farm today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: 'I am just a static mock chatbot for now! In the future, I will be connected to an AI service to help you out.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-end" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-green-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Vertex Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white rounded-tr-none self-end'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none self-start shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border-gray-300 focus-visible:ring-green-500"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Button Container */}
      <div className="relative flex flex-col items-end gap-2">
        {/* Floating Label */}
        {!isOpen && (
          <div className="bg-white text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full shadow-md border border-green-100 whitespace-nowrap">
            Farmer's Help
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] transition-transform hover:scale-105 active:scale-95 ${
            isOpen ? 'bg-gray-800 text-white shadow-gray-900/20' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
}
