import { FormEvent, useContext } from 'react';
import { AppContext } from './AppContext';
import QuestionAndAnswerFormInputs from './QuestionAndAnswerFormInputs';
import { addUserQuiz } from '../data';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CreatedQuizForm() {
  const navigate = useNavigate();

  const { user, isSignedIn } = useContext(AppContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const userId = user?.userId;
      const quizName = formData.get('quizName');
      const imgUrl = formData.get('imgUrl');

      const questions: Question[] = [];

      type Question = {
        question: FormDataEntryValue;
        answers: Answer[];
      };

      type Answer = {
        answer: FormDataEntryValue;
        isCorrect: boolean;
      };

      for (let i = 1; i <= 5; i++) {
        const questionText = formData.get(`Question ${i}`);
        if (questionText === null) {
          return;
        }

        const question: Question = {
          question: questionText,
          answers: [],
        };

        for (let x = 1; x <= 4; x++) {
          const answerText = formData.get(`Question ${i} Answer ${x}`);

          const formIsCorrect = formData.get(
            `isCorrect Question ${i} Answer ${x}`
          );
          console.log(formIsCorrect);
          const isCorrect = formIsCorrect === 'true';

          if (answerText !== null && isCorrect !== null) {
            const answer: Answer = {
              answer: answerText,
              isCorrect: isCorrect,
            };
            question.answers.push(answer);
          }
        }
        questions.push(question);
      }

      const userQuizData = { userId, quizName, imgUrl, questions };

      if (userId !== undefined) {
        await addUserQuiz(userQuizData);
        navigate('/myquizzes');
      }
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <>
      <div className="userQuizzesHeaderBox">
        <div className="linkBox">
          {isSignedIn ? <Link to="/myquizzes">My Quizzes</Link> : null}
        </div>
        <div className="myQuizzesHeader">
          <h1>{`Create A Quiz`}</h1>
        </div>
        <div className="linkBox">
          {isSignedIn ? <Link to="/community">Community Quizzes</Link> : null}
        </div>
      </div>
      <div className="formBox">
        <form onSubmit={handleSubmit}>
          <QuestionAndAnswerFormInputs />
          <div className="buttonBox">
            <button className="submitButton">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
