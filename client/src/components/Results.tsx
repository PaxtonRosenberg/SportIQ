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
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`fetch Error ${res.status}: ${errorText}`);
      }

      try {
        const results = await res.json();

        setDailyQuizResults(results);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
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
      console.log(req);

      const res = await fetch('/api/userQuizResults', req);
      console.log(res);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch error ${res.status}: ${errorText}`);
      }

      try {
        const results = await res.json();
        console.log(results);
        setUserQuizResults(results);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    getUserQuizResults();
  }, []);

  let avgScore = 0;

  for (let i = 0; i < dailyQuizResults.length; i++) {
    avgScore += dailyQuizResults[i].score;
  }

  for (let i = 0; i < userQuizResults.length; i++) {
    avgScore += userQuizResults[i].score;
  }
  console.log(userQuizResults);
  console.log(userQuizResults.length);
  console.log(dailyQuizResults.length);
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
            <p>Current Score</p>
          </div>
          <div className="resultTextBox">
            <p>{!isSignedIn ? `${score}/5` : `${avgScore}/5`}</p>
            <p>Average Score</p>
          </div>
          <div className="resultTextBox">
            <p>{!isSignedIn ? 1 : quizzesTaken}</p>
            <p>Quizzes Taken</p>
          </div>
        </div>
        <p className="textLink" onClick={() => navigate('/')}>
          Take another quiz?
        </p>
        <p className="textLink" onClick={() => navigate('/leaderboard')}>
          Check the Leaderboard
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
