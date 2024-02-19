import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserQuiz } from '../lib/api';
import { AppContext } from './AppContext';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function MyQuizzes() {
  const [userQuizzes, setUserQuizzes] = useState<UserQuiz[]>([]);

  const { user, handleEdit } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUserQuizzes(): Promise<void> {
      const req = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await fetch('/api/userQuizzes', req);
      const data = await res.json();
      setUserQuizzes(data);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    }
    getUserQuizzes();
  }, []);

  function handleClick(selectedQuiz) {
    const matchingQuiz = userQuizzes.find(
      (quiz) => quiz.userQuizId === selectedQuiz.userQuizId
    );
    if (matchingQuiz !== undefined) {
      handleEdit();
      navigate(`/edit/${matchingQuiz.userQuizId}`);
    }
  }

  const quizDisplay = userQuizzes.map((quiz, index) => {
    return (
      <div key={index} className="userQuizCard">
        <img className="userQuizImg" src={`${quiz.imgUrl}`}></img>
        <div className="quizNameBoxWithIcon">
          <div className="quizNameWithIcon">
            <div className="quizText">
              <p>{quiz.quizName}</p>
            </div>
            <div className="editIcon" onClick={() => handleClick(quiz)}>
              <FaEdit />
            </div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="myQuizzesContainer">
      <div className="userQuizzesHeaderBox">
        <div className="linkBox">
          <Link to="/community">Community Quizzes</Link>
        </div>
        <div className="myQuizzesHeader">
          <h1>{`${user?.username}'s Quizzes`}</h1>
        </div>
        <div className="linkBox">
          <Link to="/create">Create A Quiz</Link>
        </div>
      </div>
      <div className="userQuizBox">{quizDisplay}</div>
    </div>
  );
}
