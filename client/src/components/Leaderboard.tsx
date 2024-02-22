import { useEffect, useState } from 'react';
import {
  DailyQuizResultLeaderboard,
  UserQuizResultLeaderboard,
  User,
} from '../lib/api';

export default function Leaderboard() {
  const [combinedResults, setCombinedResults] = useState<
    (DailyQuizResultLeaderboard | UserQuizResultLeaderboard)[]
  >([]);
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const dailyQuizRes = await fetch('/api/allDailyQuizResults');
        const userQuizRes = await fetch('/api/allUserQuizResults');
        const usersRes = await fetch('/api/users');

        if (!dailyQuizRes.ok)
          throw new Error(`fetch Error ${dailyQuizRes.status}`);
        if (!userQuizRes.ok)
          throw new Error(`fetch Error ${userQuizRes.status}`);
        if (!usersRes.ok) throw new Error(`fetch Error ${usersRes.status}`);

        const dailyResults = await dailyQuizRes.json();
        const userResults = await userQuizRes.json();
        const users = await usersRes.json();

        setCombinedResults([...dailyResults, ...userResults]);
        setUserData(users);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const userScores = {};
  combinedResults.forEach((result) => {
    const { userId, score } = result;
    const user = userData.find((user) => user.userId === userId);
    if (userScores[userId]) {
      userScores[userId].totalScore += score;
      userScores[userId].count += 1;
    } else {
      userScores[userId] = {
        totalScore: score,
        count: 1,
        username: user?.username,
      };
    }
  });

  const resultKeys = Object.keys(userScores);

  resultKeys.sort((a, b) => {
    const averageScoreA = userScores[a].totalScore / userScores[a].count;
    const averageScoreB = userScores[b].totalScore / userScores[b].count;
    return averageScoreB - averageScoreA;
  });

  return (
    <div className="leaderboardBox">
      <h1>Leaders</h1>
      <table id="leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Average Score</th>
            <th>Quizzes Taken</th>
          </tr>
        </thead>
        <tbody>
          {resultKeys.map((userId, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{userScores[userId].username}</td>
              <td>
                {(
                  userScores[userId].totalScore / userScores[userId].count
                ).toFixed(2)}
              </td>
              <td>{userScores[userId].count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
