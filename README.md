<h1 align="center">
  <img width="60" src="https://github.com/user-attachments/assets/28abdff3-9bc1-4944-8acb-3d9a23c94170" alt="TriviaTrail Logo" style="border-radius: 50%; padding: 6px; border: 2px solid rgba(167,139,250,0.5); box-shadow: 0 0 15px rgba(124,58,237,0.3); background: #111118; vertical-align: middle; margin-right: 10px;" />
  TriviaTrail
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/REST_APIs-005571?style=for-the-badge&logo=openapi-initiative&logoColor=white" />
  <img src="https://img.shields.io/badge/DOM_Manipulation-4CAF50?style=for-the-badge&logo=javascript&logoColor=white" />
</p>

## Overview  
TriviaTrail is an interactive tech quiz web app built as a Web Development course assignment. The main goal of the assignment was to demonstrate how to use REST APIs, handle AJAX requests, and update the DOM dynamically without page reloads using HTML, CSS, and Vanilla JavaScript. 

The app pulls live trivia questions from [QuizAPI](https://quizapi.io/), tracking your score and giving immediate feedback.

---

## Project History & Refactoring

### The Initial Version
The first version of this project met the course requirements. You could pick basic categories (like Linux or DevOps), choose a difficulty, and fetch questions.

But it had some issues:
- The UI for picking categories was confusing and relied on popups that sometimes glitched.
- The layout didn't look great on mobile phones.
- It wasn't fully using the filtering tags that the QuizAPI provided.

### The Refactor (Current Version)
Recently, the app went through a major cleanup and UI update to fix those bugs and better use the API:
- **Removed buggy modals:** Replaced the confusing popups with simple "Quick Modes" (like Interview Prep or AWS Certification).
- **Better API usage:** The app now combines your selections to query the API with complex tags (e.g. asking the API for questions tagged with both `javascript` and `interview`).
- **New features:** Added a running points total (the trophy icon) that saves to your browser, an animated tags ribbon, and a working light/dark mode toggle.
- **Cleaner code:** Fixed animation bugs and cleaned up legacy CSS.

---

## Screenshots

<h3 align="center">Choosing Categories</h3> 

<p align="center">
  <b>Before</b><br>
  <img src="https://github.com/user-attachments/assets/4db83f27-342e-4379-ae2a-de7cb3efeca8" alt="Trivia Trail before refactoring" width="60%">
  <br><br>
  <b>After</b><br>
  <img src="https://github.com/user-attachments/assets/9a5e577c-2a1f-43a7-8289-2b4665e7390e" alt="Trivia Trail after refactoring (dark mode)" width="45%"> 
  &nbsp;
  <img src="https://github.com/user-attachments/assets/c4f4d376-e413-4c30-bacc-20ec6d835475" alt="Trivia Trail after refactoring (light mode)" width="45%">
</p>

<br>

<h3 align="center">Starting Quiz</h3>

<p align="center">
  <b>Before</b><br>
  <img src="https://github.com/user-attachments/assets/0c0ca143-04bb-4824-9c06-4b2a0aa37914" alt="Trivia Trail quiz before refactoring" width="60%"> 
  <br><br>
  <b>After</b><br>
  <img src="https://github.com/user-attachments/assets/4db8b9a8-aa91-4764-8b39-bf13cdcc2ec6" alt="Trivia Trail quiz after refactoring (dark mode)" width="45%">
  &nbsp;
  <img src="https://github.com/user-attachments/assets/c8a88660-9ef8-431b-a65a-298f6f8c2a5c" alt="Trivia Trail quiz after refactoring (light mode)" width="45%">
</p>

<br>

<h3 align="center">Correct Answer</h3>

<p align="center">
  <b>Before</b><br>
  <img src="https://github.com/user-attachments/assets/1ac878ec-cf2e-49b2-a74a-13733a84c15f" alt="Correct Answer Before" width="60%">
  <br><br>
  <b>After</b><br>
  <img src="https://github.com/user-attachments/assets/90e0a862-9da2-4a21-84e7-ef13c0004fd7" alt="Correct Answer After" width="60%">
</p>

<br>

<h3 align="center">Incorrect Answer (Added Explanations!)</h3>

<p align="center">
  <b>Before</b><br>
  <img src="https://github.com/user-attachments/assets/b1941993-78c1-4eaf-8c53-44e8af168c1a" alt="Incorrect Answer Before" width="60%"> 
  <br><br>
  <b>After</b><br>
  <img src="https://github.com/user-attachments/assets/a079e5b6-7259-49ec-9aaf-775c2004c1f8" alt="Incorrect Answer After" width="60%">
</p>

---

## Running the App
1. Clone the repository:  
   ```bash
   git clone https://github.com/lamamn/quiz-webapp-quizapi.git
   ```
2. Open `index.html` in your browser. *(Note: you need a valid QuizAPI key for it to pull live questions).*
