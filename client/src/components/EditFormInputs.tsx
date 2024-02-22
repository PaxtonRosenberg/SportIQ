import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from './AppContext';
import { UserQuizDetails, UserQuizQuestionsAndAnswers } from '../lib/api';

export default function EditFormInputs() {
  const numberOfQuestions = [1, 2, 3, 4, 5];
  const numberOfAnswers = [1, 2, 3, 4];

  const { editing } = useContext(AppContext);
  const { userQuizId } = useParams();

  const [userQuizDetails, setUserQuizDetails] = useState<
    UserQuizDetails[] | null
  >(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<
    UserQuizQuestionsAndAnswers[] | null
  >(null);

  const quizName = userQuizDetails ? userQuizDetails[0].quizName : '';
  const imgUrl = userQuizDetails ? userQuizDetails[0].imgUrl : '';

  useEffect(() => {
    async function fetchData() {
      try {
        if (editing) {
          // Fetch quiz info
          const quizRes = await fetch(`/api/userQuizzes/${userQuizId}`);
          if (!quizRes.ok) {
            throw new Error(`Error, failed to fetch quizzes ${quizRes.status}`);
          }
          const userQuizDetails = await quizRes.json();
          setUserQuizDetails(userQuizDetails);

          // Fetch questions
          const questionsRes = await fetch(
            `/api/userQuizQuestions/${userQuizId}`
          );
          if (!questionsRes.ok) {
            throw new Error(
              `Error, failed to fetch questions ${questionsRes.status}`
            );
          }
          const userQuizQuestions = await questionsRes.json();

          // Fetch answers
          const answersRes = await fetch(`/api/userQuizAnswers/${userQuizId}`);
          if (!answersRes.ok) {
            throw new Error(
              `Error, failed to fetch answers ${answersRes.status}`
            );
          }
          const userQuizAnswers = await answersRes.json();

          const combinedData = userQuizQuestions.map((question) => {
            const associatedAnswers = userQuizAnswers.filter(
              (answer) => answer.userQuestionId === question.userQuestionId
            );
            return { question, answers: associatedAnswers };
          });
          setQuestionsAndAnswers(combinedData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [userQuizId, editing]);

  const handleQuizNameChange = (newValue: string) => {
    if (userQuizDetails !== null) {
      const updatedQuizName = [...userQuizDetails];
      updatedQuizName[0] = { ...updatedQuizName[0], quizName: newValue };
      setUserQuizDetails(updatedQuizName);
    }
  };

  const handleQuizImgChange = (newValue: string) => {
    if (userQuizDetails !== null) {
      const updatedQuizImg = [...userQuizDetails];
      updatedQuizImg[0] = { ...updatedQuizImg[0], imgUrl: newValue };
      setUserQuizDetails(updatedQuizImg);
    }
  };

  const handleQuestionChange = (index: number, newValue: string) => {
    if (questionsAndAnswers !== null) {
      const updatedQuestionsAndAnswers = [...questionsAndAnswers];
      updatedQuestionsAndAnswers[index].question.question = newValue;
      setQuestionsAndAnswers(updatedQuestionsAndAnswers);
    }
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    newValue: string
  ) => {
    if (questionsAndAnswers !== null) {
      const updatedQuestionsAndAnswers = [...questionsAndAnswers];
      updatedQuestionsAndAnswers[questionIndex].answers[answerIndex].answer =
        newValue;
      setQuestionsAndAnswers(updatedQuestionsAndAnswers);
    }
  };

  const handleIsCorrectChange = (
    questionIndex: number,
    answerIndex: number,
    newValue: boolean
  ) => {
    if (questionsAndAnswers !== null) {
      const updatedQuestionsAndAnswers = [...questionsAndAnswers];
      updatedQuestionsAndAnswers[questionIndex].answers[answerIndex].isCorrect =
        newValue;
      setQuestionsAndAnswers(updatedQuestionsAndAnswers);
    }
  };

  const formInputs = numberOfQuestions.map((questionNum, questionIndex) => {
    const answerInputs = numberOfAnswers.map((answerNum, answerIndex) => (
      <div key={answerIndex}>
        <div className="createdQuizInputBox">
          <input
            required
            autoComplete="off"
            className="createdQuizFormInput"
            type="text"
            name={`Question ${questionNum} Answer ${answerNum}`}
            placeholder={`Question ${questionNum} Answer ${answerNum}*`}
            value={
              questionsAndAnswers
                ? questionsAndAnswers[questionIndex].answers[answerIndex].answer
                : ''
            }
            onChange={(e) =>
              handleAnswerChange(questionNum, answerNum, e.target.value)
            }
          />
        </div>
        <div className="createdQuizInputBox">
          <div className="createdQuizFormInput">
            Correct Answer?
            <label
              htmlFor={`isCorrect Question ${questionNum} Answer ${answerNum} Yes`}>
              Yes
              <input
                required
                autoComplete="off"
                type="radio"
                checked={
                  questionsAndAnswers !== null &&
                  questionsAndAnswers[questionIndex].answers[answerIndex]
                    .isCorrect
                }
                name={`isCorrect Question ${questionNum} Answer ${answerNum}`}
                id={`isCorrect Question ${questionNum} Answer ${answerNum} Yes`}
                value="true"
                onChange={() =>
                  handleIsCorrectChange(questionIndex, answerIndex, true)
                }
              />
            </label>
            <label
              htmlFor={`isCorrect Question ${questionNum} Answer ${answerNum} No`}>
              No
              <input
                required
                autoComplete="off"
                type="radio"
                checked={
                  questionsAndAnswers !== null &&
                  !questionsAndAnswers[questionIndex].answers[answerIndex]
                    .isCorrect
                }
                name={`isCorrect Question ${questionNum} Answer ${answerNum}`}
                id={`isCorrect Question ${questionNum} Answer ${answerNum} No`}
                value="false"
                onChange={() =>
                  handleIsCorrectChange(questionIndex, answerIndex, false)
                }
              />
            </label>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="createdQuizInputBox" key={questionIndex}>
        <input
          required
          autoComplete="off"
          className="createdQuizFormInput"
          type="text"
          name={`Question ${questionNum}`}
          placeholder={`Question ${questionNum}*`}
          value={
            questionsAndAnswers
              ? questionsAndAnswers[questionIndex].question.question
              : ''
          }
          onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
        />
        <div className="createdQuizAnswerBox">{answerInputs}</div>
      </div>
    );
  });

  return (
    <>
      <div className="createdQuizInputBox">
        <input
          required
          autoComplete="off"
          className="createdQuizFormInput"
          type="text"
          name="quizName"
          placeholder="Quiz Name*"
          value={quizName}
          onChange={(e) => handleQuizNameChange(e.target.value)}
        />
      </div>
      <div className="createdQuizInputBox">
        <input
          required
          autoComplete="off"
          className="createdQuizFormInput"
          type="text"
          name="imgUrl"
          placeholder="Quiz Image URL*"
          value={imgUrl}
          onChange={(e) => handleQuizImgChange(e.target.value)}
        />
      </div>
      {formInputs}
    </>
  );
}
