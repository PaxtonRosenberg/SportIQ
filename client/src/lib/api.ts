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

export type DailyQuizResult = {
  score: number;
  dailyQuizId: number;
};

export type DailyQuizResultLeaderboard = {
  score: number;
  dailyQuizId: number;
  userId: number;
};

export type UserQuizResult = {
  score: number;
  userQuizId: number;
  userId: number;
};

export type UserQuizResultLeaderboard = {
  score: number;
  dailyQuizId: number;
  userId: number;
  userQuizId: number;
};

export type LoggedDailyQuizResult = {
  loggedScore: number;
  dailyQuizId: number;
};

export type LoggedUserQuizResult = {
  loggedScore: number;
  userQuizId: number;
  userId: number;
};

export type UserQuizDetails = {
  createdAt: Date;
  imgUrl: string;
  quizName: string;
  userId: number;
  userQuizId: number;
};

export type UserQuizQuestionsAndAnswers = {
  question: UserQuestion;
  answers: UserAnswers[];
};

export type UserQuiz = {
  userQuizId: number;
  quizName: string;
  imgUrl: string;
  userId: number;
  answers: UserAnswers[];
  isCorrect: boolean;
  question: UserQuestion[];
  useranswerId: number;
  userQuestionId: number;
  createdAt: Date;
};

export type UserQuestion = {
  question: string;
  userQuestionId: number;
  userQuizId: number;
};

export type UserAnswers = {
  answer: string;
  isCorrect: boolean;
  userAnswerId: number;
  userQuestionId: number;
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

export type UserQuizData = {
  userId: number | undefined;
  quizName: FormDataEntryValue | null;
  imgUrl: FormDataEntryValue | null;
};

export type EditedUserQuizData = {
  userId: number | undefined;
  quizName: FormDataEntryValue | null;
  imgUrl: FormDataEntryValue | null;
  userQuizId: number;
};

export type QuizDataToUpdate = {
  question: EditedQuestion[];
  answers: EditedAnswer[];
};

export type EditedQuestion = {
  question: string;
  userQuestionId: number;
  userQuizId: number;
  answers: EditedAnswer[];
};

export type EditedAnswer = {
  userQuestionId: number;
  userAnswerId: number;
  isCorrect: boolean;
  answer: string;
};

export type UserQuizDataToDelete = {
  userId: number | undefined;
  parsedUserQuizId: number;
};
