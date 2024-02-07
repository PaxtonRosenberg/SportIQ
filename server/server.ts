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
};

type Question = {
  question: string;
  difficulty: string;
  answers: Answer[];
  dailyQuestionId: number;
};

type Data = {
  questions: Question[];
};

async function readData(): Promise<Data> {
  const data = await readFile('./data.json', 'utf8');
  return JSON.parse(data);
}

async function getData() {
  const quizData = await readData();
  const quizQuestions = quizData.questions;
  return quizQuestions;
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
    const dailyQuizId = await createDailyQuizId();
    for (const question of data) {
      const dailyQuestionId = await createDailyQuizQuestions(
        dailyQuizId,
        question.question,
        question.difficulty
      );
      for (let i = 0; i < 4; i++)
        await createDailyQuizAnswers(dailyQuestionId, question.answers[i]);
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
  score: string;
};

app.post('/api/dailyQuizResults', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }

    const { dailyQuizId, score } = req.body as Partial<QuizResult>;
    if (!dailyQuizId || !score) {
      throw new ClientError(400, 'dailyQuizId and score are required fields');
    }
    const sql = `
      insert into "dailyQuizResults" ("dailyQuizId", "userId", "score")
        values ($1, $2, $3)
        returning *;
    `;
    const params = [dailyQuizId, req.user?.userId, score];
    const result = await db.query<QuizResult>(sql, params);
    const [quizResult] = result.rows;
    res.status(201).json(quizResult);
  } catch (err) {
    next(err);
  }
});

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
