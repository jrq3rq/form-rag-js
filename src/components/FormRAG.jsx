// src/components/FormRAG.jsx
import React, { useState } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';

export default function FormRAG({ template, apiKey }) {
  const [data, setData] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [wantsReply, setWantsReply] = useState(false);

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

  const submit = async (e) => {
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
      const rawResponse = json.choices?.[0]?.message?.content ?? 'No response';

      const wantsReply = /Reply YES to confirm/i.test(rawResponse);
      const cleanResponse = rawResponse.replace(/Reply YES to confirm\.?$/i, '').trim();

      setResult(cleanResponse);
      setWantsReply(wantsReply);
    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    setResult((prev) => `${prev}\n\n**YES — Confirmed!** I'll follow up with next steps.`);
    setWantsReply(false);
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .reply-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: #10b981;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .reply-btn:hover { background: #059669; transform: translateY(-2px); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          margin: 0 0 2rem;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          background: linear-gradient(90deg, #1da1f2, #0d8bd9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        form {
          display: grid;
          gap: clamp(1.5rem, 3vw, 1.75rem);
          width: 100%;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
        }

        label {
          font-weight: 600;
          color: #334155;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
          user-select: none;
        }

        input, select {
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

        input::placeholder, select::placeholder { color: #94a3b8; }

        input:focus, select:focus {
          border-color: #1da1f2;
          box-shadow: 0 0 0 4px rgba(29,161,242,0.15);
          transform: translateY(-1px);
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2a17.6%2017.6%200%200%200%205.4%2012.9l128%20128c3.5%203.5%207.8%205.4%2012.9%205.4s9.4-1.9%2012.9-5.4l128-128a17.6%2017.6%200%200%200%200-25.5z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 12px;
          padding-right: 2.5rem;
        }

        .checkbox-group {
          display: grid;
          gap: 0.8rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          width: 100%;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: #475569;
          padding: 0.5rem 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .checkbox-item:hover { color: #1e293b; }

        .checkbox-item input[type='checkbox'] {
          width: 1.35rem;
          height: 1.35rem;
          accent-color: #1da1f2;
          cursor: pointer;
          margin: 0;
        }

        button {
          margin-top: 1.5rem;
          padding: clamp(0.9rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(29,161,242,0.3);
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        button:hover::before { left: 100%; }
        button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(29,161,242,0.4); }
        button:active:not(:disabled) { transform: translateY(-1px); }
        button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spinner {
          width: 1.1em;
          height: 1.1em;
          border: 2px solid #ffffff40;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .result {
          margin-top: 2.5rem;
          padding: clamp(1.5rem, 4vw, 2rem);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          animation: fadeIn 0.5s ease-out;
          width: 100%;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .result h3 {
          margin: 0 0 1.25rem;
          font-size: 1.35rem;
          color: #0f172a;
          font-weight: 600;
        }

        .result pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          line-height: 1.7;
          color: #1e293b;
          background: white;
          padding: clamp(1rem, 3vw, 1.25rem);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f8fafc;
          width: 100%;
        }

        .result pre::-webkit-scrollbar { width: 8px; }
        .result pre::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .result pre::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .result pre::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        @media (max-width: 768px) {
          .form-rag-wrapper { padding: 1.5rem 1rem; }
          .form-rag-container { padding: 2rem 1.5rem; border-radius: 16px; }
        }

        @media (max-width: 480px) {
          .form-rag-wrapper { padding: 1rem 0.75rem; }
          .form-rag-container { padding: 1.75rem 1.25rem; border-radius: 14px; }
          .checkbox-group { padding: 0.6rem; }
          .checkbox-item { font-size: 0.9rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="form-rag-container">
        <h2>{template.name}</h2>
        <form onSubmit={submit}>
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
              'Generate with Grok'
            )}
          </button>
        </form>

        {result && (
          <div className="result">
            <h3>Result:</h3>
            <pre>{result}</pre>
            {wantsReply && (
              <button onClick={handleReply} className="reply-btn">
                Reply YES
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}