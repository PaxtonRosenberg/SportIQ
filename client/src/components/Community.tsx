import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { User, UserQuiz } from '../lib/api';
import { AppContext } from './AppContext';

export default function Community() {
  const [userQuizzes, setUserQuizzes] = useState<UserQuiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const { isSignedIn } = useContext(AppContext);

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

  const quizDisplay = userQuizzes.map((quiz, index) => {
    return (
      <div key={index} className="userQuizCard">
        <img className="userQuizImg" src={`${quiz.imgUrl}`}></img>
        <div className="quizNameBox">
          <div className="quizName">
            <p>{quiz.quizName}</p>
            {users.map((user, userIndex) => {
              return user.userId === quiz.userId ? (
                <p key={userIndex}>{`By: ${user.username}`}</p>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
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
      <div className="myQuizzesContainer">
        <div className="userQuizBox">{quizDisplay}</div>
      </div>
    </>
  );
}
