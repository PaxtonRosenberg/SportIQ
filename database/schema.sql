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
  "createdAt" TIMESTAMPTZ(6)
);

CREATE TABLE "public"."dailyQuizzes" (
  "dailyQuizId" serial PRIMARY KEY,
  "dailyQuestionId" int,
  "quizName" text,
  "quizTakerId" int,
  "correctCount" int,
  "incorrectCount" int,
  "createdAt" TIMESTAMPTZ(6),
  unique ("dailyQuestionId")
);

CREATE TABLE "public"."dailyQuizQuestions" (
  "dailyQuestionId" serial PRIMARY KEY,
  "dailyQuizId" int,
  "question" text,
  "difficulty" text,
  "isMultiple" bit,
  "isBoolean" bit,
  "createdAt" TIMESTAMPTZ(6),
  unique ("dailyQuizId")
);

CREATE TABLE "public"."dailyQuizAnswers" (
  "answerId" serial PRIMARY KEY,
  "dailyQuestionId" int,
  "answer" text,
  "isCorrect" bit,
  "isIncorrect" bit,
  "createdAt" TIMESTAMPTZ(6),
  unique ("dailyQuestionId")
);

CREATE TABLE "public"."userQuizzes" (
  "userQuizId" serial PRIMARY KEY,
  "userQuestionId" int,
  "quizName" text,
  "quizCreatorId" int,
  "quizTakerId" int,
  "correctCount" int,
  "incorrectCount" int,
  "createdAt" TIMESTAMPTZ(6),
  unique ("userQuestionId"),
  unique ("quizCreatorId"),
  unique("quizTakerId")
);

CREATE TABLE "public"."userQuizQuestions" (
  "userQuestionId" serial PRIMARY KEY,
  "userQuizId" int,
  "question" text,
  "isMultiple" bit,
  "isBoolean" bit,
  "createdAt" TIMESTAMPTZ(6),
  unique ("userQuizId")
);

CREATE TABLE "public"."userQuizAnswers" (
  "answerId" serial PRIMARY KEY,
  "userQuestionId" int,
  "answer" text,
  "isCorrect" bit,
  "isIncorrect" bit,
  "createdAt" TIMESTAMPTZ(6),
  unique ("userQuestionId")
);

ALTER TABLE "public"."dailyQuizzes" ADD FOREIGN KEY ("quizTakerId") REFERENCES "public"."users" ("userId");

ALTER TABLE "public"."dailyQuizQuestions" ADD FOREIGN KEY ("dailyQuestionId") REFERENCES "public"."dailyQuizzes" ("dailyQuizId");

ALTER TABLE "public"."dailyQuizQuestions" ADD FOREIGN KEY ("dailyQuestionId") REFERENCES "public"."dailyQuizzes" ("dailyQuestionId");

ALTER TABLE "public"."dailyQuizQuestions" ADD FOREIGN KEY ("dailyQuizId") REFERENCES "public"."dailyQuizzes" ("dailyQuizId");

ALTER TABLE "public"."dailyQuizQuestions" ADD FOREIGN KEY ("dailyQuestionId") REFERENCES "public"."dailyQuizAnswers" ("dailyQuestionId");

ALTER TABLE "public"."userQuizQuestions" ADD FOREIGN KEY ("userQuestionId") REFERENCES "public"."userQuizAnswers" ("userQuestionId");

ALTER TABLE "public"."userQuizQuestions" ADD FOREIGN KEY ("userQuizId") REFERENCES "public"."userQuizzes" ("userQuizId");

ALTER TABLE "public"."userQuizQuestions" ADD FOREIGN KEY ("userQuestionId") REFERENCES "public"."userQuizzes" ("userQuestionId");
