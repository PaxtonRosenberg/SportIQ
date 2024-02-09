import { FormEvent, useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

export default function LoginModal() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const { handleSignIn } = useContext(AppContext);

  const navigate = useNavigate();

  function onSignIn() {
    navigate('/account');
    setIsSignedIn(true);
  }

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      localStorage.setItem('token', token);
      handleSignIn({ user, token });
      onSignIn();
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }
  return (
    <>
      {!isSignedIn ? (
        <div className="box">
          <div className="modal">
            <div className="textBox">
              <div className="headerBox">
                <h1>Log In</h1>
              </div>
              <div>
                <form onSubmit={handleLoginSubmit}>
                  <div className="loginFormBox">
                    <input
                      required
                      className="loginFormInput"
                      type="text"
                      name="email"
                      placeholder="email"
                      autoComplete="email"></input>
                  </div>
                  <div className="loginFormBox">
                    <input
                      required
                      className="loginFormInput"
                      type="password"
                      name="password"
                      placeholder="password"></input>
                  </div>
                  <div className="buttonBox">
                    <button className="submitButton">Submit</button>
                  </div>
                </form>
              </div>
              <div className="newUserLinkBox">
                <p>
                  New User? Sign Up <Link to="/signup">Here</Link>
                </p>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      ) : null}
    </>
  );
}
