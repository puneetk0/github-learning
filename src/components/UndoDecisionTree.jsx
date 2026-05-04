import React, { useState } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import './UndoDecisionTree.css';

const TREE = {
  id: 'start',
  question: 'Where is the mistake?',
  options: [
    {
      label: 'In my working directory (uncommitted)',
      next: {
        id: 'working',
        question: 'Are the files tracked or untracked?',
        options: [
          {
            label: 'Tracked (modified)',
            result: { cmd: 'git restore <file>', desc: 'Discards changes in working directory' }
          },
          {
            label: 'Untracked (new files)',
            result: { cmd: 'git clean -fd', desc: 'Removes untracked files and directories', warn: true }
          }
        ]
      }
    },
    {
      label: 'It is already staged (git add)',
      result: { cmd: 'git restore --staged <file>', desc: 'Unstages the file, keeping modifications' }
    },
    {
      label: 'I already committed it',
      next: {
        id: 'committed',
        question: 'Have you pushed the commit to a shared remote?',
        options: [
          {
            label: 'Yes, others might have it',
            result: { cmd: 'git revert <commit>', desc: 'Creates a new commit that undoes the previous one. Safe for shared history.' }
          },
          {
            label: 'No, it is only local',
            next: {
              id: 'local_commit',
              question: 'Do you want to keep the file changes?',
              options: [
                {
                  label: 'Yes, keep changes',
                  result: { cmd: 'git reset --soft HEAD~1', desc: 'Moves HEAD back, but keeps files staged.' }
                },
                {
                  label: 'No, nuke it all',
                  result: { cmd: 'git reset --hard HEAD~1', desc: 'Moves HEAD back AND discards all changes.', warn: true }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

export default function UndoDecisionTree() {
  const [history, setHistory] = useState([TREE]);

  const currentNode = history[history.length - 1];

  const handleOption = (option) => {
    if (option.next) {
      setHistory([...history, option.next]);
    } else if (option.result) {
      setHistory([...history, { result: option.result }]);
    }
  };

  const reset = () => {
    setHistory([TREE]);
  };

  return (
    <div className="undo-tree">
      <div className="ut-header">
        <RotateCcw size={18} color="var(--accent)" />
        <span className="ut-title">The Undo Flowchart</span>
        {history.length > 1 && (
          <button className="ut-reset" onClick={reset}>Start Over</button>
        )}
      </div>

      <div className="ut-path">
        {history.map((node, i) => {
          if (i === history.length - 1) return null;
          // Find what option they picked to get to the next node
          const nextNode = history[i + 1];
          const choice = node.options?.find(o => o.next === nextNode || o.result === nextNode.result)?.label;
          return (
            <div key={i} className="ut-breadcrumb">
              <span className="ut-crumb-q">{node.question}</span>
              <ArrowRight size={12} className="ut-crumb-arrow" />
              <span className="ut-crumb-a">{choice}</span>
            </div>
          );
        })}
      </div>

      <div className="ut-current">
        {currentNode.question && (
          <>
            <h3 className="ut-question">{currentNode.question}</h3>
            <div className="ut-options">
              {currentNode.options.map((opt, i) => (
                <button key={i} className="ut-option-btn" onClick={() => handleOption(opt)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {currentNode.result && (
          <div className={`ut-result ${currentNode.result.warn ? 'warn' : ''}`}>
            <div className="ut-result-badge">Result Command</div>
            <code className="ut-result-cmd">{currentNode.result.cmd}</code>
            <p className="ut-result-desc">{currentNode.result.desc}</p>
            {currentNode.result.warn && (
              <div className="ut-result-warn">
                <AlertTriangle size={14} /> Warning: This action is destructive and cannot easily be undone.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
