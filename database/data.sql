-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "dailyQuizzes"
  ("dailyQuizId")
  values
  (1)

insert into "dailyQuizQuestions"
("dailyQuizId", "question", "difficulty")
values
(1, 'Who was the top scorer of the 2014 FIFA World Cup?', 'Medium')
(1, 'In 2016, who won the Formula 1 World Constructor''s Championship for the third time in a row?', 'Medium')
(1, 'Which player holds the NHL record of 2,857 points?', 'Easy')
(1, 'Which country did Kabaddi, a contact sport involving tackling, originate from?', 'Medium')
(1, 'In baseball, how many fouls are an out?', 'Easy')

insert into "dailyQuizAnswers"
("dailyQuestionId", "answer", "isCorrect")
values
(1, 'Thomas Müller', false),
(1, 'Lionel Messi', false),
(1, 'Neymar', false),
(1, 'James Rodríguez', true);
(2, 'Scuderia Ferrari', false),
(2, 'McLaren Honda', false),
(2, 'Red Bull Racing Renault', false),
(2, 'Mercedes-AMG Petronas', true);
(3, 'Mario Lemieux', false),
(3, 'Sidney Crosby', false),
(3, 'Gordie Howe', false),
(3, 'Wayne Gretzky', true);
(4, 'Australia', false),
(4, 'Turkey', false),
(4, 'Cambodia', false),
(4, 'India', true);
(5, '5', false),
(5, '3', false),
(5, '2', false),
(5, '0', true);
