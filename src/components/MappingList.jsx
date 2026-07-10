import React, { useState } from 'react';

function formatCombo(modifiers, mainKey) {
  const ordered = [];
  if (modifiers.includes('Ctrl')) ordered.push('Ctrl');
  if (modifiers.includes('Shift')) ordered.push('Shift');
  if (modifiers.includes('Alt')) ordered.push('Alt');
  if (modifiers.includes('Meta')) ordered.push('Meta');
  if (mainKey) ordered.push(mainKey);
  return ordered.join('+');
}

function exportJSON(mappings) {
  const data = mappings.map((m) => ({
    key: formatCombo(m.modifiers, m.mainKey),
    modifiers: m.modifiers,
    mainKey: m.mainKey,
    command: m.command,
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tastimappa-mappings.json';
  a.click();
  URL.revokeObjectURL(url);
}

function exportTXT(mappings) {
  const lines = mappings.map(
    (m) => `${formatCombo(m.modifiers, m.mainKey)} → ${m.command}`
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tastimappa-mappings.txt';
  a.click();
  URL.revokeObjectURL(url);
}

export default function MappingList({ mappings, onEdit, onDelete, onReorder, onClearAll }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const confirmDelete = (id) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (mappings.length === 0) {
    return (
      <div className="mapping-empty">
        <div className="mapping-empty__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="8" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="10" y="12" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M24 22v8M21 27h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mapping-empty__text">
          Nessuna mappatura creata.
        </p>
        <p className="mapping-empty__hint">
          Seleziona una combinazione di tasti, digita un comando e clicca &laquo;Aggiungi&raquo; per creare la prima mappatura.
        </p>
      </div>
    );
  }

  return (
    <div className="mapping-list-container">
      <div className="mapping-list-toolbar">
        <span className="mapping-list-count">
          {mappings.length} mappatura{mappings.length !== 1 ? 'e' : ''}
        </span>
        <div className="mapping-list-actions">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => exportJSON(mappings)}
            title="Esporta in formato JSON"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            JSON
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => exportTXT(mappings)}
            title="Esporta in formato testo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            TXT
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={onClearAll}
            title="Rimuovi tutte le mappature"
          >
            Rimuovi tutte
          </button>
        </div>
      </div>

      <div className="mapping-list" role="list">
        {mappings.map((mapping, index) => (
          <div
            key={mapping.id}
            className={`mapping-item${dragIndex === index ? ' mapping-item--dragging' : ''}${dragOverIndex === index ? ' mapping-item--drag-over' : ''}`}
            role="listitem"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="mapping-item__grip" aria-label="Trascina per riordinare" tabIndex={0} role="button">
              <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
                <circle cx="3" cy="3" r="1.5" />
                <circle cx="9" cy="3" r="1.5" />
                <circle cx="3" cy="9" r="1.5" />
                <circle cx="9" cy="9" r="1.5" />
                <circle cx="3" cy="15" r="1.5" />
                <circle cx="9" cy="15" r="1.5" />
              </svg>
            </div>

            <div className="mapping-item__combo">
              <span className="key-badge">{formatCombo(mapping.modifiers, mapping.mainKey)}</span>
            </div>

            <div className="mapping-item__arrow" aria-hidden="true">→</div>

            <div className="mapping-item__command">
              <code>{mapping.command}</code>
            </div>

            <div className="mapping-item__actions">
              <button
                type="button"
                className="mapping-item__btn mapping-item__btn--up"
                onClick={() => index > 0 && onReorder(index, index - 1)}
                disabled={index === 0}
                aria-label="Sposta su"
                title="Sposta su"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="mapping-item__btn mapping-item__btn--down"
                onClick={() => index < mappings.length - 1 && onReorder(index, index + 1)}
                disabled={index === mappings.length - 1}
                aria-label="Sposta giù"
                title="Sposta giù"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="mapping-item__btn mapping-item__btn--edit"
                onClick={() => onEdit(mapping)}
                aria-label="Modifica mappatura"
                title="Modifica"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                type="button"
                className={`mapping-item__btn mapping-item__btn--delete${deleteConfirm === mapping.id ? ' mapping-item__btn--confirm' : ''}`}
                onClick={() => confirmDelete(mapping.id)}
                aria-label={deleteConfirm === mapping.id ? 'Conferma eliminazione' : 'Elimina mappatura'}
                title={deleteConfirm === mapping.id ? 'Clicca per confermare' : 'Elimina'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
