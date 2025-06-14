import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import QuizPage from "./QuizPage";

function App() {
  const [quizData, setQuizData] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage setQuizData={setQuizData} />} />
        <Route path="/quiz" element={<QuizPage quizData={quizData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
