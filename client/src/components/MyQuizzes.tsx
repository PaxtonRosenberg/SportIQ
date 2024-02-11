import { useEffect, useState, useContext } from 'react';
import { UserQuiz } from '../lib/api';
import { AppContext } from './AppContext';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function MyQuizzes() {
  const [userQuizzes, setUserQuizzes] = useState<UserQuiz[]>([]);

  const { user } = useContext(AppContext);

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

  const quizDisplay = userQuizzes.map((quiz, index) => {
    return (
      <div key={index} className="userQuizCard">
        <img className="userQuizImg" src={`${quiz.imgUrl}`}></img>
        <div className="quizNameBox">
          <div className="quizName">
            <div className="quizText">
              <p>{quiz.quizName}</p>
            </div>
            <div className="editIcon">
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
