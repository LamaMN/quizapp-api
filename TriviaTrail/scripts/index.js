let showAll = false;
let selectedCategory = null;
let selectedDifficulty = null;
let selectedNumQuestions = null;
let currentQuestionIndex = 0;
let questions = [];


const buttonContainer = document.getElementById('buttonContainer');
const moreButton = document.getElementById('moreButton');
const numQuestionsSelect = document.getElementById('numQuestions');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');

moreButton.onclick = function () {
    const additionalButtons = [
        { value: "laravel", label: "laravel", icon: "fa-brands fa-laravel" },
        { value: "react", label: "react", icon: "fa-brands fa-react" },
        { value: "devops", label: "devops", icon: "fa-solid fa-infinity" },
        { value: "sql", label: "sql", icon: "fa-solid fa-database" },
        { value: "docker", label: "docker", icon: "fa-brands fa-docker"},
        { value: "bash", label: "bash", icon: "fa-solid fa-terminal"},
        { value: "vuejs", label: "vuejs", icon: "fa-brands fa-vuejs" },
        { value: "linux", label: "linux", icon: "fa-brands fa-linux" },
        { value: "postgres", label: "postgres", icon: "fa-solid fa-database" },
    ];

    showAll = !showAll;

    if (showAll) {
        const existingButtons = buttonContainer.querySelectorAll('.category-button.dynamic');
        existingButtons.forEach(button => button.remove());


        additionalButtons.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button dynamic'; // Add a 'dynamic' class to identify these buttons
            button.setAttribute('data-value', category.value);
            button.innerHTML = `<i class="${category.icon}"></i> ${category.label}`;
            buttonContainer.insertBefore(button, moreButton);
        });
        buttonContainer.style.maxHeight = buttonContainer.scrollHeight + "px"; // Expand height smoothly
    } else {
        const dynamicButtons = buttonContainer.querySelectorAll('.category-button.dynamic');
        dynamicButtons.forEach(button => button.remove());
    }
};

buttonContainer.addEventListener('click', function (event) {
    
    if (event.target.classList.contains('category-button')) {
        const buttons = buttonContainer.querySelectorAll('.category-button');
        buttons.forEach(button => {
            button.classList.remove('selected');
            button.style.backgroundColor = "rgba(238, 238, 238, 0.10)";
            button.style.color = "#ffffff";
        });

        event.target.classList.add('selected');
        event.target.style.backgroundColor = "#441F48";
        event.target.style.color = "#ffffff";

        selectedCategory = event.target.getAttribute('data-value');
    }
});

numQuestionsSelect.addEventListener('change', function () {
    selectedNumQuestions = numQuestionsSelect.value;
});

difficultySelect.addEventListener('change', function () {
    selectedDifficulty = difficultySelect.value;

});

startButton.addEventListener('click', function () {

    const quizSettings = {
        category: selectedCategory || "any" ,
        difficulty: selectedDifficulty || "any",
        numQuestions: selectedNumQuestions || "10"
    };

    localStorage.setItem('quizSettings', JSON.stringify(quizSettings));
    window.location.href = "quiz.html";

});

