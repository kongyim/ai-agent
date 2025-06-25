import { useEffect, useRef, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import axios from '../api/axios';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null); // 👈 new ref

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/chat/history');
        setMessages(res.data);
      } catch (err: any) {
        setError('Failed to load chat history.');
      }
    };
    fetchHistory();
  }, []);

  // scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 10 * 24)}px`;
    }
  };

  const send = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');

    try {
      const res = await axios.post('/chat', { content: input });
      const aiMessage: Message = { role: 'assistant', content: res.data.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError('Something went wrong while sending your message.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white shadow rounded-lg p-6 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
          <LogoutButton />
        </div>

        {/* Scrollable message history */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`px-4 py-3 rounded-lg w-fit max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-green-100 self-start'
              }`}
            >
              <p className="text-sm text-gray-800 whitespace-pre-line">{msg.content}</p>
            </div>
          ))}
          {/* 👇 scroll target div */}
          <div ref={bottomRef} />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500 text-center mb-2">{error}</p>
        )}

        {/* Input box */}
        <div className="flex gap-2 mt-2">
          <textarea
            ref={textareaRef}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
            style={{ maxHeight: '240px', lineHeight: '24px' }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            placeholder="Ask me anything..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={send}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
