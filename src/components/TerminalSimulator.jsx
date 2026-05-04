import React, { useState, useRef, useEffect } from 'react';
import './TerminalSimulator.css';

export default function TerminalSimulator({ initialPath = '~/project', availableCommands = [], onCommand }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newEntry = { path: initialPath, cmd };
      
      let output = [];
      if (cmd !== '') {
        if (cmd === 'clear') {
          setHistory([]);
          setInput('');
          return;
        } else if (onCommand) {
          output = onCommand(cmd);
        } else {
          output = [{ type: 'error', text: `command not found: ${cmd.split(' ')[0]}` }];
        }
        setCmdHistory(prev => [...prev, cmd]);
      }
      
      setHistory(prev => [...prev, { ...newEntry, output }]);
      setInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      if (availableCommands.length > 0) {
        const match = availableCommands.find(c => c.startsWith(input));
        if (match) setInput(match);
      }
    }
  };

  return (
    <div className="terminal-simulator" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="t-dot red"></div>
        <div className="t-dot yellow"></div>
        <div className="t-dot green"></div>
        <div className="terminal-title">bash - {initialPath}</div>
      </div>
      <div className="terminal-body">
        {history.map((entry, i) => (
          <div key={i} className="t-history-block">
            <div className="t-prompt-line">
              <span className="t-prompt">➜</span>
              <span className="t-path">{entry.path}</span>
              <span className="t-cmd">{entry.cmd}</span>
            </div>
            {entry.output && entry.output.map((out, j) => (
              <div key={j} className={`t-output t-${out.type}`}>{out.text}</div>
            ))}
          </div>
        ))}
        <div className="t-input-line">
          <span className="t-prompt">➜</span>
          <span className="t-path">{initialPath}</span>
          <input
            ref={inputRef}
            type="text"
            className="t-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            spellCheck="false"
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
