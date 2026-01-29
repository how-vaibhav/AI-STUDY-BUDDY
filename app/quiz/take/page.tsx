"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Target, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | null;
}

interface Quiz {
  id: string;
  day: number;
  subject: string;
  questions: Question[];
  score: number | null;
  completed: boolean;
  startedAt: Date | null;
}

export default function QuizTakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");
  const day = searchParams.get("day");
  const topic = searchParams.get("topic") || "oscillation";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!quizId && day) {
      // Create new quiz
      initializeQuiz();
    } else if (quizId) {
      // Load existing quiz
      loadQuiz();
    }
  }, [quizId, day, topic]);

  const initializeQuiz = async () => {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          subject: "physics",
          difficulty: "medium",
        }),
      });

      const data = await response.json();

      if (data.success && data.questions && data.questions.length > 0) {
        const formattedQuestions: Question[] = data.questions.map(
          (q: any, index: number) => {
            // Find the correct answer index in the shuffled options
            const correctAnswerIndex = q.options.indexOf(q.correctAnswerText);
            return {
              id: String(index + 1),
              text: q.text,
              options: q.options,
              correctAnswer:
                correctAnswerIndex !== -1
                  ? correctAnswerIndex
                  : q.correctAnswer || 0,
              userAnswer: null,
            };
          },
        );

        const newQuiz: Quiz = {
          id: Date.now().toString(),
          day: parseInt(day || "1"),
          subject: `${data.topic} - Quiz`,
          questions: formattedQuestions,
          score: null,
          completed: false,
          startedAt: new Date(),
        };

        setQuiz(newQuiz);
        setAnswers(new Array(formattedQuestions.length).fill(null));
      } else {
        throw new Error("Failed to fetch quiz questions");
      }
    } catch (error) {
      console.error("Error initializing quiz:", error);
      // Fallback to mock questions if API fails
      const mockQuestions: Question[] = [
        {
          id: "1",
          text: "What is the derivative of x²?",
          options: ["2x", "x", "2", "x²"],
          correctAnswer: 0,
          userAnswer: null,
        },
        {
          id: "2",
          text: "What is the integral of 2x?",
          options: ["2", "x²", "x² + C", "2x + C"],
          correctAnswer: 2,
          userAnswer: null,
        },
        {
          id: "3",
          text: "What is lim(x→0) sin(x)/x?",
          options: ["0", "1", "undefined", "∞"],
          correctAnswer: 1,
          userAnswer: null,
        },
        {
          id: "4",
          text: "What is the sum of angles in a triangle?",
          options: ["90°", "180°", "270°", "360°"],
          correctAnswer: 1,
          userAnswer: null,
        },
        {
          id: "5",
          text: "What is e approximately equal to?",
          options: ["2.17", "2.71", "3.14", "1.41"],
          correctAnswer: 1,
          userAnswer: null,
        },
      ];

      const newQuiz: Quiz = {
        id: Date.now().toString(),
        day: parseInt(day || "1"),
        subject: `Day ${day} Quiz`,
        questions: mockQuestions,
        score: null,
        completed: false,
        startedAt: new Date(),
      };

      setQuiz(newQuiz);
      setAnswers(new Array(mockQuestions.length).fill(null));
    } finally {
      setLoading(false);
    }
  };

  const loadQuiz = async () => {
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get",
          quizId,
          userId: "current-user",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuiz(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      // Calculate score locally
      let correctCount = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round(
        (correctCount / quiz.questions.length) * 100,
      );
      setScore(calculatedScore);
      setSubmitted(true);

      // Try to save to backend if API exists
      try {
        await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            quizId: quiz?.id,
            userId: "current-user",
            answers,
            score: calculatedScore,
          }),
        });
      } catch (apiError) {
        console.log("Could not save to backend, score calculated locally");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Quiz not found</p>
            <Button onClick={() => router.push("/quiz")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/quiz")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">
                {quiz.subject}
              </h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-semibold dark:text-white mb-2">
                <Clock className="w-5 h-5" />
                {Math.ceil((quiz.questions.length - currentQuestion) * 1.5)} min
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-linear-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>

        {!submitted ? (
          // Quiz Questions
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="glass-card border-purple-200/60 dark:border-purple-500/30 p-8">
              <h2 className="text-2xl font-bold dark:text-white mb-6">
                {currentQ.text}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === idx
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === idx
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion] === idx && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="dark:text-gray-200">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  Previous
                </Button>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={answers.some((a) => a === null)}
                    className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrentQuestion(
                        Math.min(
                          quiz.questions.length - 1,
                          currentQuestion + 1,
                        ),
                      )
                    }
                    className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white"
                  >
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ) : (
          // Results
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="glass-card border-purple-200/60 dark:border-purple-500/30 p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {score}%
                  </span>
                </div>
                <h2 className="text-3xl font-bold dark:text-white mb-2">
                  Quiz Complete!
                </h2>
                <p className="text-muted-foreground text-lg">
                  {score && score >= 70
                    ? "🎉 Great job! You passed!"
                    : score && score >= 50
                      ? "👍 Good effort! Keep practicing!"
                      : "💪 Keep learning! Try again!"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 my-8">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {
                      answers.filter(
                        (ans, idx) => ans === quiz.questions[idx].correctAnswer,
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Correct</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {
                      answers.filter(
                        (ans, idx) => ans !== quiz.questions[idx].correctAnswer,
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Incorrect
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {quiz.questions.length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Total</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/quiz")}
                  className="flex-1"
                >
                  Back to Quizzes
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white"
                >
                  Retake Quiz
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
