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
      const formatted = quizData.map((q, i) => {
        return `${i + 1}. ${q.question}
  A. ${q.options.A}
  B. ${q.options.B}
  C. ${q.options.C}
  D. ${q.options.D}
  Answer: ${q.answer}\n`;
      }).join("\n");

      navigator.clipboard.writeText(formatted)
        .then(() => alert("Quiz copied to clipboard!"))
        .catch((err) => alert("Failed to copy: " + err));
    };

    return (
      <div>
        <h1 style={{ color: "white" }}>Quizzon</h1>
        <h2>🎉 Quiz Complete! 🎉</h2>
        <p style={{ color: "lightyellow", fontSize: "40px" }}>
          Score: {score} / {quizData.length}
        </p>

        <button
          style={{
            backgroundColor: "#adece5",
            border: "none",
            borderRadius: "20px",
            margin: "0.5rem",
            padding: "0.5rem 1rem",
            fontWeight: "bold"
          }}
          onClick={handleCopy}
        >
          📋 Copy Quiz
        </button>

        <button
          style={{
            backgroundColor: "#adece5",
            border: "none",
            borderRadius: "20px",
            margin: "0.5rem",
            padding: "0.5rem 1rem",
            fontWeight: "bold"
          }}
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }


  return (
    
    
    <div style={{ padding: "2rem" }}>
      <h1 style={{color: "white"}}>QuiZZync</h1>
      <h3>Question {qIndex + 1}:</h3>
      <p>{current.question}</p>
      {Object.entries(current.options).map(([key, val]) => (
        <div key={key} style={{ marginBottom: "0.5rem" }}>
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={selected}
            style={{
              textAlign: "left",
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              width: "40%",
              border: "none",
              borderRadius: "10px",
              backgroundColor:
                selected
                  ? key === current.answer
                    ? "lightgreen"
                    : selected === key
                      ? "salmon"
                      : "lightyellow"
                  : "lightyellow",

            }}
          >
            {key}. {val}
          </button>
        </div>
        
      ))}
      {selected && (
        <div style={{ marginTop: "1rem" }}>
          {qIndex < quizData.length - 1 ? (
            <button style ={{backgroundColor:"#adece5", border:"None", borderRadius: "20px", margin: "0.5rem",
              padding: "0.5rem 1rem", fontWeight: "bold"}} onClick={next}>Next</button>
          ) : (
            <button style ={{backgroundColor:"#adece5", border:"None", borderRadius: "20px", margin: "0.5rem",
              padding: "0.5rem 1rem", fontWeight: "bold"}} onClick={next}>Finish</button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
