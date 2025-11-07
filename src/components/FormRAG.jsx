// src/components/FormRAG.jsx
import React, { useState, useRef, useEffect } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';
import './FormRAG.css';

export default function FormRAG({ template, apiKey }) {
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', content: string }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const arr = data[name] || [];
      setData((prev) => ({
        ...prev,
        [name]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      }));
    } else {
      const newData = { ...data, [name]: value };
      if (name === 'businessType') {
        setSelectedBusiness(value);
        setData({ businessType: value });
      } else {
        setData(newData);
      }
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prompt = constructPrompt(data, template);

    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-3-beta',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const response = json.choices?.[0]?.message?.content ?? 'No response';

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: prompt },
        { role: 'assistant', content: response },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-3-beta',
          messages: [...messages, { role: 'user', content: userMessage }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const response = json.choices?.[0]?.message?.content ?? 'No response';

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const downloadChat = () => {
    const text = messages
      .map((m) => `${m.role === 'user' ? 'You' : 'Grok'}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMessage = (msg) => {
    const blob = new Blob([msg.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message_${msg.role}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const fields = template.form(selectedBusiness);

  return (
    <div className="form-rag-wrapper">
      <div className="form-rag-container">
        <h2>{template.name}</h2>

        {/* INITIAL FORM */}
        {messages.length === 0 && (
          <form onSubmit={submitForm}>
            {fields.map((field) => (
              <div key={field.id} className="field">
                <label>{field.label}</label>

                {field.type === 'select' ? (
                  <select
                    name={field.id}
                    value={data[field.id] || ''}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">-- Choose --</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'multi' ? (
                  <div className="checkbox-group">
                    {field.options.map((opt) => (
                      <label key={opt.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          name={field.id}
                          value={opt.value}
                          checked={(data[field.id] || []).includes(opt.value)}
                          onChange={handleChange}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.id}
                    value={data[field.id] || ''}
                    placeholder={field.placeholder ?? ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  Generating…
                </>
              ) : (
                'Start with Grok'
              )}
            </button>
          </form>
        )}

        {/* CHAT */}
        {messages.length > 0 && (
          <div className="chat-section">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.role}`}
                >
                  <pre className="message-content">{msg.content}</pre>
                  <button
                    className="download-btn"
                    onClick={() => downloadMessage(msg)}
                    aria-label="Download message"
                  >
                    Download
                  </button>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
              <div className="chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading}>
                  {loading ? 'Sending…' : 'Send'}
                </button>
              </div>

              <div className="footer-actions">
                <button className="action-btn" onClick={downloadChat}>
                  Download Full Chat
                </button>
                <button className="action-btn clear" onClick={clearChat}>
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}