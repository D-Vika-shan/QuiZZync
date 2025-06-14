import React, { useState } from 'react';

const MCQDisplay = ({ quizData, onPlayAgain }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const currentQuestion = quizData[currentQuestionIndex];

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            setQuizCompleted(true);
        }
    };

    return (
        <div>
            <h2>Quiz</h2>
            {!quizCompleted ? (
                <div>
                    {currentQuestion ? (
                        <div>
                            <p>{`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`}</p>
                            {Object.keys(currentQuestion.options).map(option => (
                                <div key={option}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="options"
                                            value={option}
                                            checked={selectedOption === option}
                                            onChange={() => setSelectedOption(option)}
                                        />
                                        {`${option}. ${currentQuestion.options[option]}`}
                                    </label>
                                </div>
                            ))}
                            <p>
                                {selectedOption === currentQuestion.answer
                                    ? "✅ Correct!"
                                    : selectedOption ? "❌ Incorrect!" : ""}
                            </p>
                            <button onClick={handleNextQuestion}>➡️ Next Question</button>
                        </div>
                    ) : (
                        <p>Loading questions...</p> // Fallback message
                    )}
                </div>
            ) : (
                <div>
                    <p>🎉 Quiz Completed!</p>
                    <button onClick={onPlayAgain}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default MCQDisplay;
