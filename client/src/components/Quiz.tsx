import Indicators from './Indicators';
import Questions from './Questions';
import Answers from './Answers';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { handleEndOfQuiz } from '../data';
import { useNavigate } from 'react-router-dom';
import { Question, Answer } from '../lib/api';

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  const [prevAnswersResult, setPrevAnswersResult] = useState<boolean[]>([]);
  const [dailyQuizId, setDailyQuizId] = useState<number>(
    Math.floor(Math.random() * 20 + 1)
  );
  const { incrementScore, resetScore, user, score } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch questions
        const questionsRes = await fetch(
          `/api/dailyQuizQuestions/${dailyQuizId}`
        );
        if (!questionsRes.ok) {
          throw new Error(
            `Error, failed to fetch questions ${questionsRes.status}`
          );
        }
        const dailyQuizQuestions = await questionsRes.json();
        setQuestions(dailyQuizQuestions);

        // Fetch answers
        const answersRes = await fetch(`/api/dailyQuizAnswers/${dailyQuizId}`);
        if (!answersRes.ok) {
          throw new Error(
            `Error, failed to fetch answers ${answersRes.status}`
          );
        }
        const dailyQuizAnswers = await answersRes.json();
        setAnswers(dailyQuizAnswers);
        resetScore();
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [dailyQuizId]);

  useEffect(() => {
    // Update currentQuestion when questions change
    if (questions.length > 0) {
      setCurrentQuestion(questions[0].dailyQuestionId);
    }
  }, [questions]);

  useEffect(() => {
    // This useEffect watches for changes in the score and calls handleEndOfQuiz
    async function handleEndOfQuizEffect() {
      if (currentIndex === 4 && user) {
        await handleEndOfQuiz(user, questions, score);
      }
    }

    handleEndOfQuizEffect();
  }, [score]);

  async function handleClick(answersIndex: number, answers: Answer[]) {
    if (selectedAnswer !== null) {
      return;
    }
    setCurrentAnswers(answers);
    setSelectedAnswer(answersIndex);
    if (answers[answersIndex].isCorrect) {
      incrementScore();
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
        answersIndex = 0;
        navigate('/stats');
      }
      if (dailyQuizId === null) {
        setDailyQuizId(Math.floor(Math.random() * 20));
      }
    }, 1000);
  }

  return (
    <>
      <div className="container">
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

        <Questions questions={questions} currentIndex={currentIndex} />
        <Answers
          answers={answers}
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          onClick={handleClick}
        />
      </div>
    </>
  );
}
