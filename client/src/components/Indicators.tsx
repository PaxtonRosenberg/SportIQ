type IndicatorsProps = {
  questions: Question[];
  currentQuestion: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  prevAnswersResults: boolean[];
};

type Question = {
  dailyQuestionId: number;
  dailyQuizId: number;
  difficulty: string;
  question: string;
};

export default function Indicators({
  questions,
  currentQuestion,
  selectedAnswer,
  isCorrect,
  prevAnswersResults,
}: IndicatorsProps) {
  const indicators = questions.map((question, index) => {
    return prevAnswersResults.length > 0 &&
      prevAnswersResults.length > index ? (
      prevAnswersResults[index] ? (
        <div
          className="indicator correctIndicator"
          key={index}
          data-view={question.question}></div>
      ) : (
        <div
          className="indicator incorrectIndicator"
          key={index}
          data-view={question.question}></div>
      )
    ) : (
      <div
        className={
          currentQuestion === index && selectedAnswer !== null
            ? isCorrect
              ? 'indicator correctIndicator'
              : 'indicator incorrectIndicator'
            : 'indicator'
        }
        key={index}
        data-view={question.question}></div>
    );
  });
  return <div className="indicatorBox">{indicators}</div>;
}
