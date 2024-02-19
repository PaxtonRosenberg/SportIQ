import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { User, UserQuiz } from '../lib/api';
import { AppContext } from './AppContext';

export default function Community() {
  const [userQuizzes, setUserQuizzes] = useState<UserQuiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const { isSignedIn } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function getAllUserQuizzes() {
      const req = {
        method: 'GET',
      };
      const res = await fetch('/api/allUserQuizzes', req);
      const data = await res.json();
      setUserQuizzes(data);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    }
    getAllUserQuizzes();
  }, []);

  useEffect(() => {
    async function getAllUsers() {
      const req = {
        method: 'GET',
      };
      const res = await fetch('/api/users', req);
      const data = await res.json();
      setUsers(data);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    }
    getAllUsers();
  }, []);

  function handleClick(selectedQuiz) {
    const matchingQuiz = userQuizzes.find(
      (quiz) => quiz.userQuizId === selectedQuiz.userQuizId
    );
    if (matchingQuiz !== undefined) {
      navigate(`/communityquiz/${matchingQuiz.userQuizId}`);
    }
  }

  const quizDisplay = userQuizzes.map((quiz, index) => {
    return (
      <div
        key={index}
        className="userQuizCard"
        onClick={() => handleClick(quiz)}>
        <img className="userQuizImg" src={`${quiz.imgUrl}`}></img>
        <div className="quizNameBoxWithByLine">
          <div className="quizNameWithByLine">
            <p>{quiz.quizName}</p>
          </div>
          {users.map((user, userIndex) => {
            return user.userId === quiz.userId ? (
              <div className="quizNameWithByLine">
                <p key={userIndex}>{`By: ${user.username}`}</p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="myQuizzesContainer">
        <div className="userQuizzesHeaderBox">
          <div className="linkBox">
            {isSignedIn ? <Link to="/myquizzes">My Quizzes</Link> : null}
          </div>
          <div className="myQuizzesHeader">
            <h1>{`Community Quizzes`}</h1>
          </div>
          <div className="linkBox">
            {isSignedIn ? <Link to="/create">Create A Quiz</Link> : null}
          </div>
        </div>
        <div className="userQuizBox">{quizDisplay}</div>
      </div>
    </>
  );
}
