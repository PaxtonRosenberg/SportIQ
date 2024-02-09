import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppContext } from './components/AppContext';
import { Quiz } from './components/Quiz';
import NavBar from './components/NavBar';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import LoggedInModal from './components/LoggedInModal';
import Help from './components/Help';
import Community from './components/Community';
import Results from './components/Results';
import CreatedQuizForm from './components/CreatedQuizForm';
import MyQuizzes from './components/MyQuizzes';
import { User, Auth } from './lib/api';
import './App.css';

const tokenKey = 'sportiq-jwt';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
    }
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/dailyQuiz');
      const data = await resp.json();
      return data;
    }

    readServerData();
  }, []);

  if (isAuthorizing) return null;

  function handleSignIn(auth: Auth) {
    localStorage.setItem(tokenKey, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
    setIsSignedIn(true);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    setToken(undefined);
    setIsSignedIn(false);
  }

  function incrementScore() {
    setScore(score + 1);
  }

  function resetScore() {
    setScore(0);
  }

  const contextValue = {
    user,
    token,
    handleSignIn,
    handleSignOut,
    score,
    incrementScore,
    resetScore,
    isSignedIn,
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Quiz />}></Route>
            <Route path="/login" element={<LoginModal />}></Route>
            <Route path="/signup" element={<SignUpModal />}></Route>
            <Route path="/account" element={<LoggedInModal />}></Route>
            <Route path="/stats" element={<Results />}></Route>
            <Route path="/help" element={<Help />}></Route>
            <Route path="/community" element={<Community />}></Route>
            <Route path="/create" element={<CreatedQuizForm />}></Route>
            <Route path="/myquizzes" element={<MyQuizzes />}></Route>
          </Route>
        </Routes>
      </AppContext.Provider>
    </>
  );
}
