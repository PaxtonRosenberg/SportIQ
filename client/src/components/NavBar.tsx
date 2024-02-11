import logo from '../../../server/public/stadium_clip_art.png';
import { FaPeopleGroup } from 'react-icons/fa6';
import { MdInsertChartOutlined } from 'react-icons/md';
import { FaRegQuestionCircle, FaUser } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './AppContext';

export default function NavBar() {
  const navigate = useNavigate();
  const { isSignedIn } = useContext(AppContext);

  return (
    <div className="navBar">
      <div className="navBar sticky">
        <div className="navBarContainer">
          <div className="navBarBox">
            <div className="logoBox" onClick={() => navigate('/')}>
              <h1 className="headerFont">SportIQ</h1>
              <img className="logo" src={logo}></img>
            </div>
            <div className="iconBox">
              <Link to="/community" className="navIcon">
                <FaPeopleGroup title="Community" />
              </Link>
              <Link to="/stats" className="navIcon">
                <MdInsertChartOutlined title="Stats" />
              </Link>
              <Link to="/help" className="navIcon">
                <FaRegQuestionCircle title="Help" />
              </Link>
              {isSignedIn ? (
                <Link to="/account" className="navIcon">
                  <FaUser title="Account" />
                </Link>
              ) : (
                <Link to="/login" className="navIcon">
                  <FaUser title="Account" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
