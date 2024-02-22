export default function QuestionAndAnswerFormInputs() {
  const numberOfQuestions = [1, 2, 3, 4, 5];
  const numberOfAnswers = [1, 2, 3, 4];

  const formInputs = numberOfQuestions.map((questionNum, questionIndex) => {
    const answerInputs = numberOfAnswers.map((answerNum) => (
      <div key={answerNum}>
        <div className="createdQuizInputBox">
          <input
            required
            autoComplete="off"
            className="createdQuizFormInput"
            type="text"
            name={`Question ${questionNum} Answer ${answerNum}`}
            placeholder={`Question ${questionNum} Answer ${answerNum}*`}
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
                name={`isCorrect Question ${questionNum} Answer ${answerNum}`}
                id={`isCorrect Question ${questionNum} Answer ${answerNum} Yes`}
                value="true"
              />
            </label>
            <label
              htmlFor={`isCorrect Question ${questionNum} Answer ${answerNum} No`}>
              No
              <input
                required
                autoComplete="off"
                type="radio"
                name={`isCorrect Question ${questionNum} Answer ${answerNum}`}
                id={`isCorrect Question ${questionNum} Answer ${answerNum} No`}
                value="false"
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
        />
      </div>
      {formInputs}
    </>
  );
}
