import { FormEvent } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function SignUpModal() {
  const navigate = useNavigate();

  function onSignUp() {
    navigate('/login');
    alert('sign-up successful, please proceed to login');
  }

  async function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      onSignUp();
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }
  return (
    <div className="box">
      <div className="modal">
        <div className="textBox">
          <div className="headerBox">
            <h1>Sign Up</h1>
          </div>
          <div>
            <form onSubmit={handleSignUpSubmit}>
              <div className="loginFormBox">
                <input
                  className="loginFormInput"
                  type="text"
                  name="username"
                  placeholder="username"></input>
                <input
                  className="loginFormInput"
                  type="text"
                  name="email"
                  placeholder="email"></input>
                <input
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
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
