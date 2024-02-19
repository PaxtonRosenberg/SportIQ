import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { useContext, useEffect, useState } from 'react';
import { UserQuizResult, DailyQuizResult } from '../lib/api';

export default function Results() {
  const [dailyQuizResults, setDailyQuizResults] = useState<DailyQuizResult[]>(
    []
  );
  const [userQuizResults, setUserQuizResults] = useState<UserQuizResult[]>([]);
  const { score, isSignedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getDailyQuizResults(): Promise<void> {
      const req = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await fetch('/api/dailyQuizResults', req);
      const results = await res.json();
      setDailyQuizResults(results);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    }
    getDailyQuizResults();
  }, []);

  useEffect(() => {
    async function getUserQuizResults(): Promise<void> {
      const req = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await fetch('/api/userQuizResults', req);
      const results = await res.json();
      setUserQuizResults(results);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    }
    getUserQuizResults();
  }, []);

  let avgScore = 0;

  for (let i = 0; i < dailyQuizResults.length; i++) {
    avgScore += dailyQuizResults[i].score;
    console.log(avgScore);
  }

  for (let i = 0; i < userQuizResults.length; i++) {
    avgScore += userQuizResults[i].score;
  }

  const quizzesTaken = dailyQuizResults.length + userQuizResults.length;

  avgScore = avgScore / quizzesTaken;

  avgScore = Number(avgScore.toFixed(2));

  return (
    <div className="box">
      <div className="modal">
        <div className="textBox">
          <div className="headerBox">
            <h1>Stats</h1>
          </div>
          <div className="resultTextBox">
            <p>{score}/5</p>
            <p>Current Result</p>
          </div>
          <div className="resultTextBox">
            <p>{!isSignedIn ? `${score}/5` : `${avgScore}/5`}</p>
            <p>Average Result</p>
          </div>
          <div className="resultTextBox">
            <p>{!isSignedIn ? 1 : quizzesTaken}</p>
            <p>Quizzes Taken</p>
          </div>
        </div>
        <p className="textLink" onClick={() => navigate('/')}>
          Take another quiz?
        </p>
        {!isSignedIn ? (
          <p className="optionalResultsText">
            Please{' '}
            <span className="textLink" onClick={() => navigate('/login')}>
              login
            </span>{' '}
            or{' '}
            <span className="textLink" onClick={() => navigate('/signup')}>
              create an account
            </span>{' '}
            to track your results.
          </p>
        ) : null}
      </div>
    </div>
  );
}
