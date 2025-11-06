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
    <div className="form-rag-container">
      <style jsx>{`
        .form-rag-container {
          max-width: 640px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f9f9fb;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        h2 {
          margin: 0 0 1.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
        }

        form {
          display: grid;
          gap: 1.5rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-weight: 600;
          color: #2d2d2d;
          font-size: 0.95rem;
        }

        input,
        select {
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          transition: all 0.2s ease;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #1da1f2;
          box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.15);
        }

        .checkbox-group {
          display: grid;
          gap: 0.75rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .checkbox-item input[type='checkbox'] {
          width: 1.25rem;
          height: 1.25rem;
          accent-color: #1da1f2;
        }

        button {
          margin-top: 1rem;
          padding: 0.9rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 161, 242, 0.4);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .result {
          margin-top: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .result h3 {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .result pre {
          margin: 0;
          white-space: pre-wrap;
          font-family: inherit;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #2d2d2d;
        }

        @media (max-width: 480px) {
          .form-rag-container {
            padding: 1.5rem 1rem;
            border-radius: 12px;
          }

          h2 {
            font-size: 1.5rem;
          }

          button {
            width: 100%;
          }
        }
      `}</style>

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
  );
}