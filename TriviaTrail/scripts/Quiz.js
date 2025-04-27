const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _answeredQuestions = document.getElementById('answered-questions');
const _totalQuestion = document.getElementById('total-questions');

let correctAnswer = "", correctScore = 0, askedCount = 0, answeredCount = 0, totalQuestion = 0;
var results;

// load question from API
async function fetchQuestion() {
    const quizSettings = JSON.parse(localStorage.getItem('quizSettings')) || {};
    let { category, difficulty, numQuestions, questionType } = quizSettings;
    if (category != "any") {
        category = "&category=" + category;
    } else {
        category = "";
    }
    if (difficulty != "any") {
        difficulty = "&difficulty=" + difficulty;
    } else {
        difficulty = "";
    }
    totalQuestion = numQuestions || 10; // Default to 10 questions if not set
    if (_totalQuestion) _totalQuestion.textContent = totalQuestion; // Ensure totalQuestion is displayed correctly

    const APIUrl = `https://quizapi.io/api/v1/questions?apiKey=92R3yrtgP25wZUB6xhXalI7B2ukFNNYWgiyb21G5${category}${difficulty}&limit=${numQuestions}&single_answer_only=true`;
    try {
        const result = await fetch(APIUrl);
        const data = await result.json();
        _result.innerHTML = "";

        if (data && data.length > 0) {
            results = data;


        } else {
            _result.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> No questions available. Please try again later.</p>`;
            _checkBtn.style.display = "none";
        }
    } catch (error) {
        _result.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> Failed to load questions. Please check your connection and try again.</p>`;
        console.error("Error fetching quiz data:", error);
    }

    loadQuestion();
}
function loadQuestion() {
    console.log(results);
    if (askedCount >= results.length) {
        return 0; // No more questions to load
    } else {
        showQuestion(results[askedCount]); // Use the `results` array
    }
}
// event listeners
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function () {
    fetchQuestion();
    eventListeners();
    if (_totalQuestion) _totalQuestion.textContent = totalQuestion;
    if (_answeredQuestions) _answeredQuestions.textContent = answeredCount;
});


// Utility function to encode HTML
function encodeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// display question and options
function showQuestion(data) {
    _checkBtn.disabled = false;
    question = getData(data);
    correctAnswer = question.correctAnswer;
    let incorrectAnswer = question.incorrectAnswers;
    console.log(correctAnswer);
    let optionsList = incorrectAnswer;

    _question.innerHTML = `${question.question} <br> <span class = "category"> ${question.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li tabindex="0"> ${index + 1}. <span>${encodeHTML(option)}</span> </li>
        `).join('')}
    `;
    selectOption();
}


function getData(data) {
    const question = data.question;

    const correctAnswers = data.correct_answers;
    let correctAnswerKey = Object.keys(correctAnswers).find(key => correctAnswers[key] === 'true');
    correctAnswerKey = correctAnswerKey.replace(/_correct$/, '');
    correctAnswer = data.answers[correctAnswerKey];

    let incorrectAnswers = Object.values(data.answers).filter(value => value !== null);

    if (incorrectAnswers.length > 4) {
        incorrectAnswers = incorrectAnswers.slice(0, 4);

        if (!incorrectAnswers.includes(correctAnswer)) {
            incorrectAnswers[Math.floor(Math.random() * 4)] = correctAnswer;
        }
    }

    return {
        question: question,
        correctAnswer: correctAnswer,
        incorrectAnswers: incorrectAnswers,
        category: data.category
    };
}

function changeButtonColor() {
    _checkBtn.classList.add('focus'); 
}


function selectOption() {
    _options.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            _options.querySelectorAll('li').forEach(opt => opt.classList.remove('selected'));

            option.classList.add('selected');
        });

        option.addEventListener('focus', changeButtonColor);
    });


}


function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer == (correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${encodeHTML(correctAnswer)}</small>`;
        }
        checkCount();
        _checkBtn.classList.remove('focus');
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}



function checkCount() {
    askedCount++;
    answeredCount++;
    setCount();
    if (askedCount == totalQuestion) {
        setTimeout(function () {
        }, 5000);
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function () {
            loadQuestion(); // Ensure the next question is loaded
        }, 300);
    }
}

function setCount() {
    if (_totalQuestion) _totalQuestion.textContent = totalQuestion; // Ensure totalQuestion is updated
    if (_answeredQuestions) _answeredQuestions.textContent = answeredCount;
}


function restartQuiz() {
    answeredCount = askedCount = correctScore = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.classList.remove('focus');
    _checkBtn.disabled = false;
    setCount();
    fetchQuestion();
}


document.getElementById('back-button').addEventListener('click', function (event) {

});