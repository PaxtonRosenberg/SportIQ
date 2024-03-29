import {
  LoggedDailyQuizResult,
  LoggedUserQuizResult,
  Question,
  Answer,
  UserQuizData,
  EditedUserQuizData,
  UserQuizDataToDelete,
  User,
} from './lib/api';

export async function addDailyQuizResult(
  quizResult: LoggedDailyQuizResult
): Promise<LoggedDailyQuizResult | undefined> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(quizResult),
  };
  if (!quizResult.dailyQuizId) {
    return;
  }

  const res = await fetch('/api/dailyQuizResults', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function handleEndOfDailyQuiz(
  user: User,
  questions: Question[],
  score: number
) {
  try {
    const userId = user.userId;
    const dailyQuizId = questions[0].dailyQuizId;
    const loggedScore = score;

    if (userId && dailyQuizId && loggedScore !== undefined) {
      const quizResult = { userId, dailyQuizId, loggedScore };

      await addDailyQuizResult(quizResult);
    } else {
      console.warn('incomplete quiz data. results not sent');
    }
  } catch (err) {
    console.error(err);
  }
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

export async function handleEndOfUserQuiz(
  user: User,
  questions: Question[],
  score: number
) {
  try {
    const userId = user.userId;
    const userQuizId = questions[0].userQuizId;
    const loggedScore = score;

    if (userId && userQuizId && loggedScore !== undefined) {
      const quizResult = { userId, userQuizId, loggedScore };

      await addUserQuizResult(quizResult);
    } else {
      console.warn('incomplete quiz data. results not sent');
    }
  } catch (err) {
    console.error(err);
  }
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

export async function deleteUserQuiz(
  userQuizDataToDelete: UserQuizDataToDelete
): Promise<UserQuizDataToDelete> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(userQuizDataToDelete),
  };

  const res = await fetch(
    `/api/auth/userQuizzes/${userQuizDataToDelete.parsedUserQuizId}`,
    req
  );

  if (res.status === 401) {
    throw new Error(`Authentication failed ${res.status}`);
  } else if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}
