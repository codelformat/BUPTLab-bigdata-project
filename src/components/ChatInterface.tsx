'use client';

import { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { chatService } from '@/services/api/endpoints';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

const UserAvatar = () => (
  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-200">
    <Image
      src="/avatars/user-avatar.png"
      alt="User"
      width={40}
      height={40}
      className="w-full h-full object-cover"
    />
  </div>
);

const AIAvatar = () => (
  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-purple-100 border-2 border-purple-200">
    <Image
      src="/avatars/ai-avatar.png"
      alt="AI"
      width={40}
      height={40}
      className="w-full h-full object-cover"
    />
  </div>
);

export default function ChatInterface({ messages, onMessagesChange }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    onMessagesChange([...messages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(inputMessage);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      onMessagesChange([...messages, newUserMessage, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了一个错误。请稍后重试。',
        isUser: false,
        timestamp: new Date(),
      };
      onMessagesChange([...messages, newUserMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[80%] h-[800px] bg-white rounded-xl shadow-lg flex flex-col font-sans">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        <p className="text-sm text-gray-500">随时为您提供帮助</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-purple-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {message.isUser ? <UserAvatar /> : <AIAvatar />}
              <div
                className={`rounded-2xl px-6 py-3 shadow-sm ${
                  message.isUser
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <div className={`prose prose-lg max-w-none ${message.isUser ? 'prose-invert' : ''}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`${className} px-1 py-0.5 rounded-md bg-gray-100 text-sm`} {...props}>
                            {children}
                          </code>
                        );
                      },
                      a: ({node, ...props}) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${message.isUser ? 'text-blue-200' : 'text-blue-500'} hover:underline`}
                        />
                      ),
                      p: ({children}) => (
                        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <span className={`text-xs ${message.isUser ? 'text-purple-200' : 'text-gray-400'} mt-2 block`}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <AIAvatar />
              <div className="bg-white text-gray-800 rounded-2xl px-6 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-xl">
        <div className="relative bg-gray-50 rounded-xl shadow-sm">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (按 Enter 发送，Shift + Enter 换行)"
            className="w-full px-4 py-4 pr-12 rounded-xl border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none max-h-32 text-base"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 