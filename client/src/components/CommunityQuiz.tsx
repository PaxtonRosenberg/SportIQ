import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from './AppContext';
import { addUserQuizResult } from '../data';
import Indicators from './Indicators';
import Questions from './Questions';
import Answers from './Answers';
import { Question, Answer } from '../lib/api';

export default function CommunityQuiz() {
  const { userQuizId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  const [prevAnswersResult, setPrevAnswersResult] = useState<boolean[]>([]);

  const { incrementScore, resetScore, user, score } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch questions
        const questionsRes = await fetch(
          `/api/userQuizQuestions/${userQuizId}`
        );
        if (!questionsRes.ok) {
          throw new Error(
            `Error, failed to fetch questions ${questionsRes.status}`
          );
        }
        const userQuizQuestions = await questionsRes.json();
        setQuestions(userQuizQuestions);

        // Fetch answers
        const answersRes = await fetch(`/api/userQuizAnswers/${userQuizId}`);
        if (!answersRes.ok) {
          throw new Error(
            `Error, failed to fetch answers ${answersRes.status}`
          );
        }
        const userQuizAnswers = await answersRes.json();
        setAnswers(userQuizAnswers);
        resetScore();
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [userQuizId]);

  useEffect(() => {
    // Update currentQuestion when questions change
    if (questions.length > 0) {
      setCurrentQuestion(questions[0].userQuestionId);
    }
  }, [questions]);

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
    }, 1000);

    await handleEndOfQuiz(currentIndex);
  }

  async function handleEndOfQuiz(currentIndex: number) {
    try {
      if (currentIndex === 4 && user) {
        const userId = user.userId;
        const userQuizId = questions[0].userQuizId;
        const loggedScore = Number(score !== 0 ? score + 1 : score);
        const quizResult = { userId, userQuizId, loggedScore };

        await addUserQuizResult(quizResult);
      }
    } catch (err) {
      console.error(err);
    }
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
