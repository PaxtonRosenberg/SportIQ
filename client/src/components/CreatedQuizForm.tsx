export default function CreatedQuizForm() {
  const numberOfQuestions = [1, 2, 3, 4, 5];
  const numberOfAnswers = [1, 2, 3, 4];
  return (
    <div className="formBox">
      <div>
        <h1>Create a Quiz</h1>
      </div>
      <form>
        <div className="createdQuizInputBox">
          <input
            required
            className="createdQuizFormInput"
            type="text"
            name="quizName"
            placeholder="Quiz Name*"></input>
        </div>
        <div className="createdQuizInputBox">
          <input
            required
            className="createdQuizFormInput"
            type="text"
            name="quizImg"
            placeholder="Quiz Image URL*"></input>
        </div>

        {numberOfQuestions.map((question) => (
          <div className="createdQuizInputBox">
            <input
              required
              className="createdQuizFormInput"
              type="text"
              name={`Question${question}`}
              placeholder={`Question${question}*`}></input>

            {numberOfAnswers.map((answer) => (
              <div className="createdQuizAnswerBox">
                <div className="createdQuizInputBox">
                  <input
                    required
                    className="createdQuizFormInput"
                    type="text"
                    name={`Answer${answer}`}
                    placeholder={`Answer${answer}`}></input>
                </div>
                <label htmlFor="isCorrect">Correct?</label>
                <select name="isCorrect" id="isCorrect">
                  <option value="">Select</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            ))}
          </div>
        ))}
        <div className="buttonBox">
          <button className="submitButton">Submit</button>
        </div>
      </form>
    </div>
  );
}
