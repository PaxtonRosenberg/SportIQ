type ResultsProps = {
  results: boolean;
  score: number;
};

export default function Results({ results, score }: ResultsProps) {
  return (
    <div className="resultBox">
      {results ? (
        <div className="resultsModal">
          <div className="textBox">
            <div className="headerBox">
              <h1 className="statsText">Stats</h1>
            </div>
            <div className="resultTextBox">
              <p>{score}/5</p>
              <p>Result</p>
            </div>
            <div className="resultTextBox">
              <p>{score}/5</p>
              <p>Average Result</p>
            </div>
            <div className="resultTextBox">
              <p>1</p>
              <p>Quizzes Taken</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
