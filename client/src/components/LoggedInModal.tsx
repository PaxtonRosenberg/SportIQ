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
        <div className="accountInfoBox">
          <div className="userInfoBox">
            <h1> {user && user.username}</h1>
            <p className="memberSinceText">
              <GiLaurelsTrophy /> {month} {day}, {year}
            </p>
            <Link to="/login">
              <button className="signOutButton" onClick={handleSignOut}>
                Sign Out
              </button>
            </Link>
          </div>
          <div className="accountDetails">
            <h3>Details</h3>
            <div className="accountDetailBox">
              <p>Email</p>
              <p className="bottomBorder">{user?.email}</p>
            </div>
            <div className="accountDetailBox">
              <p>Username</p>
              <p className="bottomBorder">{user?.username}</p>
            </div>
          </div>
          <div className="loggedInLinks">
            <p>
              <Link to="/">Back to Quiz</Link>
            </p>
            <p>
              Check out community quizzes <Link to="/community">Here</Link>
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
