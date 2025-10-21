import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your agricultural assistant. I can help you with crop predictions, farming advice, and answer questions about our platform. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses based on keywords
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Crop-related queries
    if (message.includes('wheat') || message.includes('crop')) {
      return "Wheat is ideal for moderate climates with temperatures between 15-25°C and requires well-drained loamy soil. It needs about 50-75cm of annual rainfall. Would you like to know about other crops?";
    }
    if (message.includes('rice')) {
      return "Rice is a water-intensive crop that thrives in humid climates with 20-35°C temperatures. It needs flooded conditions and clayey or loamy soil with good water retention. Best grown in regions with high rainfall.";
    }
    if (message.includes('maize') || message.includes('corn')) {
      return "Maize grows best in warm conditions (18-27°C) with good sunlight. It needs fertile, well-drained soil and adequate water during tasseling and grain filling stages.";
    }
    if (message.includes('soybean')) {
      return "Soybeans are adaptable legumes that enrich soil nitrogen. They prefer temperatures of 20-30°C and well-drained loamy soils with neutral pH levels.";
    }

    // Temperature and weather queries
    if (message.includes('temperature') || message.includes('weather')) {
      return "Temperature is crucial for crop growth. Different crops have different optimal temperature ranges. Use our 'Use Current Location' feature to automatically detect your local weather conditions!";
    }
    if (message.includes('humidity')) {
      return "Humidity affects plant transpiration and disease prevalence. Most crops thrive in 60-80% humidity. You can get real-time humidity data using our location feature.";
    }

    // Soil queries
    if (message.includes('soil')) {
      return "Different soil types suit different crops:\n• Loamy soil: Best for most crops, balanced nutrients\n• Clay soil: High nutrients, poor drainage\n• Sandy soil: Good drainage, low nutrients\n• Peaty soil: High organic matter, acidic\n\nWhat's your soil type?";
    }

    // Prediction queries
    if (message.includes('predict') || message.includes('yield')) {
      return "Our AI model predicts crop yield based on temperature, humidity, soil type, crop type, water flow, and location. Just fill in the form and click 'Predict Yield' to get accurate forecasts!";
    }
    if (message.includes('accurate') || message.includes('accuracy')) {
      return "Our prediction model has 95% accuracy, trained on thousands of agricultural data points. It considers climate, soil conditions, and geographic factors for reliable yield forecasts.";
    }

    // Disease detection queries
    if (message.includes('disease') || message.includes('pest')) {
      return "Visit our Disease Detection page to upload a leaf image. Our AI will identify plant diseases and provide treatment recommendations. Early detection helps prevent crop loss!";
    }

    // How-to queries
    if (message.includes('how') && (message.includes('use') || message.includes('work'))) {
      return "It's simple! \n1. Enter your crop parameters (or use current location)\n2. Click 'Predict Yield'\n3. View your predicted yield and recommendations\n4. Check the comparison chart to see potential outcomes\n\nNeed help with a specific field?";
    }

    // Location queries
    if (message.includes('location')) {
      return "Click 'Use Current Location' to automatically fill in your coordinates, temperature, and humidity. This gives you the most accurate predictions based on your exact conditions!";
    }

    // Greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! 👋 I'm here to help you with crop predictions and farming advice. What would you like to know?";
    }

    // Thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Feel free to ask if you have more questions about crops, predictions, or our platform. Happy farming! 🌾";
    }

    // Default response
    return "I can help you with:\n• Crop recommendations\n• Yield predictions\n• Weather and soil conditions\n• Disease detection\n• Using our platform\n\nWhat would you like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMsg = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-primary-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Agricultural Assistant</h3>
                <p className="text-xs text-primary-100">Online • Always ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-600 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-700" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ask about crops, predictions, or farming advice
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;