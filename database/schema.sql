set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
  "userId" serial PRIMARY KEY,
  "username" text,
  "email" text,
  "hashedPassword" text,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE "public"."dailyQuizzes" (
  "dailyQuizId" serial PRIMARY KEY,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique("dailyQuizId")
);

CREATE TABLE "public"."dailyQuizResults" (
  "dailyQuizResultId" serial PRIMARY KEY,
  "dailyQuizId" int,
  "userId" int,
  "score" int,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique("dailyQuizResultId")
);

CREATE TABLE "public"."userQuizResults" (
  "userQuizResultId" serial PRIMARY KEY,
  "userQuizId" int,
  "userId" int,
  "score" int,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique("userQuizResultId")
);

CREATE TABLE "public"."dailyQuizQuestions" (
  "dailyQuestionId" serial PRIMARY KEY,
  "dailyQuizId" int,
  "question" text,
  "difficulty" text,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique("dailyQuestionId")
);

CREATE TABLE "public"."dailyQuizAnswers" (
  "answerId" serial PRIMARY KEY,
  "dailyQuestionId" int,
  "answer" text,
  "isCorrect" boolean,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique("answerId")
);

CREATE TABLE "public"."userQuizzes" (
  "userQuizId" serial PRIMARY KEY,
  "userQuestionId" int,
  "quizName" text,
  "quizCreatorId" int,
  "quizTakerId" int,
  "correctCount" int,
  "incorrectCount" int,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique ("userQuestionId")
);

CREATE TABLE "public"."userQuizQuestions" (
  "userQuestionId" serial PRIMARY KEY,
  "userQuizId" int,
  "question" text,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique ("userQuizId")
);

CREATE TABLE "public"."userQuizAnswers" (
  "answerId" serial PRIMARY KEY,
  "userQuestionId" int,
  "answer" text,
  "isCorrect" text,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  unique ("userQuestionId")
);
