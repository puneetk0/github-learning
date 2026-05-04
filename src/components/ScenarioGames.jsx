import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import './ScenarioGames.css';

const SCENARIOS = [
  {
    id: 1,
    title: 'The Unfinished Feature',
    context: 'You are on the "main" branch. You realize you need to build a new feature, but your boss just told you not to break the stable version currently on "main".',
    question: 'What is the absolute first thing you should do?',
    options: [
      { text: 'Start coding immediately on main', correct: false, feedback: 'If you code on main, your changes will mix with production code, breaking the stable version.' },
      { text: 'Create and switch to a new branch', correct: true, feedback: 'Exactly. A new branch creates an isolated environment where you can work safely.' },
      { text: 'Run git reset --hard', correct: false, feedback: 'That would delete any uncommitted work you might have. Not helpful here.' }
    ]
  },
  {
    id: 2,
    title: 'The Premature Push',
    context: 'You just typed "git commit -m \'fix bug\'". Then you realized you forgot to add the actual file that fixes the bug.',
    question: 'You haven\'t pushed yet. What is the cleanest way to fix this?',
    options: [
      { text: 'Make a second commit called "forgot file"', correct: false, feedback: 'While this works, it clutters the history. There is a cleaner way.' },
      { text: 'git reset --hard', correct: false, feedback: 'Wait! This will delete the bug fix entirely from your disk.' },
      { text: 'Stage the file, then git commit --amend', correct: true, feedback: 'Perfect. This folds the forgotten file into the previous commit seamlessly.' }
    ]
  }
];

export default function ScenarioGames() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = SCENARIOS[currentScenario];

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
  };

  const nextScenario = () => {
    setCurrentScenario(prev => (prev + 1) % SCENARIOS.length);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="scenario-games">
      <div className="sg-header">
        <Target size={18} color="var(--accent)" />
        <span className="sg-title">Scenario Challenge {currentScenario + 1}/{SCENARIOS.length}</span>
      </div>

      <div className="sg-content">
        <h3 className="sg-scenario-title">{scenario.title}</h3>
        <p className="sg-context">{scenario.context}</p>
        <div className="sg-question">{scenario.question}</div>

        <div className="sg-options">
          {scenario.options.map((opt, idx) => {
            let className = "sg-opt";
            if (showFeedback) {
              if (idx === selectedOption) {
                className += opt.correct ? " selected correct" : " selected wrong";
              } else if (opt.correct) {
                className += " correct-unselected";
              }
            }

            return (
              <button 
                key={idx} 
                className={className} 
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
              >
                <div className="sg-opt-marker">
                  {showFeedback && idx === selectedOption && (opt.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />)}
                </div>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`sg-feedback ${scenario.options[selectedOption].correct ? 'correct' : 'wrong'}`}>
            <p>{scenario.options[selectedOption].feedback}</p>
            <button className="sg-next-btn" onClick={nextScenario}>
              Next Scenario <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
