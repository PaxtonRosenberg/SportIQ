export type QuizResult = {
  score: number;
  dailyQuizId: number;
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
