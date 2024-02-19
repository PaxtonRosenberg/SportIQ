import { FormEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserQuizQuestionsAndAnswers } from '../lib/api';
import { updateUserQuiz } from '../data';

import EditFormInputs from './EditFormInputs';

export default function EditQuiz() {
  const navigate = useNavigate();

  const { userQuizId } = useParams();

  const { user, isSignedIn, handleEdit, editing } = useContext(AppContext);

  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<
    UserQuizQuestionsAndAnswers[] | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (editing) {
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

          // Fetch answers
          const answersRes = await fetch(`/api/userQuizAnswers/${userQuizId}`);
          if (!answersRes.ok) {
            throw new Error(
              `Error, failed to fetch answers ${answersRes.status}`
            );
          }
          const userQuizAnswers = await answersRes.json();

          const combinedData = userQuizQuestions.map((question) => {
            const associatedAnswers = userQuizAnswers.filter(
              (answer) => answer.userQuestionId === question.userQuestionId
            );
            return { question, answers: associatedAnswers };
          });
          setQuestionsAndAnswers(combinedData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [userQuizId, editing]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const questions: Question[] = [];

      type Question = {
        question: string | undefined;
        userQuizId: number | null;
        userQuestionId: number | null;
        answers: Answer[];
      };

      type Answer = {
        answer: string;
        isCorrect: boolean;
        userQuestionId;
        userAnswerId;
      };

      const formData = new FormData(e.currentTarget);

      const userId = user?.userId;

      const quizName = formData.get('quizName')?.toString();

      const imgUrl = formData.get('imgUrl')?.toString();

      const parsedUserQuizId = userQuizId ? parseInt(userQuizId) : 0;

      for (let i = 0; i < 5; i++) {
        const questionText = formData.get(`Question ${i + 1}`)?.toString();

        if (questionText === null && questionText === undefined) {
          return;
        } else {
          const question: Question = {
            question: questionText,
            userQuestionId:
              questionsAndAnswers !== null
                ? questionsAndAnswers[i].question.userQuestionId
                : null,
            userQuizId: parsedUserQuizId ? parsedUserQuizId : null,
            answers: [],
          };

          for (let x = 0; x < 4; x++) {
            const answerText = formData
              .get(`Question ${i + 1} Answer ${x + 1}`)
              ?.toString();

            const formIsCorrect = formData.get(
              `isCorrect Question ${i + 1} Answer ${x + 1}`
            );

            const isCorrect = formIsCorrect === 'true';

            if (
              answerText !== null &&
              answerText !== undefined &&
              isCorrect !== null &&
              questionsAndAnswers !== null
            ) {
              const answer: Answer = {
                answer: answerText,
                isCorrect: isCorrect,
                userQuestionId:
                  questionsAndAnswers[i].answers[x].userQuestionId,
                userAnswerId: questionsAndAnswers[i].answers[x].userAnswerId,
              };
              question.answers.push(answer);
            }
          }
          questions.push(question);
        }
      }

      if (
        quizName !== undefined &&
        imgUrl !== undefined &&
        userId !== undefined
      ) {
        const editedUserQuizData = {
          userId,
          quizName,
          imgUrl,
          questions,
          userQuizId: parsedUserQuizId,
        };
        console.log('do we get here?');
        await updateUserQuiz(editedUserQuizData);
        navigate('/myquizzes');
        handleEdit();
      }
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <>
      <div className="userQuizzesHeaderBox">
        <div className="linkBox" onClick={() => handleEdit()}>
          {isSignedIn ? <Link to="/myquizzes">My Quizzes</Link> : null}
        </div>
        <div className="myQuizzesHeader">
          <h1>{`Edit Quiz`}</h1>
        </div>
        <div className="linkBox">Delete Quiz</div>
      </div>
      <div className="formBox">
        <form onSubmit={handleSubmit}>
          <EditFormInputs />
          <div className="buttonBox">
            <button className="submitButton">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
