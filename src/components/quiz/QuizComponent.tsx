"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";
import CelebrationEffect from "@/components/celebration/CelebrationEffect";

interface QuizComponentProps {
  questions: QuizQuestion[];
  title: string;
  onComplete?: (score: number) => void;
}

export default function QuizComponent({
  questions,
  title,
  onComplete,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [isFinished, setIsFinished] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctIndex;

  function handleSelect(index: number) {
    if (showResult) return;
    setSelectedAnswer(index);
  }

  function handleSubmit() {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      const correct = answers.filter(
        (a, i) => a === questions[i].correctIndex,
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      setFinalScore(score);
      if (score >= 70) setCelebrate(true);
      onComplete?.(score);
    }
  }

  if (isFinished) {
    const correct = answers.filter(
      (a, i) => a === questions[i].correctIndex,
    ).length;
    const passed = finalScore >= 70;
    return (
      <>
        <CelebrationEffect trigger={celebrate} score={finalScore} onDone={() => setCelebrate(false)} />
        <div className={`rounded-lg border p-6 ${passed ? "border-green-500/30 bg-gradient-to-b from-gray-900 to-green-950/20" : "border-gray-700 bg-gray-900"}`}>
          <div className="mb-4 flex items-center gap-3">
            {passed && <span className="text-3xl">{finalScore === 100 ? "👑" : "🎉"}</span>}
            <div>
              <h3 className="text-xl font-bold text-white">{title} — Complete!</h3>
              <p className="text-sm text-gray-400">
                {passed
                  ? finalScore === 100
                    ? "Perfect score! You've mastered this topic!"
                    : "Great job! You passed the quiz!"
                  : "Keep studying and try again!"}
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <div className={`text-3xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
              {finalScore}%
            </div>
            <div>
              <p className="text-sm text-gray-400">{correct}/{questions.length} correct</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${passed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                {passed ? "Passed" : "Failed — need 70%"}
              </span>
            </div>
          </div>
        <div className="mt-6 space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="text-sm">
              <p className={answers[i] === q.correctIndex ? "text-green-400" : "text-red-400"}>
                {i + 1}. {q.question}
              </p>
              {answers[i] !== q.correctIndex && (
                <p className="mt-1 text-gray-400">
                  Correct answer: {q.options[q.correctIndex]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-sm text-gray-400">
          {currentQuestion + 1}/{questions.length}
        </span>
      </div>

      <p className="mb-4 text-white">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          let borderColor = "border-gray-700 hover:border-gray-500";
          let bgColor = "";

          if (showResult) {
            if (index === question.correctIndex) {
              borderColor = "border-green-500";
              bgColor = "bg-green-600/10";
            } else if (index === selectedAnswer && !isCorrect) {
              borderColor = "border-red-500";
              bgColor = "bg-red-600/10";
            }
          } else if (index === selectedAnswer) {
            borderColor = "border-blue-500";
            bgColor = "bg-blue-600/10";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${borderColor} ${bgColor} ${
                showResult ? "cursor-default" : "cursor-pointer"
              } ${
                !showResult && index !== selectedAnswer
                  ? "text-gray-300"
                  : "text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 rounded-lg bg-gray-800 p-3 text-sm">
          <p className={isCorrect ? "font-semibold text-green-400" : "font-semibold text-red-400"}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p className="mt-1 text-gray-400">{question.explanation}</p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}