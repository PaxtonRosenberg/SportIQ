import { Link, Outlet } from 'react-router-dom';
import { AppContext } from './AppContext';
import { useContext } from 'react';
import { GiLaurelsTrophy } from 'react-icons/gi';

export default function LoggedInModal() {
  const { user, handleSignOut } = useContext(AppContext);

  const date = user ? new Date(user.createdAt) : null;
  const monthNum = date?.getMonth();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[monthNum ? monthNum : 'month not available'];
  const day = date?.getDate();
  const year = date?.getFullYear();

  return (
    <div className="box">
      <div className="modal">
        <div className="textBox">
          <h3> {user && user.username}</h3>
          <h5>
            <GiLaurelsTrophy /> {month} {day}, {year}
          </h5>
          <Link to="/login">
            <button className="signOutButton" onClick={handleSignOut}>
              Sign Out
            </button>
          </Link>
          <p>
            <Link to="/">Home</Link>
          </p>
          <p>
            Check out community quizzes <Link to="/community">Here</Link>
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
