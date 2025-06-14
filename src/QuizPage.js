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
        <h2>Quiz Complete!</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="250" height="250" viewBox="0 0 250 250">
            <circle
              cx="125"
              cy="125"
              r="100"
              stroke="rgb(248, 248, 248)" 
              strokeWidth="50"
              fill="none"
            />
            <circle
              cx="125"
              cy="125"
              r="100"
              stroke="rgb(180, 255, 178)"
              strokeWidth="50"
              fill="none"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={
                2 * Math.PI * 100 - (score / quizData.length) * 2 * Math.PI * 100
              }
              strokeLinecap= "butt"
              transform="rotate(-90 125 125)"
            />
            <text
              x="125"
              y="135"
              textAnchor="middle"
              fontSize="36"
              fill="#ffffff"
              fontWeight="bold"
            >
              {Math.round((score / quizData.length) * 100)}%
            </text>
          </svg>



          <p style={{ color: "white", marginTop: "1rem", fontWeight: "bold" , fontSize: "2rem"}}>
            Score: {score} / {quizData.length}
          </p>
        </div>


        <button style={{backgroundColor: "black"}} className="quiz-button" onClick={handleCopy}>
          Copy Quiz
        </button>

        <button style={{backgroundColor: "black"}} className="quiz-button" onClick={() => navigate("/")}>
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
