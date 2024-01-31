type Answer = {
  dailyQuestionId: number;
  dailyAnswerId: number;
  isCorrect: boolean;
  answer: string;
};

type AnswersProps = {
  answers: Answer[];
  currentQuestion: number;
  selectedAnswer: number | null;
  onClick: (answersIndex: number, currentAnswers: Answer[]) => void;
};

export default function Answers({
  answers,
  currentQuestion,
  onClick,
  selectedAnswer,
}: AnswersProps) {
  const currentAnswers = answers.filter(
    (answer) => answer.dailyQuestionId === currentQuestion
  );
  const quizAnswers = currentAnswers.map((answer, index) => {
    const selected = selectedAnswer === index;
    return (
      <button
        key={index}
        className={
          selected
            ? answer.isCorrect
              ? 'correct answerButton'
              : 'incorrect answerButton'
            : 'answerButton'
        }
        onClick={() => onClick(index, currentAnswers)}>
        {answer.answer}
      </button>
    );
  });

  return <div className="answersBox">{quizAnswers}</div>;
}
