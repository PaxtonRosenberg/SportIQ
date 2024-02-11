export type User = {
  userId: number;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
};

export type Auth = {
  user: User;
  token: string;
};

export type QuizResult = {
  dailyQuizId: number;
  userQuizId: number;
  userId: number;
  score: number;
};

export type UserQuiz = {
  userQuizId: number;
  quizName: string;
  imgUrl: string;
  userId: number;
  answer: string;
  isCorrect: boolean;
  question: string;
  useranswerId: number;
  userQuestionId: number;
  createdAt: Date;
};

export type Question = {
  dailyQuestionId: number;
  dailyQuizId: number;
  difficulty: string;
  question: string;
  userQuestionId: number;
  userQuizId: number;
};

export type Answer = {
  dailyQuestionId: number;
  dailyAnswerId: number;
  userQuestionId: number;
  userAnswerId: number;
  isCorrect: boolean;
  answer: string;
};
