import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
console.log("Gemini key", process.env.REACT_APP_GEMINI_API_KEY);
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function MainPage({ setQuizData }) {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10); // Default 10

  const navigate = useNavigate();

  const extractText = async (file) => {
    if (file.type === "application/pdf") {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let text = "";
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      return text;
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (file.type.startsWith("text/")) {
      return await file.text();
    }
    return "";
  };

  const generateMCQs = async (text) => {
  const prompt = `
    Generate ${numQuestions} multiple choice questions (MCQs) from the passage below.

    Each question must follow this format:
    1. Question?
    A. Option A
    B. Option B
    C. Option C
    D. Option D
    Answer: [A/B/C/D] (the "[]" must be included)

    Passage:
    """${text}"""`;


    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Gemini full response:", response.data);
    const resultText = response.data.candidates[0].content.parts[0].text;
    console.log("Extracted result text:", resultText);

    const mcqRegex = /\d+\.\s*(.*?)\n\s*A\.\s*(.*?)\n\s*B\.\s*(.*?)\n\s*C\.\s*(.*?)\n\s*D\.\s*(.*?)\n\s*Answer:\s*\[([A-D])\]/g;


    let match, quiz = [];
    while ((match = mcqRegex.exec(resultText)) !== null) {
    quiz.push({
        question: match[1].trim(),
        options: {
        A: match[2].trim(),
        B: match[3].trim(),
        C: match[4].trim(),
        D: match[5].trim(),
        },
        answer: match[6].trim(),
    });
    }

    console.log("Parsed Quiz Array:", quiz);
    return quiz;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalText = inputText.trim();
    const file = e.target.file.files[0];

    if (file && !finalText) {
      finalText = await extractText(file);
    }

    if (!finalText) {
      alert("Please enter text or upload a file.");
      setLoading(false);
      return;
    }

    try {
        const quiz = await generateMCQs(finalText);
        console.log("Parsed Quiz Array:", quiz);
        if (quiz.length === 0) {
            alert("No questions generated.");
            return;
        }
        setQuizData(quiz);
        navigate("/quiz");
        } catch (error) {
            console.error(error);
            alert("Error generating MCQs.");
        }
        finally {
            setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{color: "white"}}>QuiZZync</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="8"
          style={{ width: "100%", maxWidth: "600px" }}
          placeholder="Type your passage..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <br /><br/>
        <label style={{ 
            backgroundColor: "lightyellow", 
            padding: "10px", 
            borderRadius: "20px", 
            cursor: "pointer", 
            fontWeight: "bold",
            display: "inline-block" 
            }}>
            📁 Upload File
            <input 
                type="file" 
                name="file" 
                accept=".txt,.pdf,.docx" 
                style={{ display: "none" }} 
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFileName(file.name);
                }}
                />

            </label>
            {fileName && (
                <div style={{ marginTop: "10px", color: "white" }}>
                    Selected file: <strong>{fileName}</strong>
                </div>
                )}

        <br /><br/>
        <label style={{ color: "white", fontWeight: "bold" }}>
        Number of Questions:
        <input
            type="number"
            min="1"
            max="50"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            style={{
            marginLeft: "10px",
            padding: "5px 10px",
            borderRadius: "10px",
            border: "none",
            width: "60px"
            }}
        />
        </label>

        <br /><br />

        <button style={{ 
            backgroundColor:"#5e6778", 
            color: "white",
            padding: "10px", 
            borderRadius: "20px", 
            cursor: "pointer", 
            border: "none",
            fontWeight: "bold",
            display: "inline-block" 
            }} type="submit" disabled={loading}>
          {loading ? "Generating..." : "⚙️ Generate MCQs"}
        </button>
      </form>
    </div>
  );
}

export default MainPage;
