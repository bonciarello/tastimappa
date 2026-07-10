import React from 'react';

function formatCombo(modifiers, mainKey) {
  const ordered = [];
  if (modifiers.includes('Ctrl')) ordered.push('Ctrl');
  if (modifiers.includes('Shift')) ordered.push('Shift');
  if (modifiers.includes('Alt')) ordered.push('Alt');
  if (modifiers.includes('Meta')) ordered.push('Meta');
  if (mainKey) ordered.push(mainKey.label);
  return ordered.length > 0 ? ordered.join(' + ') : '—';
}

export default function PreviewPanel({ modifiers, mainKey, command }) {
  const combo = formatCombo(modifiers, mainKey);
  const hasKey = mainKey !== null;
  const hasCommand = command.trim().length > 0;
  const isComplete = hasKey && hasCommand;

  return (
    <div className={`preview-panel${isComplete ? ' preview-panel--complete' : ''}`} aria-live="polite">
      <div className="preview-panel__inner">
        <div className="preview-panel__combo">
          <span className="preview-panel__label">Combinazione</span>
          <span className={`preview-panel__combo-text${!hasKey ? ' preview-panel__combo-text--empty' : ''}`}>
            {combo}
          </span>
        </div>

        <div className="preview-panel__cable" aria-hidden="true">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="patch-cable-svg">
            <path
              d="M 10,20 C 60,2 140,38 190,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              className={`patch-cable-path${isComplete ? ' patch-cable-path--active' : ''}`}
            />
            <circle cx="10" cy="20" r="3" fill="currentColor" className={`patch-cable-plug${hasKey ? ' patch-cable-plug--active' : ''}`} />
            <circle cx="190" cy="20" r="3" fill="currentColor" className={`patch-cable-plug${hasCommand ? ' patch-cable-plug--active' : ''}`} />
          </svg>
        </div>

        <div className="preview-panel__command">
          <span className="preview-panel__label">Comando</span>
          <span className={`preview-panel__command-text${!hasCommand ? ' preview-panel__command-text--empty' : ''}`}>
            {hasCommand ? command : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
