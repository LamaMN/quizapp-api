/* ── DOM refs ─────────────────────────────────────────────────── */
const _question          = document.getElementById('question');
const _options           = document.querySelector('.quiz-options');
const _checkBtn          = document.getElementById('check-answer');
const _playAgainBtn      = document.getElementById('play-again');
const _result            = document.getElementById('result');
const _answeredQuestions = document.getElementById('answered-questions');
const _totalQuestion     = document.getElementById('total-questions');
const _trophyPts         = document.getElementById('trophy-points');

/* ── Session state ───────────────────────────────────────────── */
let sessionPoints = parseInt(sessionStorage.getItem('sessionPoints') || '0', 10);
let correctAnswer = '', correctScore = 0, askedCount = 0, answeredCount = 0, totalQuestion = 0;
let results = null;

const API_KEY = 'qa_sk_eec8d3cb2ec03b3e86970da247c4f29dedae8379';
const BASE_URL = 'https://quizapi.io/api/v1';

/* ── Trophy display ──────────────────────────────────────────── */
function updateTrophy() {
    if (_trophyPts) _trophyPts.textContent = sessionPoints;
}
updateTrophy();

/* ── Utility ─────────────────────────────────────────────────── */
function encodeHTML(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ── Fetch questions ─────────────────────────────────────────── */
async function fetchQuestion() {
    const settings = JSON.parse(localStorage.getItem('quizSettings')) || {};
    const { mode, category, tag, difficulty, numQuestions, quizSearchTerm } = settings;

    totalQuestion = parseInt(numQuestions, 10) || 10;
    if (_totalQuestion) _totalQuestion.textContent = totalQuestion;

    // Loading state
    _question.textContent   = 'Loading questions…';
    _options.innerHTML      = '';
    _result.innerHTML       = '';
    _checkBtn.disabled      = true;

    try {
        if (mode === 'quiz' && quizSearchTerm) {
            // ── Two-step: find quiz by search term → load its questions ──
            await fetchByQuizSearch(quizSearchTerm);
        } else {
            // ── Browse mode: questions endpoint with filters ──
            await fetchBrowseQuestions({ category, tag, difficulty, numQuestions: totalQuestion });
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError(`Failed to load questions: ${err.message}`);
    }
}

/* Step 1 of quiz mode: search quizzes, then load by quiz_id */
async function fetchByQuizSearch(searchTerm) {
    const params = new URLSearchParams({
        topic: searchTerm,
        limit: 5,
        sort: 'popular',
    });

    const res = await fetch(`${BASE_URL}/quizzes?${params}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!res.ok) throw new Error(`Quiz search failed (HTTP ${res.status})`);

    const json = await res.json();
    const quizzes = json.data ?? [];

    if (!quizzes.length) {
        showError(`No quiz found for "${searchTerm}". Try a different topic.`);
        return;
    }

    // Pick the best match (most plays)
    const quiz = quizzes[0];

    // Step 2: fetch questions for that quiz
    const qRes = await fetch(
        `${BASE_URL}/questions?quiz_id=${quiz.id}&include_answers=true`,
        { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    );

    if (!qRes.ok) throw new Error(`Failed to load quiz questions (HTTP ${qRes.status})`);

    const qJson = await qRes.json();
    const data  = qJson.data ?? [];

    // Shuffle and cap to requested question count
    const shuffled = data.sort(() => Math.random() - 0.5).slice(0, totalQuestion);

    if (shuffled.length === 0) {
        showError('No questions available for this quiz.');
        return;
    }

    results = shuffled;
    loadQuestion();
}

/* Browse mode: questions endpoint with filters */
async function fetchBrowseQuestions({ category, tag, difficulty, numQuestions }) {
    const params = new URLSearchParams();
    params.set('limit',  numQuestions);
    params.set('random', 'true');
    params.set('type',   'MULTIPLE_CHOICE');

    if (category && category !== 'any') params.set('category', category);
    if (tag)                            params.set('tags', tag);
    if (difficulty && difficulty !== 'any') params.set('difficulty', difficulty.toUpperCase());

    const res = await fetch(`${BASE_URL}/questions?${params}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
    }

    const json = await res.json();
    const data = json.data ?? json;

    if (Array.isArray(data) && data.length > 0) {
        results = data;
        loadQuestion();
    } else {
        showError('No questions found for that combination. Try a different category or difficulty.');
    }
}

function showError(msg) {
    _question.innerHTML     = '';
    _result.innerHTML       = `<p class="result-warning"><i class="fas fa-exclamation-triangle"></i> ${msg}</p>`;
    _checkBtn.style.display = 'none';
}

/* ── Load / display question ─────────────────────────────────── */
function loadQuestion() {
    if (!results || results.length === 0) return;
    if (askedCount >= results.length)     return;

    _result.innerHTML = '';
    showQuestion(results[askedCount]);
}

function showQuestion(data) {
    _checkBtn.disabled      = false;
    _checkBtn.style.display = 'block';

    const q = parseQuestion(data);
    correctAnswer = q.correctAnswer;

    _question.innerHTML =
        `${encodeHTML(q.text)}<br><span class="category">${encodeHTML(q.category)}</span>`;

    // Shuffle the answers so correct isn't always in same position
    const shuffled = q.answers.sort(() => Math.random() - 0.5);

    _options.innerHTML = shuffled
        .map((a, i) => `<li data-answer="${encodeHTML(a.text)}">${i + 1}. <span>${encodeHTML(a.text)}</span></li>`)
        .join('');

    // Re-attach cursor-ring hover on dynamic lis
    const ring = document.getElementById('cursor-ring');
    if (ring) {
        _options.querySelectorAll('li').forEach(li => {
            li.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            li.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });
    }
}

/* ── Parse new API question format ──────────────────────────── */
function parseQuestion(data) {
    // Browse mode: data.text, data.answers = [{id, text, isCorrect}]
    // Quiz mode:   same structure but nested under data.data
    const text     = data.text || data.question || '';
    const category = data.category || data.quizTitle || '';
    const answers  = (data.answers || []).filter(a => a.text);

    const correctAns = answers.find(a => a.isCorrect);

    return {
        text,
        category,
        correctAnswer: correctAns ? correctAns.text : null,
        answers,
    };
}

/* ── Option selection (delegated) ────────────────────────────── */
_options.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    _options.querySelectorAll('li').forEach(opt => opt.classList.remove('selected'));
    li.classList.add('selected');
    _checkBtn.classList.add('focus');
});

/* ── Check answer ────────────────────────────────────────────── */
function checkAnswer() {
    _checkBtn.disabled = true;
    _checkBtn.classList.remove('focus');

    const selected = _options.querySelector('.selected');
    if (!selected) {
        _result.innerHTML = `<p class="result-warning"><i class="fas fa-question"></i> Please select an option first.</p>`;
        _checkBtn.disabled = false;
        return;
    }

    const selectedText = selected.querySelector('span').textContent.trim();
    const isCorrect    = selectedText === (correctAnswer || '').trim();

    // Points: correct = +10, wrong = 0 (no penalty)
    if (isCorrect) {
        correctScore++;
        sessionPoints += 10;
        sessionStorage.setItem('sessionPoints', sessionPoints);
        updateTrophy();

        // Animate trophy on correct
        const trophy = document.querySelector('.trophy-widget');
        if (trophy) {
            trophy.classList.add('pop');
            setTimeout(() => trophy.classList.remove('pop'), 400);
        }

        _result.innerHTML = `<p class="result-correct"><i class="fas fa-check"></i> Correct! +10 pts</p>`;
    } else {
        const explanation = results[askedCount - 0]?.explanation;
        _result.innerHTML =
            `<p class="result-incorrect"><i class="fas fa-times"></i> Incorrect.</p>` +
            `<small><b>Correct answer:</b> ${encodeHTML(correctAnswer)}</small>` +
            (explanation ? `<small class="explanation">${encodeHTML(explanation)}</small>` : '');
    }

    checkCount();
}

/* ── Progress & end-of-quiz ──────────────────────────────────── */
function checkCount() {
    askedCount++;
    answeredCount++;
    setCount();

    if (askedCount >= totalQuestion) {
        const pct = Math.round((correctScore / totalQuestion) * 100);
        const grade = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '✅ Good job!' : '📚 Keep practicing!';
        _result.innerHTML +=
            `<p class="result-score">` +
            `${grade} You scored <b>${correctScore} / ${totalQuestion}</b> (${pct}%) · Session: <b>${sessionPoints} pts</b>` +
            `</p>`;
        _playAgainBtn.style.display = 'block';
        _checkBtn.style.display     = 'none';
    } else {
        setTimeout(loadQuestion, 1500);
    }
}

function setCount() {
    if (_totalQuestion)     _totalQuestion.textContent     = totalQuestion;
    if (_answeredQuestions) _answeredQuestions.textContent  = answeredCount;
}

/* ── Restart ─────────────────────────────────────────────────── */
function restartQuiz() {
    answeredCount = askedCount = correctScore = 0;
    results = null;
    _playAgainBtn.style.display = 'none';
    _checkBtn.style.display     = 'block';
    _checkBtn.classList.remove('focus');
    _checkBtn.disabled = false;
    setCount();
    fetchQuestion();
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
    setCount();
    fetchQuestion();
});

/* ── Theme Toggle ──────────────────────────────────────────── */
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    const isLight = document.body.classList.contains('light-mode');
    themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const nowLight = document.body.classList.contains('light-mode');
        localStorage.setItem('lightMode', nowLight);
        themeToggleBtn.innerHTML = nowLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}