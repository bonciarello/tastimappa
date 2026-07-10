import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('TastiMappa', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* jsdom senza --localstorage-file */ }
  });

  it('rende il titolo dell\'app', () => {
    render(<App />);
    expect(screen.getByText('TastiMappa')).toBeInTheDocument();
  });

  it('rende il sottotitolo descrittivo', () => {
    render(<App />);
    expect(
      screen.getByText(/Associa tasti a comandi in modo visuale/)
    ).toBeInTheDocument();
  });

  it('rende i modificatori (Ctrl, Shift, Alt, Meta)', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Ctrl/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shift/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Meta/i })).toBeInTheDocument();
  });

  it('rende la griglia di tasti con il tasto Q', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Q' })).toBeInTheDocument();
  });

  it('rende il campo di input per il comando', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/apri terminale/i);
    expect(input).toBeInTheDocument();
  });

  it('mostra lo stato vuoto quando non ci sono mappature', () => {
    render(<App />);
    expect(screen.getByText(/Nessuna mappatura creata/)).toBeInTheDocument();
  });

  it('mostra errore se si prova ad aggiungere senza selezionare un tasto', async () => {
    const user = userEvent.setup();
    render(<App />);

    const addBtn = screen.getByRole('button', { name: /Aggiungi/i });
    await user.click(addBtn);

    expect(
      screen.getByText(/Seleziona un tasto principale/)
    ).toBeInTheDocument();
  });

  it('mostra errore se si prova ad aggiungere senza comando', async () => {
    const user = userEvent.setup();
    render(<App />);

    const keyQ = screen.getByRole('button', { name: 'Q' });
    await user.click(keyQ);

    const addBtn = screen.getByRole('button', { name: /Aggiungi/i });
    await user.click(addBtn);

    expect(
      screen.getByText(/Inserisci un comando/)
    ).toBeInTheDocument();
  });

  it('aggiunge una mappatura quando tasto e comando sono validi', async () => {
    const user = userEvent.setup();
    render(<App />);

    const keyQ = screen.getByRole('button', { name: 'Q' });
    await user.click(keyQ);

    const input = screen.getByPlaceholderText(/apri terminale/i);
    await user.type(input, 'apri finestra');

    const addBtn = screen.getByRole('button', { name: /Aggiungi/i });
    await user.click(addBtn);

    const qElements = screen.getAllByText('Q');
    expect(qElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('apri finestra')).toBeInTheDocument();
    expect(screen.queryByText(/Nessuna mappatura creata/)).not.toBeInTheDocument();
  });

  it('aggiunge una mappatura con modificatori', async () => {
    const user = userEvent.setup();
    render(<App />);

    const ctrlBtn = screen.getByRole('button', { name: /Ctrl/i });
    await user.click(ctrlBtn);

    const keyA = screen.getByRole('button', { name: 'A' });
    await user.click(keyA);

    const input = screen.getByPlaceholderText(/apri terminale/i);
    await user.type(input, 'seleziona tutto');

    const addBtn = screen.getByRole('button', { name: /Aggiungi/i });
    await user.click(addBtn);

    expect(screen.getByText('Ctrl+A')).toBeInTheDocument();
    expect(screen.getByText('seleziona tutto')).toBeInTheDocument();
  });

  it('rende il footer con informazione sulla privacy', () => {
    render(<App />);
    expect(
      screen.getByText(/Nessun dato viene mai inviato a server esterni/)
    ).toBeInTheDocument();
  });
});
