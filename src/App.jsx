import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMappings } from './hooks/useMappings';
import KeySelector from './components/KeySelector';
import PreviewPanel from './components/PreviewPanel';
import MappingList from './components/MappingList';

export default function App() {
  const { mappings, addMapping, updateMapping, deleteMapping, reorderMappings, clearAll } = useMappings();

  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [command, setCommand] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const commandInputRef = useRef(null);

  const clearForm = useCallback(() => {
    setSelectedModifiers([]);
    setSelectedKey(null);
    setCommand('');
    setEditingId(null);
    setError('');
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleAddOrUpdate = useCallback(() => {
    if (!selectedKey) {
      setError('Seleziona un tasto principale dalla griglia.');
      commandInputRef.current?.focus();
      return;
    }
    if (!command.trim()) {
      setError('Inserisci un comando da associare alla combinazione.');
      commandInputRef.current?.focus();
      return;
    }

    if (editingId) {
      updateMapping(editingId, {
        modifiers: selectedModifiers,
        mainKey: selectedKey.label,
        command: command.trim(),
      });
      showToast('Mappatura aggiornata.');
    } else {
      addMapping({
        modifiers: [...selectedModifiers].sort(),
        mainKey: selectedKey.label,
        command: command.trim(),
      });
      showToast('Mappatura aggiunta.');
    }

    clearForm();
    commandInputRef.current?.focus();
  }, [selectedKey, selectedModifiers, command, editingId, addMapping, updateMapping, clearForm, showToast]);

  const handleEdit = useCallback(
    (mapping) => {
      setSelectedModifiers([...mapping.modifiers]);
      setSelectedKey({ label: mapping.mainKey, code: mapping.mainKey });
      setCommand(mapping.command);
      setEditingId(mapping.id);
      setError('');
      commandInputRef.current?.focus();
    },
    []
  );

  const handleDelete = useCallback(
    (id) => {
      if (editingId === id) {
        clearForm();
      }
      deleteMapping(id);
      showToast('Mappatura eliminata.');
    },
    [editingId, deleteMapping, clearForm, showToast]
  );

  const handleClearAll = useCallback(() => {
    if (mappings.length === 0) return;
    clearAll();
    clearForm();
    showToast('Tutte le mappature sono state rimosse.');
  }, [mappings.length, clearAll, clearForm, showToast]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && document.activeElement === commandInputRef.current) {
        e.preventDefault();
        handleAddOrUpdate();
      }
      if (e.key === 'Escape') {
        if (editingId) {
          clearForm();
          showToast('Modifica annullata.');
        } else if (selectedKey || selectedModifiers.length > 0 || command) {
          clearForm();
        }
      }
    },
    [handleAddOrUpdate, editingId, selectedKey, selectedModifiers, command, clearForm, showToast]
  );

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="app" onKeyDown={handleKeyDown}>
      <header className="header">
        <h1 className="header__title">TastiMappa</h1>
        <p className="header__subtitle">
          Associa tasti a comandi in modo visuale. Seleziona, combina, esporta.
        </p>
      </header>

      <main className="main">
        <section className="builder" aria-label="Costruttore mappatura">
          <div className="builder__selector">
            <h2 className="section-title">
              <span className="section-title__num">1</span>
              Combinazione di tasti
            </h2>
            <KeySelector
              selectedModifiers={selectedModifiers}
              onModifiersChange={setSelectedModifiers}
              selectedKey={selectedKey}
              onKeyChange={setSelectedKey}
            />
          </div>

          <div className="builder__command">
            <h2 className="section-title">
              <span className="section-title__num">2</span>
              Comando
            </h2>
            <div className="command-input-group">
              <div className="command-input-wrapper">
                <label htmlFor="command-input" className="sr-only">
                  Comando da associare
                </label>
                <input
                  ref={commandInputRef}
                  id="command-input"
                  type="text"
                  className="command-input"
                  placeholder="es. apri terminale, compila progetto, git push…"
                  value={command}
                  onChange={(e) => {
                    setCommand(e.target.value);
                    if (error) setError('');
                  }}
                  aria-describedby={error ? 'command-error' : undefined}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleAddOrUpdate}
                >
                  {editingId ? 'Aggiorna' : 'Aggiungi'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      clearForm();
                      showToast('Modifica annullata.');
                    }}
                  >
                    Annulla
                  </button>
                )}
              </div>
              {error && (
                <p id="command-error" className="field-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>

        <PreviewPanel modifiers={selectedModifiers} mainKey={selectedKey} command={command} />

        <section className="mappings-section" aria-label="Mappature create">
          <h2 className="section-title">
            <span className="section-title__num">3</span>
            Le tue mappature
          </h2>
          <MappingList
            mappings={mappings}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={reorderMappings}
            onClearAll={handleClearAll}
          />
        </section>
      </main>

      <footer className="footer">
        <p>
          TastiMappa &mdash; i dati sono salvati nel tuo browser. Nessun dato viene mai inviato a server esterni.
        </p>
      </footer>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
