// src/components/FormRAG.jsx
import React, { useState, useRef } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';

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
      scrollToBottom();
    }
  };

  const downloadChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'Grok'}: ${m.content}`).join('\n\n');
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

  const fields = template.form(selectedBusiness);

  return (
    <div className="form-rag-wrapper">
      <style>{`
        * { box-sizing: border-box; }

        .form-rag-wrapper {
          min-height: 100vh;
          min-height: 100dvh;
          padding: clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
        }

        .form-rag-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 2.5rem) clamp(1.5rem, 4vw, 2rem);
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          background: linear-gradient(90deg, #1da1f2, #0d8bd9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        form {
          display: grid;
          gap: clamp(1.5rem, 3vw, 1.75rem);
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        label {
          font-weight: 600;
          color: #334155;
          font-size: 0.95rem;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.9rem 1.1rem;
          font-size: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.25s ease;
          outline: none;
          font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
          border-color: #1da1f2;
          box-shadow: 0 0 0 4px rgba(29,161,242,0.15);
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2a17.6%2017.6%200%200%200%205.4%2012.9l128%20128c3.5%203.5%207.8%205.4%2012.9%205.4s9.4-1.9%2012.9-5.4l128-128a17.6%2017.6%200%200%200%200-25.5z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 12px;
          padding-right: 2.5rem;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 60vh;
          overflow-y: auto;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          position: relative;
          word-wrap: break-word;
        }

        .message.user {
          align-self: flex-end;
          background: #1da1f2;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.assistant {
          align-self: flex-start;
          background: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .message-actions {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .message:hover .message-actions {
          opacity: 1;
        }

        .download-btn {
          background: rgba(0,0,0,0.1);
          color: #333;
          border: none;
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
        }

        .download-all {
          align-self: center;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }

        button {
          margin-top: 1rem;
          padding: clamp(0.9rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(29,161,242,0.3);
          width: 100%;
        }

        button:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 1.1em;
          height: 1.1em;
          border: 2px solid #ffffff40;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

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
          <>
            <div className="chat-container">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.role}`}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div className="message-actions">
                    <button className="download-btn" onClick={() => downloadMessage(msg)}>
                      Download
                    </button>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</pre>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading}>
                {loading ? 'Sending…' : 'Send'}
              </button>
            </div>

            <button className="download-all" onClick={downloadChat}>
              Download Full Chat
            </button>
          </>
        )}
      </div>
    </div>
  );
}