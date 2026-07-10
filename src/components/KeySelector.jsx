import React, { useState } from 'react';

const MODIFIERS = [
  { id: 'Ctrl', label: 'Ctrl', symbol: '⌃' },
  { id: 'Shift', label: 'Shift', symbol: '⇧' },
  { id: 'Alt', label: 'Alt', symbol: '⌥' },
  { id: 'Meta', label: 'Meta', symbol: '⌘' },
];

const ALPHA_ROWS = [
  [
    { label: '`', code: 'Backquote' },
    { label: '1', code: 'Digit1' },
    { label: '2', code: 'Digit2' },
    { label: '3', code: 'Digit3' },
    { label: '4', code: 'Digit4' },
    { label: '5', code: 'Digit5' },
    { label: '6', code: 'Digit6' },
    { label: '7', code: 'Digit7' },
    { label: '8', code: 'Digit8' },
    { label: '9', code: 'Digit9' },
    { label: '0', code: 'Digit0' },
    { label: '-', code: 'Minus' },
    { label: '=', code: 'Equal' },
    { label: '⌫', code: 'Backspace', wide: true },
  ],
  [
    { label: 'Tab', code: 'Tab', wide: true },
    { label: 'Q', code: 'KeyQ' },
    { label: 'W', code: 'KeyW' },
    { label: 'E', code: 'KeyE' },
    { label: 'R', code: 'KeyR' },
    { label: 'T', code: 'KeyT' },
    { label: 'Y', code: 'KeyY' },
    { label: 'U', code: 'KeyU' },
    { label: 'I', code: 'KeyI' },
    { label: 'O', code: 'KeyO' },
    { label: 'P', code: 'KeyP' },
    { label: '[', code: 'BracketLeft' },
    { label: ']', code: 'BracketRight' },
    { label: '\\', code: 'Backslash', wide: true },
  ],
  [
    { label: 'Caps', code: 'CapsLock', wide: true },
    { label: 'A', code: 'KeyA' },
    { label: 'S', code: 'KeyS' },
    { label: 'D', code: 'KeyD' },
    { label: 'F', code: 'KeyF' },
    { label: 'G', code: 'KeyG' },
    { label: 'H', code: 'KeyH' },
    { label: 'J', code: 'KeyJ' },
    { label: 'K', code: 'KeyK' },
    { label: 'L', code: 'KeyL' },
    { label: ';', code: 'Semicolon' },
    { label: "'", code: 'Quote' },
    { label: '↵', code: 'Enter', wide: true },
  ],
  [
    { label: 'Z', code: 'KeyZ' },
    { label: 'X', code: 'KeyX' },
    { label: 'C', code: 'KeyC' },
    { label: 'V', code: 'KeyV' },
    { label: 'B', code: 'KeyB' },
    { label: 'N', code: 'KeyN' },
    { label: 'M', code: 'KeyM' },
    { label: ',', code: 'Comma' },
    { label: '.', code: 'Period' },
    { label: '/', code: 'Slash' },
  ],
  [
    { label: 'Spazio', code: 'Space', wide: true, spacebar: true },
  ],
];

const NAV_KEYS = [
  { label: '↑', code: 'ArrowUp' },
  { label: '↓', code: 'ArrowDown' },
  { label: '←', code: 'ArrowLeft' },
  { label: '→', code: 'ArrowRight' },
  { label: 'Home', code: 'Home' },
  { label: 'End', code: 'End' },
  { label: 'PgUp', code: 'PageUp' },
  { label: 'PgDn', code: 'PageDown' },
  { label: 'Ins', code: 'Insert' },
  { label: 'Del', code: 'Delete' },
  { label: 'Esc', code: 'Escape' },
  { label: 'Stamp', code: 'PrintScreen' },
  { label: 'Bloc Scorr', code: 'ScrollLock' },
  { label: 'Pausa', code: 'Pause' },
];

const FUNCTION_KEYS = Array.from({ length: 12 }, (_, i) => ({
  label: `F${i + 1}`,
  code: `F${i + 1}`,
}));

export default function KeySelector({ selectedModifiers, onModifiersChange, selectedKey, onKeyChange }) {
  const [activeSection, setActiveSection] = useState('alpha');

  const toggleModifier = (modId) => {
    if (selectedModifiers.includes(modId)) {
      onModifiersChange(selectedModifiers.filter((m) => m !== modId));
    } else {
      onModifiersChange([...selectedModifiers, modId]);
    }
  };

  const handleKeyClick = (keyDef) => {
    if (selectedKey && selectedKey.code === keyDef.code) {
      onKeyChange(null);
    } else {
      onKeyChange(keyDef);
    }
  };

  return (
    <div className="key-selector">
      <div className="modifier-toggles" role="group" aria-label="Tasti modificatori">
        <span className="modifier-toggles__label">Modificatori</span>
        <div className="modifier-toggles__row">
          {MODIFIERS.map((mod) => (
            <button
              key={mod.id}
              type="button"
              className={`modifier-toggle${selectedModifiers.includes(mod.id) ? ' modifier-toggle--active' : ''}`}
              onClick={() => toggleModifier(mod.id)}
              aria-pressed={selectedModifiers.includes(mod.id)}
            >
              <span className="modifier-toggle__symbol">{mod.symbol}</span>
              <span className="modifier-toggle__label">{mod.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="key-grid-container">
        <div className="key-grid-tabs" role="tablist" aria-label="Categorie tasti">
          {[
            { id: 'alpha', label: 'QWERTY' },
            { id: 'nav', label: 'Navigazione' },
            { id: 'fn', label: 'F1–F12' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`key-grid-tab${activeSection === tab.id ? ' key-grid-tab--active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
              aria-selected={activeSection === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="key-grid" role="grid" aria-label="Tasti disponibili">
          {activeSection === 'alpha' &&
            ALPHA_ROWS.map((row, ri) => (
              <div key={ri} className="key-grid__row">
                {row.map((keyDef) => {
                  const isSelected = selectedKey && selectedKey.code === keyDef.code;
                  return (
                    <button
                      key={keyDef.code}
                      type="button"
                      className={`key-btn${isSelected ? ' key-btn--selected' : ''}${keyDef.wide ? ' key-btn--wide' : ''}${keyDef.spacebar ? ' key-btn--spacebar' : ''}`}
                      onClick={() => handleKeyClick(keyDef)}
                      aria-label={keyDef.label}
                      aria-pressed={isSelected}
                    >
                      {keyDef.label}
                    </button>
                  );
                })}
              </div>
            ))}

          {activeSection === 'nav' && (
            <div className="key-grid__flat">
              {NAV_KEYS.map((keyDef) => {
                const isSelected = selectedKey && selectedKey.code === keyDef.code;
                return (
                  <button
                    key={keyDef.code}
                    type="button"
                    className={`key-btn${isSelected ? ' key-btn--selected' : ''}`}
                    onClick={() => handleKeyClick(keyDef)}
                    aria-label={keyDef.label}
                    aria-pressed={isSelected}
                  >
                    {keyDef.label}
                  </button>
                );
              })}
            </div>
          )}

          {activeSection === 'fn' && (
            <div className="key-grid__flat">
              {FUNCTION_KEYS.map((keyDef) => {
                const isSelected = selectedKey && selectedKey.code === keyDef.code;
                return (
                  <button
                    key={keyDef.code}
                    type="button"
                    className={`key-btn${isSelected ? ' key-btn--selected' : ''}`}
                    onClick={() => handleKeyClick(keyDef)}
                    aria-label={keyDef.label}
                    aria-pressed={isSelected}
                  >
                    {keyDef.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
