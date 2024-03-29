import { Question } from '../lib/api';

type QuestionsProps = {
  questions: Question[];
  currentIndex: number;
};

export default function Questions({ questions, currentIndex }: QuestionsProps) {
  const quizQuestion = questions.map((question, index) => {
    return (
      <p key={index} className="questionText">
        {question.question}
      </p>
    );
  });
  return (
    <>
      <div className="questionBox">
        <div className="questions">{quizQuestion[currentIndex]}</div>
      </div>
    </>
  );
}
