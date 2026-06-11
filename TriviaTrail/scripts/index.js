/* ── Session points ──────────────────────────────────────────── */
let sessionPoints = parseInt(sessionStorage.getItem('sessionPoints') || '0', 10);

function updateTrophy() {
    const el = document.getElementById('trophy-points');
    if (el) el.textContent = sessionPoints;
}

/* ── State ───────────────────────────────────────────────────── */
let showAll = false;
let selectedCategory = null;
let activeQuickMode = null;

/* ── DOM refs ────────────────────────────────────────────────── */
const buttonContainer = document.getElementById('buttonContainer');
const moreButton = document.getElementById('moreButton');
const numQuestionsSelect = document.getElementById('numQuestions');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');
const quickModesEl = document.getElementById('quickModes');
const activeTagsContainer = document.getElementById('activeTagsContainer');

/* ── Quick Mode definitions ──────────────────────────────────── */
const QUICK_MODES = [
    {
        id: 'interview',
        label: 'Interview Prep',
        icon: 'fa-solid fa-briefcase',
        autoSetDifficulty: 'medium',
        baseTags: ['interview'],
        needsCategory: true
    },
    {
        id: 'fundamentals',
        label: 'Fundamentals',
        icon: 'fa-solid fa-book-open',
        autoSetDifficulty: 'easy',
        baseTags: ['fundamentals', 'beginner'],
        needsCategory: true
    },
    {
        id: 'security',
        label: 'Web Security',
        icon: 'fa-solid fa-shield-halved',
        autoSetDifficulty: null,
        baseTags: ['security', 'web', 'network'],
        needsCategory: false,
        category: 'Programming'
    },
    {
        id: 'awscert',
        label: 'AWS Certification',
        icon: 'fa-brands fa-aws',
        autoSetDifficulty: 'hard',
        baseTags: ['aws', 'cloud', 'serverless', 'containers'],
        needsCategory: false,
        category: 'DevOps'
    }
];

/* ── Render quick mode chips ─────────────────────────────────── */
QUICK_MODES.forEach(mode => {
    const btn = document.createElement('button');
    btn.className = 'quick-mode-btn';
    btn.dataset.mode = mode.id;
    btn.innerHTML = `<i class="${mode.icon}"></i>${mode.label}`;
    btn.addEventListener('click', () => onQuickModeClick(mode));
    quickModesEl.appendChild(btn);
});

/* ── Render Active Tags ──────────────────────────────────────── */
function renderActiveTags(tagsArray) {
    if (!activeTagsContainer) return;
    activeTagsContainer.innerHTML = '';

    if (!tagsArray || tagsArray.length === 0) return;

    tagsArray.forEach(t => {
        const span = document.createElement('span');
        span.className = 'active-tag-chip';
        span.textContent = t;
        activeTagsContainer.appendChild(span);
    });
}

function computeCurrentTags() {
    let tags = [];

    if (selectedCategory && selectedCategory.tag) {
        tags.push(selectedCategory.tag);
    }

    const qm = QUICK_MODES.find(m => m.id === activeQuickMode);
    if (qm) {
        tags.push(...qm.baseTags);

        if (selectedCategory && selectedCategory.tag && qm.id === 'interview') {
            const cat = selectedCategory.tag;
            if (['javascript', 'react', 'typescript', 'html', 'css', 'vuejs'].includes(cat)) {
                tags.push('frontend');
            } else if (['python', 'nodejs', 'sql', 'java'].includes(cat)) {
                tags.push('backend');
            }
        }
    }

    // Deduplicate
    tags = [...new Set(tags)];
    renderActiveTags(tags);
    return tags;
}

/* ── Quick mode selection logic ──────────────────────────────── */
function onQuickModeClick(mode) {
    const isDeselecting = activeQuickMode === mode.id;

    quickModesEl.querySelectorAll('.quick-mode-btn').forEach(b => b.classList.remove('active'));
    difficultySelect.classList.remove('auto-set');

    if (isDeselecting) {
        activeQuickMode = null;
    } else {
        activeQuickMode = mode.id;
        quickModesEl.querySelector(`[data-mode="${mode.id}"]`).classList.add('active');
        if (mode.autoSetDifficulty) {
            difficultySelect.value = mode.autoSetDifficulty;
            difficultySelect.classList.add('auto-set');
        }

        // If it's a standalone mode, clear category
        if (!mode.needsCategory) {
            buttonContainer.querySelectorAll('.category-button').forEach(b => b.classList.remove('selected'));
            selectedCategory = null;
        }
    }

    computeCurrentTags();
}

/* ── Regular category buttons ────────────────────────────────── */
const PRIMARY_CATEGORIES = [
    { value: 'any', label: 'Random', icon: 'fa-solid fa-shuffle', tag: null },
    { value: 'Programming', label: 'Programming', icon: 'fa-solid fa-code', tag: null },
    { value: 'DevOps', label: 'DevOps', icon: 'fa-solid fa-infinity', tag: null },
    { value: 'Programming', label: 'JavaScript', icon: 'fa-brands fa-js', tag: 'javascript' },
    { value: 'Programming', label: 'Python', icon: 'fa-brands fa-python', tag: 'python' },
    { value: 'Programming', label: 'Node.js', icon: 'fa-brands fa-node-js', tag: 'nodejs' },
    { value: 'DevOps', label: 'Docker', icon: 'fa-brands fa-docker', tag: 'docker' },
];

const MORE_CATEGORIES = [
    { value: 'Programming', label: 'React', icon: 'fa-brands fa-react', tag: 'react' },
    { value: 'Programming', label: 'TypeScript', icon: 'fa-solid fa-t', tag: 'typescript' },
    { value: 'Programming', label: 'SQL', icon: 'fa-solid fa-database', tag: 'sql' },
    { value: 'DevOps', label: 'Linux', icon: 'fa-brands fa-linux', tag: 'linux' },
    { value: 'DevOps', label: 'Kubernetes', icon: 'fa-solid fa-dharmachakra', tag: 'kubernetes' },
    { value: 'DevOps', label: 'AWS', icon: 'fa-brands fa-aws', tag: 'aws' },
    { value: 'Programming', label: 'Git', icon: 'fa-brands fa-git-alt', tag: 'git' },
    { value: 'Programming', label: 'HTML / CSS', icon: 'fa-brands fa-html5', tag: 'html' },
    { value: 'Programming', label: 'Vue.js', icon: 'fa-brands fa-vuejs', tag: 'vuejs' },
    { value: 'Programming', label: 'Bash / Shell', icon: 'fa-solid fa-terminal', tag: 'bash' },
];

function makeButton(cat, isDynamic = false) {
    const btn = document.createElement('button');
    btn.className = 'category-button' + (isDynamic ? ' dynamic' : '');
    btn.dataset.value = cat.value;
    btn.dataset.tag = cat.tag || '';
    btn.dataset.label = cat.label;
    btn.innerHTML = `<i class="${cat.icon}"></i>${cat.label}`;
    return btn;
}

PRIMARY_CATEGORIES.forEach(cat => {
    buttonContainer.insertBefore(makeButton(cat), moreButton);
});

moreButton.addEventListener('click', () => {
    showAll = !showAll;
    buttonContainer.querySelectorAll('.category-button.dynamic').forEach(b => b.remove());

    if (showAll) {
        MORE_CATEGORIES.forEach(cat => buttonContainer.insertBefore(makeButton(cat, true), moreButton));
        moreButton.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        buttonContainer.style.maxHeight = buttonContainer.scrollHeight + 'px';
    } else {
        moreButton.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
        buttonContainer.style.maxHeight = '';
    }
});

buttonContainer.addEventListener('click', e => {
    const btn = e.target.closest('.category-button');
    if (!btn) return;

    buttonContainer.querySelectorAll('.category-button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCategory = { value: btn.dataset.value, tag: btn.dataset.tag, label: btn.dataset.label };

    // Clear quick mode if it doesn't support categories (like security)
    const qm = QUICK_MODES.find(m => m.id === activeQuickMode);
    if (qm && !qm.needsCategory) {
        activeQuickMode = null;
        quickModesEl.querySelectorAll('.quick-mode-btn').forEach(b => b.classList.remove('active'));
        difficultySelect.classList.remove('auto-set');
    }

    computeCurrentTags();
});

/* ── Start quiz ──────────────────────────────────────────────── */
startButton.addEventListener('click', () => {
    const qm = QUICK_MODES.find(m => m.id === activeQuickMode);

    if (qm && qm.needsCategory && !selectedCategory) {
        // Flash the button container red to remind user
        buttonContainer.style.transition = 'none';
        buttonContainer.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        buttonContainer.style.borderRadius = 'var(--radius-lg)';
        buttonContainer.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.15)';
        buttonContainer.style.animation = 'shake 0.4s ease';

        setTimeout(() => {
            buttonContainer.style.transition = 'border-color 0.4s ease, box-shadow 0.4s ease';
            buttonContainer.style.borderColor = 'transparent';
            buttonContainer.style.boxShadow = 'none';
            buttonContainer.style.animation = '';
        }, 500);
        return;
    }

    const numQuestions = numQuestionsSelect.value;
    const tags = computeCurrentTags();

    let finalCategory = selectedCategory ? selectedCategory.value : 'any';
    if (qm && !qm.needsCategory) finalCategory = qm.category;

    const finalLabel = qm ? `${selectedCategory ? selectedCategory.label + ' ' : ''}${qm.label}` : (selectedCategory ? selectedCategory.label : 'Random');

    const settings = {
        mode: 'browse',
        category: finalCategory,
        tag: tags.join(','),
        categoryLabel: finalLabel,
        difficulty: qm && qm.autoSetDifficulty ? qm.autoSetDifficulty : difficultySelect.value,
        numQuestions
    };

    localStorage.setItem('quizSettings', JSON.stringify(settings));
    window.location.href = 'quiz.html';
});

/* ── Trophy ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', updateTrophy);
updateTrophy();

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
