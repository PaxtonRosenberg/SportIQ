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
  userId: number;
  score: number;
};
