"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";

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
      onComplete?.(score);
    }
  }

  if (isFinished) {
    const correct = answers.filter(
      (a, i) => a === questions[i].correctIndex,
    ).length;
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">{title} — Complete!</h3>
        <p className="text-2xl font-bold text-blue-400">
          {correct}/{questions.length} correct ({Math.round((correct / questions.length) * 100)}%)
        </p>
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