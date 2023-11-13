// define variables for html id's
let startContainer = $("#starter-container");
let questionContainer = $("#question-container");
let endContainer = $("#end-container");
let highScoreContainer = $("#high-score-container");
let scoreContainer = $("#score-banner");
let correctEl = $("#correct");
let wrongEl = $("#wrong");

// define button variables
let startBtn = $("#start-game");
let goBackBtn = $("#go-back");
let clearHighScoreBtn = $("#clear-high-scores");

//define question and answer variables
let questionsEl = $("#question");
let answersEl = $("#answer-buttons");

// define score, time, and gameover state
let timerEl = $("#timer");
let score = 0;
timerEl.text("0");
let gameover = "";
let timeLeft;

// define score variables and an empty array to store high scores in
let viewHighScoreEl = $("#view-high-scores");
let listHighScoreEl = $("#high-score-list");
let initialsFormEl = $("#initials-form");
let highScores = [];
let submitScoreEl = $("#submit-score");

// define an empty array to shuffle the questions
let arrayShuffleQuestions = [];
let initQuestionIndex = 0;

// define an array with the questions/answer options/answers
let questions = [
  {
    q: "Arrays in Javascript can be used to store __________.",
    a: "4. all of the above",
    choices: [
      { choice: "1. numbers" },
      { choice: "2. booleans" },
      { choice: "3. strings" },
      { choice: "4. all of the above" },
    ],
  },
  {
    q: "What is jquery?",
    a: "2. a js library used to help speed up coding",
    choices: [
      { choice: "1. a query for j" },
      { choice: "2. a js library" },
      { choice: "3. a question about javascript" },
      { choice: "4. a testing method for checking js code" },
    ],
  },
  {
    q: "In the code -- setinterval(time(),1000) -- what is time()?",
    a: "1. callback function",
    choices: [
      { choice: "1. callback function" },
      { choice: "2. undefined" },
      { choice: "3. variable" },
      { choice: "4. all of the above" },
    ],
  },
  {
    q: "What syntax would call a function?",
    a: "4. function()",
    choices: [
      { choice: "1. var function" },
      { choice: "2. function" },
      { choice: "3. call function" },
      { choice: "4. function()" },
    ],
  },
  {
    q: "in Git Bash, how do you go up one level in your file directory?",
    a: "1. cd..",
    choices: [
      { choice: "1. cd.." },
      { choice: "2. ls .." },
      { choice: "3. cd" },
      { choice: "4. goback.." },
    ],
  },
  {
    q: "What does DOM stand for?",
    a: "2. Document Object Model",
    choices: [
      { choice: "1. Do Objects Model" },
      { choice: "2. Document Object Model" },
      { choice: "3. Do Oreos like Milk" },
      { choice: "4. Did Object Move?" },
    ],
  },
  {
    q: "In jquery, what is the short-hand way to point our javascript code to an id in HTML?",
    a: "1. $('')",
    choices: [
      { choice: "1. $('')" },
      { choice: "2. .getElementById()" },
      { choice: "3. .refHTML" },
      { choice: "4. .upperCase" },
    ],
  },
];

// timer function
let quizStartTime = function () {
  timeLeft = 30;

  let timerCountDown = setInterval(function () {
    timerEl.text(timeLeft);
    timeLeft--;

    if (gameover) {
      clearInterval(timerCountDown);
    }

    if (timeLeft < 0) {
      showScore();
      timerEl.text("0");
      clearInterval(timerCountDown);
    }
  }, 1000);
};

// function to start the "game"
let startGame = function () {
  startContainer.addClass("hide");
  startContainer.removeClass("show");
  questionContainer.addClass("show");
  questionContainer.removeClass("hide");
  arrayShuffleQuestions = questions.sort(() => Math.random() - 0.5);
  quizStartTime();
  setQuestions();
};

let resetAnswers = function () {
  while (answersEl.children().length > 0) {
    answersEl.children().remove();
  }
};

// function that hides the other containers and displays the questions container
let displayQuestions = function (index) {
  questionsEl.text(index.q);
  for (let i = 0; i < index.choices.length; i++) {
    let answerBtn = $("<button></button>");
    answerBtn.text(index.choices[i].choice);
    answerBtn.addClass("btn");
    answerBtn.addClass("answerbtn");
    answerBtn.on("click", answerCheck);
    answersEl.append(answerBtn);
  }
};

let setQuestions = function () {
  resetAnswers();
  displayQuestions(arrayShuffleQuestions[initQuestionIndex]);
};

let answerCorrect = function () {
  correctEl.addClass("banner");
  correctEl.removeClass("hide");
  wrongEl.removeClass("banner");
  wrongEl.addClass("show");
};

let answerWrong = function () {
  wrongEl.addClass("banner");
  wrongEl.removeClass("hide");
  correctEl.addClass("hide");
  correctEl.removeClass("banner");
};

// function to check the answers
let answerCheck = function (event) {
  let selectedanswer = event.target;
  if (arrayShuffleQuestions[initQuestionIndex].a === $(selectedanswer).text()) {
    answerCorrect();
    score = score + 10;
  } else {
    answerWrong();
    score = score - 1;
    timeLeft = timeLeft - 2;
  }

  initQuestionIndex++;
  if (initQuestionIndex < arrayShuffleQuestions.length) {
    setQuestions();
  } else {
    gameover = "true";
    showScore();
  }
};

// shows the scores by hiding the other containers
let showScore = function () {
  questionContainer.addClass("hide");
  questionContainer.removeClass("show");
  endContainer.addClass("show");
  endContainer.removeClass("hide");
  wrongEl.addClass("hide");
  wrongEl.removeClass("banner");
  correctEl.addClass("hide");
  correctEl.removeClass("banner");

  let displayScore = $("<p></p>");
  displayScore.text("Your score is " + score + "!");
  $("#score-banner").append(displayScore);
};

// creates high scores and saves them to local storage
let createHighScore = function (event) {
  event.preventDefault();
  let initials = $("#initials").val();
  if (!initials) {
    alert("Enter your initials!");
    return;
  }

  initialsFormEl[0].reset();

  let HighScore = {
    initials: initials,
    score: score,
  };

  highScores.push(HighScore);
  highScores.sort((a, b) => {
    return b.score - a.score;
  });

  listHighScoreEl.empty();

  for (var i = 0; i < highScores.length; i++) {
    var highscoreEl = $("<li>").addClass("high-score");
    highscoreEl.html(highScores[i].initials + " - " + highScores[i].score);
    listHighScoreEl.append(highscoreEl);
  }

  saveHighScore();
  displayHighScores();
};

let saveHighScore = function () {
  localStorage.setItem("highScore", JSON.stringify(highScores));
};

let loadHighScore = function () {
  let loadedHighScore = localStorage.getItem("highScore");
  if (!loadedHighScore) {
    return false;
  }

  loadedHighScore = JSON.parse(loadedHighScore);
  loadedHighScore.sort(function (a, b) {
    return b.score - a.score;
  });

  highScores = loadedHighScore;

  for (let i = 0; i < highScores.length; i++) {
    let highScoreEl = $("<li></li>");
    highScoreEl.addClass("high-score");
    highScoreEl.text(highScores[i].initials + " - " + highScores[i].score);
    listHighScoreEl.append(highScoreEl);
  }
};

let displayHighScores = function () {
  highScoreContainer.addClass("show");
  highScoreContainer.removeClass("hide");
  gameover = "true";

  if (endContainer.hasClass("show")) {
    endContainer.removeClass("show").addClass("hide");
  }

  if (startContainer.hasClass("show")) {
    startContainer.removeClass("show").addClass("hide");
  }

  if (questionContainer.hasClass("show")) {
    questionContainer.removeClass("show").addClass("hide");
  }

  if (correctEl.hasClass("show")) {
    correctEl.removeClass("show").addClass("hide");
  }

  if (wrongEl.hasClass("show")) {
    wrongEl.removeClass("show").addClass("hide");
  }
};

let clearScores = function () {
  highScores = [];

  listHighScoreEl.empty();
  saveHighScore();
};

let resetToStart = function () {
  startContainer.addClass("show").removeClass("hide");
  highScoreContainer.addClass("hide").removeClass("show");
  questionContainer.addClass("hide").removeClass("show");
  endContainer.addClass("hide").removeClass("show");
  scoreContainer.addClass("hide").removeClass("show");
  correctEl.addClass("hide").removeClass("show");
  wrongEl.addClass("hide").removeClass("show");
  gameover = "";
  timerEl.text("0");
  score = 0;
};

loadHighScore();
startBtn.on("click", startGame);
submitScoreEl.on("click", createHighScore);
viewHighScoreEl.on("click", displayHighScores);
goBackBtn.on("click", resetToStart);
clearHighScoreBtn.on("click", clearScores);
