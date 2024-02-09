export default function QuestionAndAnswerFormInputs() {
  const numberOfQuestions = [1, 2, 3, 4, 5];

  const formInputs = numberOfQuestions.map((question, index) => {
    return (
      <div className="createdQuizInputBox" key={index}>
        <input
          required
          className="createdQuizFormInput"
          type="text"
          name={`Question${question}`}
          placeholder={`Question${question}*`}></input>
        <div className="createdQuizAnswerBox">
          <div className="createdQuizInputBox">
            <input
              required
              className="createdQuizFormInput"
              type="text"
              name={`Q${question} Answer 1`}
              placeholder={`Q${question} Answer 1*`}></input>
          </div>
          <label htmlFor={`Q${question} Answer 1`}>Correct?</label>
          <select
            name={`isCorrect Q${question} Answer 1`}
            id={`Q${question} Answer 1`}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="createdQuizAnswerBox">
          <div className="createdQuizInputBox">
            <input
              required
              className="createdQuizFormInput"
              type="text"
              name={`Q${question} Answer 2`}
              placeholder={`Q${question} Answer 2*`}></input>
          </div>
          <label htmlFor={`Q${question} Answer 2`}>Correct?</label>
          <select
            name={`isCorrect Q${question} Answer 2`}
            id={`Q${question} Answer 2`}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="createdQuizAnswerBox">
          <div className="createdQuizInputBox">
            <input
              required
              className="createdQuizFormInput"
              type="text"
              name={`Q${question} Answer 3`}
              placeholder={`Q${question} Answer 3*`}></input>
          </div>
          <label htmlFor={`Q${question} Answer 3`}>Correct?</label>
          <select
            name={`isCorrect Q${question} Answer 3`}
            id={`Q${question} Answer 3`}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="createdQuizAnswerBox">
          <div className="createdQuizInputBox">
            <input
              required
              className="createdQuizFormInput"
              type="text"
              name={`Q${question} Answer 4`}
              placeholder={`Q${question} Answer 4*`}></input>
          </div>
          <label htmlFor={`Q${question} Answer 4`}>Correct?</label>
          <select
            name={`isCorrect Q${question} Answer 4`}
            id={`Q${question} Answer 4`}>
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
    );
  });

  return <>{formInputs}</>;
}
