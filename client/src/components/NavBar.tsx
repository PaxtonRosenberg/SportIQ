import logo from '../../../server/public/stadium_clip_art.png';

import { FaPeopleGroup } from 'react-icons/fa6';
import { MdInsertChartOutlined } from 'react-icons/md';
import { FaRegQuestionCircle, FaUser } from 'react-icons/fa';

export default function NavBar() {
  return (
    <header>
      <div className="navBar sticky">
        <div className="navBarBox">
          <div className="logoBox">
            <h1 className="headerFont">SportIQ</h1>
            <img className="logo" src={logo}></img>
          </div>
          <div className="iconBox">
            <div className="navIcon">
              <FaPeopleGroup />
            </div>
            <div className="navIcon">
              <MdInsertChartOutlined />
            </div>
            <div className="navIcon">
              <FaRegQuestionCircle />
            </div>
            <div className="navIcon">
              <FaUser />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
