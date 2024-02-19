import {
  LoggedDailyQuizResult,
  LoggedUserQuizResult,
  Question,
  Answer,
  UserQuizData,
  EditedUserQuizData,
} from './lib/api';

export async function addDailyQuizResult(
  quizResult: LoggedDailyQuizResult
): Promise<LoggedDailyQuizResult> {
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
  quizResult: LoggedUserQuizResult
): Promise<LoggedUserQuizResult> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(quizResult),
  };
  const res = await fetch('/api/auth/userQuizResults', req);
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

export async function updateUserQuiz(
  editedUserQuizData: EditedUserQuizData
): Promise<EditedUserQuizData> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(editedUserQuizData),
  };

  const res = await fetch(
    `/api/auth/userQuizzes/${editedUserQuizData.userQuizId}`,
    req
  );

  if (res.status === 401) {
    throw new Error(`Authentication failed ${res.status}`);
  } else if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

// Function to fetch user quiz details, questions, and answers
export async function fetchQuizDetails(
  userQuizId: string
): Promise<{ quizDetails: any; questions: Question[]; answers: Answer[] }> {
  try {
    // Fetch quiz details
    const quizDetailsResponse = await fetch(`/api/userQuizzes/${userQuizId}`);
    if (!quizDetailsResponse.ok) {
      throw new Error(`fetch Error ${quizDetailsResponse.status}`);
    }
    const quizDetails = await quizDetailsResponse.json();

    // Fetch questions for the quiz
    const questionsResponse = await fetch(
      `/api/userQuizQuestions/${userQuizId}`
    );
    if (!questionsResponse.ok) {
      throw new Error(`fetch Error ${questionsResponse.status}`);
    }
    const questions: Question[] = await questionsResponse.json();

    // Fetch answers for the quiz
    const answersResponse = await fetch(`/api/userQuizAnswers/${userQuizId}`);
    if (!answersResponse.ok) {
      throw new Error(`fetch Error ${answersResponse.status}`);
    }
    const answers: Answer[] = await answersResponse.json();

    return { quizDetails, questions, answers };
  } catch (error: any) {
    throw new Error(`Error fetching quiz details: ${error.message}`);
  }
}
