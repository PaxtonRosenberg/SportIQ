/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
  authMiddleware,
} from './lib/index.js';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

type Answer = {
  answer: string;
  isCorrect: boolean;
  userAnswerId: number;
  userQuestionId: number;
};

type Question = {
  questions: any;
  question: string;
  difficulty: string;
  answers: Answer[];
  dailyQuestionId: number;
};

type Data = {
  quizSets: Question[];
};

async function readData(): Promise<Data> {
  const data = await readFile('./data.json', 'utf8');
  return JSON.parse(data);
}

async function getData() {
  const quizData = await readData();
  return quizData;
}

app.get('/api/users', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "users"
        order by "userId"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

async function createDailyQuizId() {
  const createDailyQuizId = `
  insert into "dailyQuizzes" default values
  returning "dailyQuizId";
  `;
  const params: [] = [];
  const quizData = await db.query(createDailyQuizId, params);
  const quiz = quizData.rows[0];
  const dailyQuizId = quiz.dailyQuizId;
  return dailyQuizId;
}

async function createDailyQuizQuestions(
  dailyQuizId: number,
  question: string,
  difficulty: string
) {
  const sql = `
      insert into "dailyQuizQuestions" ("dailyQuizId", "question", "difficulty")
      values ($1, $2, $3)
      returning *
      `;
  const params = [dailyQuizId, question, difficulty];
  const result = await db.query(sql, params);
  const newQuestion = result.rows[0];
  const dailyQuestionId = newQuestion.dailyQuestionId;
  return dailyQuestionId;
}

async function createDailyQuizAnswers(dailyQuestionId: number, answer: Answer) {
  const sql = `
  insert into "dailyQuizAnswers" ("dailyQuestionId", "answer", "isCorrect")
  values ($1, $2, $3)
  returning *
  `;

  const params = [dailyQuestionId, answer.answer, answer.isCorrect];
  const result = await db.query(sql, params);
  const newAnswer = result.rows[0];
  return newAnswer;
}

app.get('/api/dailyQuiz', async (req, res, next) => {
  try {
    const data = await getData();
    for (const quizSet of data.quizSets) {
      const dailyQuizId = await createDailyQuizId();
      for (const question of quizSet.questions) {
        const dailyQuestionId = await createDailyQuizQuestions(
          dailyQuizId,
          question.question,
          question.difficulty
        );
        for (let i = 0; i < 4; i++)
          await createDailyQuizAnswers(dailyQuestionId, question.answers[i]);
      }
    }
    res.status(201).json({ message: 'Quiz has been added successfully! :)' });
  } catch (err) {
    console.error('error', err);
    next(err);
  }
});

app.get('/api/dailyQuizQuestions/:dailyQuizId', async (req, res, next) => {
  try {
    const dailyQuizId = req.params.dailyQuizId;
    const sql = `
      select *
        from "dailyQuizQuestions"
        where "dailyQuizId" = ${dailyQuizId}
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/dailyQuizAnswers/:dailyQuizId', async (req, res, next) => {
  try {
    const dailyQuizId = req.params.dailyQuizId;
    const sql = `
      select *
        from "dailyQuizAnswers"
        join "dailyQuizQuestions" using ("dailyQuestionId")
        join "dailyQuizzes" using ("dailyQuizId")
        where "dailyQuizId" = ${dailyQuizId}
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

type User = {
  userId: number;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: string;
};

type Auth = {
  username: string;
  email: string;
  password: string;
};

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, email, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(
        400,
        'username, email and password are required fields'
      );
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "email", "hashedPassword")
      values ($1, $2, $3)
      returning *
    `;
    const params = [username, email, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body as Partial<Auth>;
    if (!email || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "username",
           "email",
           "hashedPassword",
           "createdAt"
      from "users"
     where "email" = $1
  `;
    const params = [email];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, username, hashedPassword, createdAt } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username, email, hashedPassword, createdAt };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

type QuizResult = {
  dailyQuizResultId: number;
  dailyQuizId: string;
  userId: string;
  loggedScore: number;
};

type UserQuizResult = {
  userQuizResultId: number;
  userQuizId: string;
  userId: string;
  loggedScore: number;
};

app.post('/api/dailyQuizResults', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }

    const { dailyQuizId, loggedScore } = req.body as Partial<QuizResult>;
    if (!dailyQuizId || !loggedScore) {
      throw new ClientError(400, 'dailyQuizId and score are required fields');
    }
    const sql = `
      insert into "dailyQuizResults" ("dailyQuizId", "userId", "score")
        values ($1, $2, $3)
        returning *;
    `;
    const params = [dailyQuizId, req.user?.userId, loggedScore];
    const result = await db.query<QuizResult>(sql, params);
    const [quizResult] = result.rows;
    res.status(201).json(quizResult);
  } catch (err) {
    next(err);
  }
});

app.post(
  '/api/auth/userQuizResults',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ClientError(401, 'not logged in');
      }

      const { userQuizId, userId, loggedScore } =
        req.body as Partial<UserQuizResult>;

      if (!userQuizId || !userId) {
        throw new ClientError(
          400,
          'userQuizId, userId and score are required fields'
        );
      }
      const sql = `
      insert into "userQuizResults" ("userQuizId", "userId", "score")
        values ($1, $2, $3)
        returning *;
    `;
      const params = [userQuizId, req.user?.userId, loggedScore];
      console.log(params);
      const result = await db.query<UserQuizResult>(sql, params);
      const [quizResult] = result.rows;
      res.status(201).json(quizResult);
    } catch (err) {
      next(err);
    }
  }
);

app.get('/api/dailyQuizResults', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }
    const sql = `
      select * from "dailyQuizResults"
        where "userId" = $1
        order by "dailyQuizId";
    `;
    const result = await db.query<User>(sql, [req.user?.userId]);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/allDailyQuizResults', async (req, res, next) => {
  try {
    const sql = `
      select * from "dailyQuizResults"
        order by "userId";
    `;
    const result = await db.query<User>(sql);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/allUserQuizResults', async (req, res, next) => {
  try {
    const sql = `
      select * from "userQuizResults"
        order by "userId";
    `;
    const result = await db.query<User>(sql);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

async function createUserQuizId(
  quizName: string,
  imgUrl: string,
  userId: number
) {
  const createUserQuizId = `
      insert into "userQuizzes" ("quizName", "imgUrl", "userId")
      values($1, $2, $3)
      returning *
    `;
  const params = [quizName, imgUrl, userId];
  const quizData = await db.query(createUserQuizId, params);
  const quiz = quizData.rows[0];
  const userQuizId = quiz.userQuizId;
  return userQuizId;
}

async function createUserQuizQuestions(userQuizId: number, question: string) {
  const sql = `
      insert into "userQuizQuestions" ("userQuizId", "question")
      values ($1, $2)
      returning *
      `;
  const params = [userQuizId, question];
  const result = await db.query(sql, params);
  const newQuestion = result.rows[0];
  const userQuestionId = newQuestion.userQuestionId;
  return userQuestionId;
}

async function createUserQuizAnswers(userQuestionId: number, answers: Answer) {
  const sql = `
  insert into "userQuizAnswers" ("userQuestionId", "answer", "isCorrect")
  values ($1, $2, $3)
  returning *
  `;

  const params = [userQuestionId, answers.answer, answers.isCorrect];
  const result = await db.query(sql, params);
  const newAnswer = result.rows[0];
  return newAnswer;
}

app.post('/api/auth/userQuizzes', authMiddleware, async (req, res, next) => {
  try {
    const { quizName, imgUrl, questions } = req.body;
    const userId = req.user?.userId;
    if (userId !== undefined) {
      const userQuizId = await createUserQuizId(quizName, imgUrl, userId);
      for (const question of questions) {
        const userQuestionId = await createUserQuizQuestions(
          userQuizId,
          question.question
        );

        for (const answer of question.answers) {
          await createUserQuizAnswers(userQuestionId, answer);
        }
      }
    }
    res.status(201).json('user quiz added');
  } catch (err) {
    next(err);
  }
});

app.get('/api/userQuizzes', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }
    const sql = `
      select * from "userQuizzes"
        where "userId" = $1
        order by "createdAt";
    `;
    const result = await db.query<User>(sql, [req.user?.userId]);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/allUserQuizzes', async (req, res, next) => {
  try {
    const sql = `
      select * from "userQuizzes"
        order by "createdAt";
    `;
    const result = await db.query(sql);
    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/userQuizzes/:userQuizId', async (req, res, next) => {
  try {
    const userQuizId = req.params.userQuizId;
    const sql = `
      select *
        from "userQuizzes"
        where "userQuizId" = ${userQuizId}
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/userQuizQuestions/:userQuizId', async (req, res, next) => {
  try {
    const userQuizId = req.params.userQuizId;
    const sql = `
      select *
        from "userQuizQuestions"
        where "userQuizId" = ${userQuizId}
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/userQuizAnswers/:userQuizId', async (req, res, next) => {
  try {
    const userQuizId = req.params.userQuizId;
    const sql = `
      select *
        from "userQuizAnswers"
        join "userQuizQuestions" using ("userQuestionId")
        join "userQuizzes" using ("userQuizId")
        where "userQuizId" = ${userQuizId}
        order by "userAnswerId"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

async function updateUserQuizId(
  quizName: string,
  imgUrl: string,
  userQuizId: number,
  userId: number
) {
  const sql = `
      update "userQuizzes"
        set "quizName" = $1,
            "imgUrl" = $2
        where "userQuizId" = $3 and "userId" = $4
        returning *;
    `;
  const params = [quizName, imgUrl, userId, userQuizId];
  const quizData = await db.query(sql, params);
  const quiz = quizData.rows[0];
  const userQuizIdToUpdate = quiz.userQuizId;
  return userQuizIdToUpdate;
}

async function updateUserQuizQuestions(
  question: string,
  userQuestionId: number,
  userQuizId: number
) {
  const sql = `
      update "userQuizQuestions"
        set "question" = $1
        where "userQuestionId" = $2 and "userQuizId" = $3
        returning *;
    `;
  const params = [question, userQuestionId, userQuizId];
  const result = await db.query(sql, params);
  const newQuestion = result.rows[0];
  const userQuestionIdToUpdate = newQuestion.userQuestionId;
  return userQuestionIdToUpdate;
}

async function updateUserQuizAnswers(answers: Answer, userQuestionId: number) {
  const sql = `
      update "userQuizAnswers"
        set "answer" = $1,
            "isCorrect" = $2
      where "userAnswerId" = $3 and "userQuestionId" = $4
        returning *;
    `;

  const params = [
    answers.answer,
    answers.isCorrect,
    answers.userAnswerId,
    userQuestionId,
  ];
  const result = await db.query(sql, params);
  const newAnswer = result.rows[0];
  return newAnswer;
}

app.put(
  '/api/auth/userQuizzes/:userQuizId',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ClientError(401, 'not logged in');
      }
      const userQuizId = Number(req.params.userQuizId);

      const { quizName, imgUrl, questions } = req.body;
      const userId = req.user?.userId;
      if (!userQuizId) {
        throw new ClientError(
          400,
          'userQuizId, quizName, imgUrl, and questions are required fields'
        );
      }

      if (userId !== undefined) {
        const userQuizIdToUpdate = await updateUserQuizId(
          quizName,
          imgUrl,
          userId,
          userQuizId
        );
        for (const question of questions) {
          await updateUserQuizQuestions(
            question.question,
            question.userQuestionId,
            userQuizIdToUpdate
          );

          for (const answer of question.answers) {
            await updateUserQuizAnswers(answer, question.userQuestionId);
          }
        }
      }
      res.status(201).json('user quiz updated');
    } catch (err) {
      next(err);
    }
  }
);

async function deleteUserQuizId(userQuizId: number, userId: number) {
  const sql = `
      delete from "userQuizzes"
        where "userId" = $1 and "userQuizId" = $2
        returning *;
    `;
  const params = [userQuizId, userId];
  const quizData = await db.query(sql, params);
  const quiz = quizData.rows[0];

  if (!quiz) {
    throw new ClientError(404, `Cannot find quiz with 'quizId' ${userQuizId}`);
  }

  return quiz.userQuizId;
}

async function deleteUserQuizQuestions(userQuizId: number) {
  const sql = `
      delete from "userQuizQuestions"
        where "userQuizId" = $1
    `;
  const params = [userQuizId];
  await db.query(sql, params);
}

async function deleteUserQuizAnswers(userQuestionId: number) {
  const sql = `
      delete "userQuizAnswers"
      where "userQuestionId" = $1
    `;

  const params = [userQuestionId];
  await db.query(sql, params);
}

app.delete(
  '/api/auth/userQuizzes/:userQuizId',
  authMiddleware,
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new ClientError(401, 'not logged in');
      }
      const userQuizId = Number(req.params.userQuizId);

      const userId = req.user?.userId;
      if (!userQuizId) {
        throw new ClientError(400, 'quiz was not deleted, error');
      }

      if (userId !== undefined) {
        await deleteUserQuizId(userId, userQuizId);
        await deleteUserQuizQuestions(userQuizId);

        // Fetch userQuestionIds associated with the quiz
        const questionsRes = await db.query(
          `
      SELECT "userQuestionId"
      FROM "userQuizQuestions"
      WHERE "userQuizId" = $1
    `,
          [userQuizId]
        );

        const userQuestionIds = questionsRes.rows.map(
          (row) => row.userQuestionId
        );

        // Delete answers associated with each question
        for (const userQuestionId of userQuestionIds) {
          await deleteUserQuizAnswers(userQuestionId);
        }
      }
      res.status(201).json('user quiz deleted');
    } catch (err) {
      next(err);
    }
  }
);

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
