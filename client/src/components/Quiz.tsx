import NavBar from './NavBar';
import Indicators from './Indicators';
import Questions from './Questions';
import Answers from './Answers';
import Results from './Results';
import { useState, useEffect } from 'react';

type Question = {
  dailyQuestionId: number;
  dailyQuizId: number;
  difficulty: string;
  question: string;
};

type Answer = {
  dailyQuestionId: number;
  dailyAnswerId: number;
  isCorrect: boolean;
  answer: string;
};

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  const [prevAnswersResult, setPrevAnswersResult] = useState<boolean[]>([]);

  useEffect(() => {
    async function getQuestions() {
      try {
        const res = await fetch('/api/dailyQuizQuestions');
        if (!res.ok) {
          throw new Error(`Error, failed to fetch ${res.status}`);
        }
        const dailyQuizQuestions = await res.json();
        setQuestions(dailyQuizQuestions);
      } catch (err) {
        console.error(err);
      }
    }
    getQuestions();
    setShowResults(false);
  }, []);

  useEffect(() => {
    async function getAnswers() {
      try {
        const res = await fetch('/api/dailyQuizAnswers');
        if (!res.ok) {
          throw new Error(`Error, failed to fetch ${res.status}`);
        }
        const dailyQuizAnswers = await res.json();
        setAnswers(dailyQuizAnswers);
      } catch (err) {
        console.error(err);
      }
    }
    getAnswers();
  }, []);

  function handleClick(answersIndex: number, currentAnswers: Answer[]) {
    setCurrentAnswers(currentAnswers);
    setSelectedAnswer(answersIndex);
    if (currentAnswers[answersIndex].isCorrect) {
      setScore(score + 1);
      setPrevAnswersResult([...prevAnswersResult, true]);
    } else {
      setPrevAnswersResult([...prevAnswersResult, false]);
    }
    setTimeout(() => {
      if (currentIndex <= questions.length - 1) {
        setCurrentIndex(currentIndex + 1);

        setCurrentQuestion(currentQuestion + 1);

        answersIndex + 1;

        setSelectedAnswer(null);
      }
      if (currentIndex === 4) {
        setShowResults(true);
        answersIndex = 0;
      }
    }, 1000);
  }

  return (
    <>
      <NavBar />
      {!showResults ? (
        <Indicators
          questions={questions}
          currentQuestion={currentIndex}
          selectedAnswer={selectedAnswer}
          prevAnswersResults={prevAnswersResult}
          isCorrect={
            selectedAnswer !== null
              ? currentAnswers[selectedAnswer].isCorrect
                ? true
                : false
              : true
          }
        />
      ) : null}
      <Questions questions={questions} currentIndex={currentIndex} />
      <Answers
        answers={answers}
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        onClick={handleClick}
      />
      <Results results={showResults} score={score} />
    </>
  );
}
