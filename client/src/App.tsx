// import { useEffect } from 'react';
import { Quiz } from './components/Quiz';
import './App.css';

export default function App() {
  // useEffect(() => {
  //   async function readServerData() {
  //     const resp = await fetch('/api/dailyQuiz');

  //     const data = await resp.json();

  //     console.log('Data from server:', data);
  //   }

  //   readServerData();
  // }, []);

  return (
    <>
      <Quiz />
    </>
  );
}
