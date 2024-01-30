/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { readFile } from 'fs/promises';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
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

async function createDailyQuizId() {
  const createDailyQuizId = `
  insert into "dailyQuizzes" ("quizName")
  values ('test')
  returning "dailyQuizId"
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
    console.log('received');
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

app.get('/api/dailyQuizQuestions', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "dailyQuizQuestions"
        where "dailyQuizId" = 1
        order by "dailyQuestionId"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/dailyQuizAnswers', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "dailyQuizAnswers"
        where "dailyQuestionId" in (1, 2, 3, 4, 5)
    `;
    const result = await db.query(sql);
    res.json(result.rows);
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
