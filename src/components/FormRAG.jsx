// src/components/FormRAG.jsx
import React, { useState } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';

export default function FormRAG({ template, apiKey }) {
  const [data, setData] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const arr = data[name] || [];
      setData((prev) => ({
        ...prev,
        [name]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
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
          model: 'grok-beta',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });
      const json = await res.json();
      setResult(json.choices?.[0]?.message?.content ?? 'No response');
    } catch (err) {
      setResult('Error: Check your Grok API key or internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-rag-wrapper">
      <style jsx>{`
        .form-rag-wrapper {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-rag-container {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 16px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        h2 {
          margin: 0 0 2rem;
          font-size: 2rem;
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
          gap: 1.75rem;
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
          letter-spacing: -0.01em;
        }

        input,
        select {
          padding: 0.9rem 1.1rem;
          font-size: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.25s ease;
          outline: none;
          font-family: inherit;
        }

        input::placeholder,
        select::placeholder {
          color: #94a3b8;
        }

        input:focus,
        select:focus {
          border-color: #1da1f2;
          box-shadow: 0 0 0 4px rgba(29, 161, 242, 0.15);
          transform: translateY(-1px);
        }

        .checkbox-group {
          display: grid;
          gap: 0.9rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: #475569;
          padding: 0.5rem 0;
        }

        .checkbox-item input[type='checkbox'] {
          width: 1.35rem;
          height: 1.35rem;
          accent-color: #1da1f2;
          cursor: pointer;
        }

        button {
          margin-top: 1.5rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(29, 161, 242, 0.3);
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: 0.5s;
        }

        button:hover::before {
          left: 100%;
        }

        button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(29, 161, 242, 0.4);
        }

        button:active:not(:disabled) {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .result {
          margin-top: 2.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .result h3 {
          margin: 0 0 1.25rem;
          font-size: 1.35rem;
          color: #0f172a;
          font-weight: 600;
        }

        .result pre {
          margin: 0;
          white-space: pre-wrap;
          font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #1e293b;
          background: white;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          max-height: 400px;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-rag-wrapper {
            padding: 1.5rem 1rem;
          }

          .form-rag-container {
            padding: 2rem 1.5rem;
            border-radius: 16px;
          }

          h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .form-rag-wrapper {
            padding: 1rem 0.75rem;
          }

          .form-rag-container {
            padding: 1.75rem 1.25rem;
            border-radius: 14px;
          }

          h2 {
            font-size: 1.5rem;
          }

          button {
            padding: 0.9rem 1.5rem;
            font-size: 1rem;
          }

          .result pre {
            padding: 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="form-rag-container">
        <h2>{template.name}</h2>
        <form onSubmit={submit}>
          {template.form.map((field) => (
            <div key={field.id} className="field">
              <label>{field.label}</label>

              {field.type === 'select' ? (
                <select name={field.id} onChange={handleChange} required>
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
                  placeholder={field.placeholder ?? ''}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? 'Generating…' : 'Generate with Grok'}
          </button>
        </form>

        {result && (
          <div className="result">
            <h3>Result:</h3>
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}