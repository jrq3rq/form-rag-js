// src/components/FormRAG.jsx
import React, { useState } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';

export default function FormRAG({ template, apiKey }) {
  const [data, setData] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');

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
          model: 'grok-1',  // ← FIXED
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setResult(json.choices?.[0]?.message?.content ?? 'No response');
    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fields = template.form(selectedBusiness);

  return (
    <div className="form-rag-wrapper">
      <style>{`
        /* ← REMOVED jsx */
        * { box-sizing: border-box; }
        .form-rag-wrapper { min-height: 100vh; min-height: 100dvh; ... }
        /* ... rest of your beautiful CSS ... */
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
                  min={field.min}
                  max={field.max}
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
          </div>
        )}
      </div>
    </div>
  );
}