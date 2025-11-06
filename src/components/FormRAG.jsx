// components/FormRAG.jsx
import React, { useState } from 'react';
import { constructPrompt } from "../lib/promptEngine.js";

export default function FormRAG({ template, apiKey }) {
  const [data, setData] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
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
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      const json = await res.json();
      setResult(json.choices?.[0]?.message?.content ?? "No response");
    } catch (err) {
      setResult("Error: Check your Grok API key or internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>{template.name}</h2>
      <form onSubmit={submit}>
        {template.form.map((field) => (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>{field.label}</label>

            {/* SELECT */}
            {field.type === "select" ? (
              <select
                name={field.id}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                required
              >
                <option value="">-- Choose --</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "multi" ? (
              /* CHECKBOX GROUP */
              <div>
                {field.options.map((opt) => (
                  <label key={opt.value} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      name={field.id}
                      value={opt.value}
                      onChange={handleChange}
                    />{" "}
                    {opt.label}
                  </label>
                ))}
              </div>
            ) : (
              /* TEXT / NUMBER */
              <input
                type={field.type}
                name={field.id}
                placeholder={field.placeholder ?? ""}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#1DA1F2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating…" : "Generate with Grok"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0f0f0", borderRadius: "4px" }}>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}