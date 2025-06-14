import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuizPage({ quizData }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const current = quizData[qIndex];
  const handleClick = (opt) => {
    setSelected(opt);
    if (opt === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setQIndex((q) => q + 1);
  };

  if (!quizData || quizData.length === 0) {
    return <div>No quiz loaded.</div>;
  }

  if (qIndex >= quizData.length) {
    const handleCopy = () => {
      const formatted = quizData
        .map((q, i) => {
          return `${i + 1}. ${q.question}
  A. ${q.options.A}
  B. ${q.options.B}
  C. ${q.options.C}
  D. ${q.options.D}
  Answer: ${q.answer}\n`;
        })
        .join("\n");

      navigator.clipboard
        .writeText(formatted)
        .then(() => alert("Quiz copied to clipboard!"))
        .catch((err) => alert("Failed to copy: " + err));
    };

    return (
      <div className="quiz-container">
        <h1 className="quiz-title">QuiZZync</h1><br/>
        <h2>🎉 Quiz Complete! 🎉</h2>
        <p className="quiz-score">
          Score: {score} / {quizData.length}
        </p>

        <button className="quiz-button" onClick={handleCopy}>
          📋 Copy Quiz
        </button>

        <button className="quiz-button" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      
      <h1 className="quiz-title">QuiZZync</h1>
      
      {/* Progress Indicator */}
      <div className="progress-indicator">
        
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((qIndex + 1) / quizData.length) * 100}%`
            }}
          />
        </div>
        
        <p style={{textAlign: "left", color: "lightyellow"}}>
          Q {qIndex + 1} / {quizData.length}
        </p>
        
      </div>
      
      <h3>Question {qIndex + 1}:</h3>
      <p>{current.question}</p>
      <div className="options-container">
        {Object.entries(current.options).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={selected}
            className={`option-button ${
              selected
                ? key === current.answer
                  ? "correct"
                  : selected === key
                  ? "wrong"
                  : ""
                : ""
            }`}
          >
            {key}. {val}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: "1rem" }}>
          <button style={{float: "right"}} className="quiz-button" onClick={next}>
            {qIndex < quizData.length - 1 ? "Next" : "Finish"}
          </button>

        </div>
        

      )}
      <button style={{position: "fixed", bottom: "20px", right: "20px", width: "150px", backgroundColor: "black"}} className="quiz-button" onClick={() => navigate("/")}>
          Back Home
      </button>
      
      
    </div>
  );
}

export default QuizPage;
