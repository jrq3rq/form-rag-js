// src/components/FormRAG.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { constructPrompt } from '../lib/promptEngine.js';
import { formatFormSummary } from '../lib/formatFormSummary.js';
import { createXaiComplete } from '../lib/chatClient.js';
import { downloadJSON } from '../lib/utils/download.js';
import { themeToStyle } from '../lib/templateTheme.js';
import './FormRAG.css';

export default function FormRAG({
  template,
  complete,
  apiKey,
  model = 'grok-3-beta',
  temperature = 0.7,
  variant = 'page',
  onLead,
  onError,
  autoDownloadLead = true,
}) {
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const messagesEndRef = useRef(null);
  const systemPromptRef = useRef('');

  const completeFn = useMemo(() => {
    if (complete) return complete;
    if (apiKey) {
      return createXaiComplete({ apiKey, model, temperature });
    }
    return null;
  }, [complete, apiKey, model, temperature]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fields =
    typeof template.form === 'function' ? template.form(selectedBusiness) : template.form;

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && field?.type === 'checkbox' && !field.options) {
      setData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === 'checkbox') {
      const arr = data[name] || [];
      setData((prev) => ({
        ...prev,
        [name]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      }));
      return;
    }

    if (name === 'businessType') {
      setSelectedBusiness(value);
      setData({ businessType: value });
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const buildApiMessages = (visibleMessages) => {
    const system = systemPromptRef.current;
    const out = [];
    if (system) out.push({ role: 'system', content: system });
    visibleMessages.forEach((m) => out.push({ role: m.role, content: m.content }));
    return out;
  };

  const runComplete = async (apiMessages, formData) => {
    if (!completeFn) {
      throw new Error(
        'FormRAG requires `complete` (recommended) or deprecated `apiKey`. Use createXaiComplete on your server.',
      );
    }
    return completeFn({ messages: apiMessages, formData });
  };

  const handleLead = (formData, visibleMessages) => {
    if (!template.exportLead) return;
    const lead = template.exportLead(formData, visibleMessages);
    onLead?.(lead, formData);

    if (autoDownloadLead) {
      const base =
        template.exportFilename?.(formData) ??
        `${(formData.name || formData.customerName || 'lead').replace(/\s+/g, '_')}_lead.json`;
      downloadJSON(lead, base.endsWith('.json') ? base : `${base}.json`);
    }
  };

  const reportError = (err) => {
    onError?.(err);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: `Error: ${err.message}` },
    ]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!completeFn) {
      reportError(new Error('Missing `complete` callback or `apiKey`.'));
      return;
    }

    setLoading(true);
    try {
      systemPromptRef.current = await constructPrompt(data, template);
      const userSummary =
        template.initialUserMessage?.(data, fields) ?? formatFormSummary(data, fields);

      const apiMessages = [
        { role: 'system', content: systemPromptRef.current },
        { role: 'user', content: userSummary },
      ];

      const response = await runComplete(apiMessages, data);
      const userMsg = { role: 'user', content: userSummary };
      const assistantMsg = { role: 'assistant', content: response };
      const visible = [userMsg, assistantMsg];

      setMessages(visible);
      handleLead(data, visible);
    } catch (err) {
      reportError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !completeFn) return;

    const userMessage = input.trim();
    setInput('');
    const nextVisible = [...messages, { role: 'user', content: userMessage }];
    setMessages(nextVisible);
    setLoading(true);

    // Reset auto-grown textarea height
    requestAnimationFrame(() => {
      const el = document.getElementById('form-rag-chat-input');
      if (el) el.style.height = 'auto';
    });

    try {
      const apiMessages = buildApiMessages(nextVisible);
      const response = await runComplete(apiMessages, data);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      reportError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setData({});
    setInput('');
    setSelectedBusiness('');
    systemPromptRef.current = '';
  };

  const downloadChat = () => {
    const text = messages
      .map((m) =>
        `${m.role === 'user' ? 'You' : template.assistantName || 'Assistant'}: ${m.content}`,
      )
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

  const rootClass = `form-rag form-rag--${variant}`;
  const themeStyle = themeToStyle(template.theme);
  const submitLabel = template.submitLabel || 'Start with Grok';
  const inChat = messages.length > 0;

  return (
    <div className={`${rootClass} form-rag__wrapper`} style={themeStyle}>
      <div className={`form-rag__container${inChat ? ' form-rag__container--chat' : ''}`}>
        <header className="form-rag__header">
          {template.icon && (
            <div className="form-rag__icon" aria-hidden>
              {template.icon}
            </div>
          )}
          <div className="form-rag__header-text">
            <div className="form-rag__title" role="heading" aria-level={2}>
              {template.name}
            </div>
            {template.tagline && <p className="form-rag__tagline">{template.tagline}</p>}
            {template.description && (
              <p className="form-rag__description">{template.description}</p>
            )}
          </div>
          {template.highlights?.length > 0 && (
            <ul className="form-rag__highlights">
              {template.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </header>

        {messages.length === 0 && (
          <form className="form-rag__form" onSubmit={submitForm}>
            {fields.map((field) => {
              if (field.type === 'section') {
                return (
                  <div key={field.id} className="form-rag__section">
                    <span className="form-rag__section-label">{field.label}</span>
                  </div>
                );
              }

              const fieldId = `form-rag-${field.id}`;
              const isMulti =
                field.type === 'multi' || field.type === 'multiselect';

              const singleCheckbox = field.type === 'checkbox' && !field.options;

              return (
                <div key={field.id} className="form-rag__field">
                  {!singleCheckbox && (
                    <label className="form-rag__label" htmlFor={fieldId}>
                      {field.label}
                    </label>
                  )}
                  {field.hint && !singleCheckbox && (
                    <p className="form-rag__hint">{field.hint}</p>
                  )}

                  {field.type === 'select' ? (
                    <select
                      id={fieldId}
                      className="form-rag__input"
                      name={field.id}
                      value={data[field.id] || ''}
                      onChange={(e) => handleChange(e, field)}
                      required={field.required}
                    >
                      <option value="">-- Choose --</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={fieldId}
                      className="form-rag__input form-rag__textarea"
                      name={field.id}
                      value={data[field.id] || ''}
                      placeholder={field.placeholder ?? ''}
                      onChange={(e) => handleChange(e, field)}
                      required={field.required}
                      rows={4}
                    />
                  ) : isMulti ? (
                    <div className="form-rag__checkbox-group">
                      {field.options.map((opt) => (
                        <label key={opt.value} className="form-rag__checkbox-item">
                          <input
                            type="checkbox"
                            name={field.id}
                            value={opt.value}
                            checked={(data[field.id] || []).includes(opt.value)}
                            onChange={(e) => handleChange(e, field)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <label className="form-rag__checkbox-item">
                      <input
                        id={fieldId}
                        type="checkbox"
                        name={field.id}
                        checked={Boolean(data[field.id])}
                        onChange={(e) => handleChange(e, field)}
                      />
                      {field.label}
                    </label>
                  ) : (
                    <input
                      id={fieldId}
                      className="form-rag__input"
                      type={field.type}
                      name={field.id}
                      value={data[field.id] ?? ''}
                      placeholder={field.placeholder ?? ''}
                      onChange={(e) => handleChange(e, field)}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                    />
                  )}
                </div>
              );
            })}

            <button className="form-rag__submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="form-rag__spinner" aria-hidden />
                  Generating…
                </>
              ) : (
                submitLabel
              )}
            </button>
          </form>
        )}

        {messages.length > 0 && (
          <div className="form-rag__chat">
            <div className="form-rag__chat-toolbar">
              <span className="form-rag__chat-status">
                {loading ? 'Thinking…' : `Chat with ${template.assistantName || 'assistant'}`}
              </span>
              <div className="form-rag__chat-toolbar-actions">
                <button type="button" className="form-rag__toolbar-btn" onClick={downloadChat}>
                  Save chat
                </button>
                <button type="button" className="form-rag__toolbar-btn" onClick={resetSession}>
                  Start over
                </button>
              </div>
            </div>

            <div className="form-rag__messages" role="log" aria-live="polite">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                const label = isUser ? 'You' : template.assistantName || 'Assistant';
                return (
                  <div
                    key={i}
                    className={`form-rag__row form-rag__row--${msg.role}`}
                  >
                    <div className="form-rag__avatar" aria-hidden>
                      {isUser ? 'You' : template.icon || 'AI'}
                    </div>
                    <div className={`form-rag__bubble form-rag__bubble--${msg.role}`}>
                      <div className="form-rag__bubble-meta">
                        <span className="form-rag__bubble-name">{label}</span>
                        <button
                          type="button"
                          className="form-rag__bubble-save"
                          onClick={() => downloadMessage(msg)}
                          aria-label={`Download ${label} message`}
                        >
                          Save
                        </button>
                      </div>
                      <div className="form-rag__message-content">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="form-rag__row form-rag__row--assistant">
                  <div className="form-rag__avatar" aria-hidden>
                    {template.icon || 'AI'}
                  </div>
                  <div className="form-rag__bubble form-rag__bubble--assistant form-rag__bubble--typing">
                    <span className="form-rag__typing-dot" />
                    <span className="form-rag__typing-dot" />
                    <span className="form-rag__typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="form-rag__composer">
              <label className="form-rag__composer-label" htmlFor="form-rag-chat-input">
                Message
              </label>
              <div className="form-rag__composer-row">
                <textarea
                  id="form-rag-chat-input"
                  className="form-rag__composer-input"
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask a follow-up…"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="form-rag__composer-send"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                >
                  {loading ? '…' : 'Send'}
                </button>
              </div>
              <p className="form-rag__composer-hint">Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
