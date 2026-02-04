import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import chatbotAvatar from '@/assets/chatbot-avatar.jpg';
import { sendChatMessage, getChatSuggestions, ChatResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  relatedTopics?: string[];
}

const defaultQuickQuestions = [
  "What are the symptoms of early pregnancy?",
  "What foods should I avoid during pregnancy?",
  "How much weight gain is normal?",
  "When should I feel baby movements?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your PregAI assistant 👋 I'm here to help you with any pregnancy-related questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<string[]>(defaultQuickQuestions);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch suggestions from backend
  useEffect(() => {
    getChatSuggestions()
      .then((response) => {
        if (response.suggestions && response.suggestions.length > 0) {
          setQuickQuestions(response.suggestions.map(s => s.text));
        }
      })
      .catch(() => {
        // Use default questions if backend is not available
        console.log('Using default suggestions');
      });
  }, []);

  const handleSend = async (message?: string) => {
    const text = message || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get context from last few messages
      const context = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');
      
      const response = await sendChatMessage(text, context);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        category: response.category,
        relatedTopics: response.related_topics,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      // Fallback to local responses if backend is unavailable
      const fallbackResponse = getFallbackResponse(text);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      
      toast({
        title: "Backend Offline",
        description: "Using local responses. Start the Flask backend for full AI features.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('symptom') || lowerMessage.includes('early pregnancy')) {
      return "Early pregnancy symptoms typically include missed period, nausea (morning sickness), tender breasts, fatigue, and frequent urination. These usually appear within the first 4-6 weeks. However, every pregnancy is unique, and some women may experience different symptoms.";
    }
    if (lowerMessage.includes('food') || lowerMessage.includes('avoid') || lowerMessage.includes('eat')) {
      return "During pregnancy, you should avoid: raw or undercooked meat/seafood, unpasteurized dairy, high-mercury fish (shark, swordfish), excessive caffeine, alcohol, and raw eggs. Focus on eating balanced meals with plenty of fruits, vegetables, lean proteins, and whole grains.";
    }
    if (lowerMessage.includes('weight') || lowerMessage.includes('gain')) {
      return "Normal weight gain during pregnancy varies based on your pre-pregnancy BMI. Generally, women with normal BMI should gain 25-35 pounds. Underweight women may need to gain more (28-40 lbs), while overweight women may need less (15-25 lbs). Always consult your doctor for personalized advice.";
    }
    if (lowerMessage.includes('movement') || lowerMessage.includes('kick') || lowerMessage.includes('feel')) {
      return "Most women start feeling baby movements (quickening) between weeks 16-25. First-time mothers typically feel movements later (around 18-25 weeks), while experienced mothers may feel them earlier (around 13-18 weeks). These early movements feel like flutters or bubbles.";
    }
    
    return "I'm here to help you with pregnancy-related questions. Feel free to ask me anything about nutrition, symptoms, or general pregnancy care! For the most accurate responses, please make sure the backend server is running.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">AI Pregnancy Assistant</h1>
          <p className="text-muted-foreground">Get instant answers to your pregnancy questions (Knowledge-based AI)</p>
        </motion.div>

        <Card className="flex-1 flex flex-col glass-card border-none overflow-hidden">
          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      message.role === 'user' ? 'gradient-primary' : ''
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <img src={chatbotAvatar} alt="AI" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'gradient-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.category && (
                      <p className="text-xs mt-2 opacity-70">Category: {message.category}</p>
                    )}
                    {message.relatedTopics && message.relatedTopics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.relatedTopics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-black/10 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={chatbotAvatar} alt="AI" className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Questions */}
          <div className="px-6 py-3 border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  disabled={isTyping}
                  className="flex-shrink-0 px-4 py-2 bg-muted hover:bg-primary/10 text-sm text-foreground rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                disabled={isTyping}
                className="flex-1 h-12 bg-muted/50 border-border/50 focus:border-primary"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                variant="hero"
                size="icon"
                className="w-12 h-12"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
