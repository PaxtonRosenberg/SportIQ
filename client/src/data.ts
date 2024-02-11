export type QuizResult = {
  score: number;
  dailyQuizId: number;
};

export type UserQuizResult = {
  score: number;
  userQuizId: number;
};

export type UserQuizData = {
  userId: number | undefined;
  quizName: FormDataEntryValue | null;
  quizImg: FormDataEntryValue | null;
};

export async function addDailyQuizResult(
  quizResult: QuizResult
): Promise<QuizResult> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(quizResult),
  };
  const res = await fetch('/api/dailyQuizResults', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function addUserQuizResult(
  quizResult: UserQuizResult
): Promise<UserQuizResult> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(quizResult),
  };
  const res = await fetch('/api/userQuizResults', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function addUserQuiz(
  userQuizData: UserQuizData
): Promise<UserQuizData> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(userQuizData),
  };

  const res = await fetch('/api/auth/userQuizzes', req);

  if (res.status === 401) {
    throw new Error(`Authentication failed ${res.status}`);
  } else if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}
