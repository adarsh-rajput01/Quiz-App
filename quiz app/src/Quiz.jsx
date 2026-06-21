import React, { useState, useEffect } from "react";
import { questions } from "./data";

function Quiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const highScore = localStorage.getItem("highScore") || 0;

  const startQuiz = () => {
    const shuffledQuestions = [...questions].sort(
      () => Math.random() - 0.5
    );

    setQuizQuestions(shuffledQuestions);
    setQuizStarted(true);
    setCurrent(0);
    setScore(0);
    setTime(15);
    setShowResult(false);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);

    const isCorrect =
      option === quizQuestions[current].answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const next = current + 1;

      if (next < quizQuestions.length) {
        setCurrent(next);
        setTime(15);
        setSelectedAnswer(null);
      } else {
        const finalScore = isCorrect
          ? score + 1
          : score;

        if (finalScore > highScore) {
          localStorage.setItem(
            "highScore",
            finalScore
          );
        }

        setShowResult(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setShowResult(false);
    setCurrent(0);
    setScore(0);
    setTime(15);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (
      !quizStarted ||
      showResult ||
      selectedAnswer
    )
      return;

    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (time === 0) {
      handleAnswer("");
    }
  }, [
    time,
    quizStarted,
    showResult,
    selectedAnswer,
  ]);

  const percentage =
    quizQuestions.length > 0
      ? Math.round(
          (score / quizQuestions.length) * 100
        )
      : 0;

  const progress =
    quizQuestions.length > 0
      ? ((current + 1) /
          quizQuestions.length) *
        100
      : 0;

  return (
    <div
      className={
        darkMode
          ? "quiz-container dark"
          : "quiz-container"
      }
    >
      <div className="top-bar">
        <button
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {!quizStarted ? (
        <div className="start-screen">
          <h2>Welcome to React Quiz App</h2>

          <p>
            Test your knowledge and improve
            your score.
          </p>

          <button
            className="primary-btn"
            onClick={startQuiz}
          >
            Start Quiz
          </button>

          <p className="high-score">
            High Score: {highScore}
          </p>
        </div>
      ) : showResult ? (
        <div className="result-screen">
          <h2>Quiz Finished</h2>

          <h1>{percentage}%</h1>

          <p>
            Score: {score} /{" "}
            {quizQuestions.length}
          </p>

          <p className="message">
            {percentage >= 80
              ? "Excellent!"
              : percentage >= 50
              ? "Good Job!"
              : "Keep Practicing!"}
          </p>

          <button
            className="primary-btn"
            onClick={restartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <>
          <h2>
            {quizQuestions[current]?.question}
          </h2>

          <div className="info-row">
            <span>
              Question {current + 1}/
              {quizQuestions.length}
            </span>

            <span>Score: {score}</span>

            <span>{time}s</span>
          </div>

          <div className="options">
            {quizQuestions[
              current
            ]?.options.map(
              (option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswer(option)
                  }
                  className={
                    selectedAnswer
                      ? option ===
                        quizQuestions[
                          current
                        ].answer
                        ? "correct"
                        : option ===
                          selectedAnswer
                        ? "wrong"
                        : ""
                      : ""
                  }
                >
                  {option}
                </button>
              )
            )}
          </div>

          <div className="progress-bar">
            <div
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;