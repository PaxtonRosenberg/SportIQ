import { Answer } from '../lib/api';

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
  const quizAnswers = answers.map((answer, index) => {
    const isSelected = selectedAnswer !== null;
    const isIncorrect =
      isSelected && !answer.isCorrect && selectedAnswer === index;
    const isCorrect = answer.isCorrect;

    return currentQuestion === answer.dailyQuestionId ||
      currentQuestion === answer.userQuestionId ? (
      <button
        key={index}
        className={
          isSelected
            ? isCorrect
              ? 'correctAnswerButton'
              : isIncorrect
              ? 'incorrectAnswerButton'
              : 'postSelectionAnswerButton'
            : 'answerButton'
        }
        onClick={() => onClick(index, answers)}>
        {answer.answer}
      </button>
    ) : null;
  });

  return <div className="answersBox">{quizAnswers}</div>;
}
