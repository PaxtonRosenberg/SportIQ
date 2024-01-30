import logo from '/workspaces/SportIQ/client/src/assets/images/stadium_clip_art.png';
import community from '/workspaces/SportIQ/client/src/assets/images/people-group-solid.svg';
import stats from '/workspaces/SportIQ/client/src/assets/images/chart-line-solid.svg';
import help from '/workspaces/SportIQ/client/src/assets/images/circle-question-regular.svg';
import account from '/workspaces/SportIQ/client/src/assets/images/user-solid.svg';

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
            <img className="navIcon" src={community}></img>
            <img className="navIcon stats" src={stats}></img>
            <img className="navIcon" src={help}></img>
            <img className="navIcon" src={account}></img>
          </div>
        </div>
      </div>
    </header>
  );
}
