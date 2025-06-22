"use client";
import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image'; 

// Định nghĩa các kiểu dữ liệu
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import styles from './FloatingChatbox.module.css'; 

export default function FloatingChatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); 

  const messagesEndRef = useRef<HTMLDivElement>(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) { // Chỉ cuộn khi chatbox đang mở
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', { // Gọi API Route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong on the server.');
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.message },
      ]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to get response from Lemonfox AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.chatFloatingContainer} ${isOpen ? styles.open : ''}`}>
      {!isOpen && (
        <button className={styles.openChatButton} onClick={() => setIsOpen(true)} aria-label="Open Chat">
          {/* Đây là vị trí dán mã SVG của icon chat support */}
          {/* Ví dụ SVG icon chat: */}
          <svg
            height="40px"
            width="40px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 502.664 502.664"
            xmlSpace="preserve"
            fill="currentColor"
          >
            <g>
              <g>
                <g>
                  <path d="M378.74,181.184c0-76.576-84.708-138.743-189.305-138.743C84.73,42.441,0,104.608,0,181.184
                    c0,47.154,32.291,88.591,81.343,113.7l-47.024,89.389l101.987-70.515c16.955,3.645,34.6,6.234,53.129,6.234
                    C294.053,319.992,378.74,257.846,378.74,181.184z M129.942,196.24H89.95v-40.014h39.992V196.24z M251.3,156.226h39.992v40.014
                    H251.3V156.226z M170.625,156.226h39.971v40.014h-39.971V156.226z"/>
                  <path d="M502.664,268.481c0-50.325-38.763-93.984-95.602-115.943c2.804,10.332,4.314,21.053,4.314,32.097
                    c0,90.77-100.304,164.412-224.25,164.412c-1.532,0-2.955-0.324-4.465-0.324c32.68,30.868,83.695,50.799,141.138,50.799
                    c17.515,0,34.147-2.438,50.152-5.846l96.378,66.546l-44.457-84.363C472.206,352.111,502.664,312.981,502.664,268.481z"/>
                </g>
              </g>
            </g>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatbox}>
          <div className={styles.chatboxHeader}>
            <span>Chat với Lemonfox AI</span>
            <button className={styles.closeChatButton} onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>
          <div className={styles.chatboxBody}>
            {messages.length === 0 && <p className={styles.welcomeMessage}>Chào mừng! Hãy bắt đầu trò chuyện với Lemonfox AI.</p>}
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
                <strong>{msg.role === 'user' ? 'Bạn' : 'Lemonfox AI'}:</strong> {msg.content}
              </div>
            ))}
            {loading && <div className={styles.loadingMessage}>Lemonfox AI đang nghĩ...</div>}
            {error && <div className={styles.errorMessage}>Lỗi: {error}</div>}
            <div ref={messagesEndRef} /> {/* Để cuộn xuống cuối */}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Gõ tin nhắn của bạn..."
              className={styles.textInput}
              disabled={loading}
            />
            <button type="submit" disabled={loading} className={styles.sendButton}>
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}