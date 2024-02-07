import { Link } from 'react-router-dom';

export default function Community() {
  return (
    <div className="communityHeaderBox">
      <p>My Quizzes</p>
      <h1>Created Quizzes</h1>
      <p>
        <Link to="/create">Create A Quiz</Link>
      </p>
    </div>
  );
}
