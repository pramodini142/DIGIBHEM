// ==========================================
// LearnHub - Learning Management System
// ==========================================

let courses =
    JSON.parse(localStorage.getItem("learnhubCourses")) || [];

let users =
    JSON.parse(localStorage.getItem("learnhubUsers")) || [];

let progress =
    Number(localStorage.getItem("learnhubProgress")) || 0;

let latestScore =
    localStorage.getItem("learnhubScore") || "";


// Reset progress when there are no courses
if (courses.length === 0) {
    progress = 0;
    latestScore = "";

    localStorage.setItem("learnhubProgress", "0");
    localStorage.removeItem("learnhubScore");
}


// ==========================================
// NAVIGATION
// ==========================================

function showSection(sectionId) {

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });

    document.getElementById(sectionId)
        .classList.add("active-section");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    document.querySelectorAll(".nav-item").forEach(item => {

        const text = item.textContent.trim().toLowerCase();

        if (
            (sectionId === "dashboard" && text === "dashboard") ||
            (sectionId === "courses" && text === "courses") ||
            (sectionId === "assessment" && text === "assessments") ||
            (sectionId === "progress" && text === "progress") ||
            (sectionId === "users" && text === "user management")
        ) {
            item.classList.add("active");
        }
    });

    const titles = {
        dashboard: "Dashboard",
        courses: "Courses",
        assessment: "Assessments",
        progress: "Progress",
        users: "User Management"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId];
}


// ==========================================
// USERS
// ==========================================

function registerUser() {

    const name =
        document.getElementById("userName").value.trim();

    const email =
        document.getElementById("userEmail").value.trim();

    const role =
        document.getElementById("userRole").value;

    const message =
        document.getElementById("userMessage");

    if (!name || !email) {
        message.textContent = "Please complete all required fields.";
        message.className = "form-message error";
        return;
    }

    if (!email.includes("@")) {
        message.textContent = "Please enter a valid email address.";
        message.className = "form-message error";
        return;
    }

    if (users.some(user =>
        user.email.toLowerCase() === email.toLowerCase()
    )) {
        message.textContent = "A user with this email already exists.";
        message.className = "form-message error";
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        role
    });

    localStorage.setItem(
        "learnhubUsers",
        JSON.stringify(users)
    );

    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";

    message.textContent =
        `${name} has been registered successfully as ${role}.`;

    message.className = "form-message success";

    renderUsers();
}


function renderUsers() {

    const list = document.getElementById("userList");

    list.innerHTML = "";

    if (users.length === 0) {
        list.innerHTML =
            '<p class="empty-state">No users registered yet.</p>';
        return;
    }

    users.forEach(user => {

        const row = document.createElement("div");

        row.className = "user-row";

        row.innerHTML = `
            <div class="user-avatar">
                ${escapeHTML(user.name.charAt(0).toUpperCase())}
            </div>

            <div class="user-details">
                <strong>${escapeHTML(user.name)}</strong>
                <span>${escapeHTML(user.email)}</span>
            </div>

            <span class="role-badge">
                ${escapeHTML(user.role)}
            </span>

            <button
                class="delete-button"
                onclick="deleteUser(${user.id})">
                Delete
            </button>
        `;

        list.appendChild(row);
    });
}


function deleteUser(id) {

    const user = users.find(user => user.id === id);

    if (!user) return;

    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
        return;
    }

    users = users.filter(user => user.id !== id);

    localStorage.setItem(
        "learnhubUsers",
        JSON.stringify(users)
    );

    renderUsers();
}


// ==========================================
// COURSES
// ==========================================

function addCourse() {

    const name =
        document.getElementById("courseName").value.trim();

    const instructor =
        document.getElementById("courseInstructor").value.trim();

    const description =
        document.getElementById("courseDescription").value.trim();

    if (!name || !instructor || !description) {
        alert("Please complete all course fields.");
        return;
    }

    courses.push({
        id: Date.now(),
        name,
        instructor,
        description
    });

    localStorage.setItem(
        "learnhubCourses",
        JSON.stringify(courses)
    );

    document.getElementById("courseName").value = "";
    document.getElementById("courseInstructor").value = "";
    document.getElementById("courseDescription").value = "";

    renderCourses();
    updateCourseCount();
}


function renderCourses() {

    const list = document.getElementById("courseList");
    const dashboard = document.getElementById("dashboardCourses");

    list.innerHTML = "";
    dashboard.innerHTML = "";

    if (courses.length === 0) {

        list.innerHTML =
            '<p class="empty-state">No courses available yet.</p>';

        dashboard.innerHTML =
            '<p class="empty-state">No courses available yet.</p>';

        return;
    }

    courses.forEach(course => {

        const card = document.createElement("div");

        card.className = "course-card";

        card.innerHTML = `
            <div class="course-icon">
                ${escapeHTML(course.name.charAt(0).toUpperCase())}
            </div>

            <div class="course-content">

                <h3>${escapeHTML(course.name)}</h3>

                <p>${escapeHTML(course.description)}</p>

                <span class="course-instructor">
                    Instructor: ${escapeHTML(course.instructor)}
                </span>

                <br>

                <button
                    class="delete-button"
                    onclick="deleteCourse(${course.id})">
                    Delete Course
                </button>

            </div>
        `;

        list.appendChild(card);


        const dashboardCard =
            document.createElement("div");

        dashboardCard.className = "dashboard-course";

        dashboardCard.innerHTML = `
            <div>
                <strong>${escapeHTML(course.name)}</strong>
                <span>${escapeHTML(course.instructor)}</span>
            </div>

            <span class="course-status">
                Available
            </span>
        `;

        dashboard.appendChild(dashboardCard);
    });
}


function deleteCourse(id) {

    const course = courses.find(course => course.id === id);

    if (!course) return;

    if (!confirm(`Are you sure you want to delete "${course.name}"?`)) {
        return;
    }

    courses = courses.filter(course => course.id !== id);

    localStorage.setItem(
        "learnhubCourses",
        JSON.stringify(courses)
    );

    if (courses.length === 0) {

        progress = 0;
        latestScore = "";

        localStorage.setItem("learnhubProgress", "0");
        localStorage.removeItem("learnhubScore");

        currentQuestion = 0;
        selectedAnswer = null;
        score = 0;
        userAnswers = [];
    }

    renderCourses();
    updateCourseCount();
    updateProgress();
    updateResultDisplay();
    loadQuestion();
}


function updateCourseCount() {

    document.getElementById("courseCount").textContent =
        courses.length;
}


// ==========================================
// PROGRESS
// ==========================================

function increaseProgress() {

    progress += 20;

    if (progress > 100) {
        progress = 100;
    }

    localStorage.setItem(
        "learnhubProgress",
        progress
    );

    updateProgress();

    if (progress === 100) {
        alert(
            "Congratulations! You have completed your learning progress."
        );
    }
}


function updateProgress() {

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("progressValue").textContent =
        progress + "%";

    document.getElementById("dashboardProgress").textContent =
        progress + "%";
}


function updateResultDisplay() {

    document.getElementById("latestScore").textContent =
        "Not attempted";

    document.getElementById("resultStatus").textContent =
        "Pending";
}


// ==========================================
// ASSESSMENT
// ==========================================

const questions = [

    {
        question: "What does HTML primarily define?",

        options: [
            "The structure of a web page",
            "The database of a website",
            "The server hardware",
            "The internet connection"
        ],

        answer: 0
    },

    {
        question:
            "Which language is mainly used to add interactivity to web pages?",

        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],

        answer: 2
    },

    {
        question:
            "Which technology is commonly used to style a web page?",

        options: [
            "CSS",
            "Python",
            "SQL",
            "Java"
        ],

        answer: 0
    }
];


let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let userAnswers = [];


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    const question = questions[currentQuestion];

    document.getElementById("questionText").textContent =
        question.question;

    document.getElementById("quizStatus").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    const options =
        document.getElementById("quizOptions");

    options.innerHTML = "";

    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.className = "quiz-option";

        button.textContent = option;

        button.onclick = function () {
            selectAnswer(index);
        };

        options.appendChild(button);
    });

    selectedAnswer = null;

    document.getElementById("quizResult").innerHTML = "";
}


// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(index) {

    selectedAnswer = index;

    document.querySelectorAll(".quiz-option")
        .forEach((button, buttonIndex) => {

            button.classList.remove("selected");

            if (buttonIndex === index) {
                button.classList.add("selected");
            }
        });
}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;
    }

    userAnswers[currentQuestion] =
        selectedAnswer;

    if (
        selectedAnswer ===
        questions[currentQuestion].answer
    ) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        finishQuiz();
    }
}


// ==========================================
// FINISH QUIZ + ANSWER REVIEW
// ==========================================

function finishQuiz() {

    const percentage =
        Math.round(
            (score / questions.length) * 100
        );

    latestScore =
        `${score}/${questions.length} (${percentage}%)`;

    localStorage.setItem(
        "learnhubScore",
        latestScore
    );

    document.getElementById("latestScore").textContent =
        latestScore;

    document.getElementById("resultStatus").textContent =
        percentage >= 60
            ? "Passed"
            : "Needs Improvement";


    // Build the complete answer review

    let review = `

        <div class="answer-review">

            <h3>Answer Review</h3>

    `;


    questions.forEach((question, index) => {

        const selected =
            userAnswers[index];

        const correct =
            question.answer;


        if (selected === correct) {

            review += `

                <div class="review-correct">

                    <strong>
                        ✓ Question ${index + 1} — Correct
                    </strong>

                    <p>
                        Your answer:
                        ${escapeHTML(
                            question.options[selected]
                        )}
                    </p>

                </div>

            `;

        } else {

            review += `

                <div class="review-wrong">

                    <strong>
                        ✗ Question ${index + 1} — Wrong
                    </strong>

                    <p>
                        Your answer:
                        <span>
                            ${escapeHTML(
                                question.options[selected]
                            )}
                        </span>
                    </p>

                    <p>
                        Correct answer:
                        <b>
                            ${escapeHTML(
                                question.options[correct]
                            )}
                        </b>
                    </p>

                </div>

            `;
        }
    });


    review += `</div>`;


    document.getElementById("quizResult").innerHTML =

        `

        <div class="quiz-final-result">

            <h3>Assessment Completed</h3>

            <p>
                Your Score:
                <strong>${latestScore}</strong>
            </p>

        </div>

        `

        +

        review;


    document.querySelector(".quiz-actions").innerHTML = `

        <button
            class="primary-button"
            onclick="restartQuiz()">

            Retake Assessment

        </button>
    `;
}


// ==========================================
// RETAKE QUIZ
// ==========================================

function restartQuiz() {

    currentQuestion = 0;
    selectedAnswer = null;
    score = 0;
    userAnswers = [];

    document.querySelector(".quiz-actions").innerHTML = `

        <button
            class="primary-button"
            onclick="nextQuestion()">

            Next Question

        </button>
    `;

    loadQuestion();
}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// ANSWER REVIEW DESIGN
// ==========================================

const reviewStyle =
    document.createElement("style");

reviewStyle.textContent = `

    .answer-review {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
    }

    .answer-review h3 {
        margin-bottom: 15px;
        color: #0f172a;
    }

    .review-correct,
    .review-wrong {
        padding: 15px;
        margin-bottom: 12px;
        border-radius: 8px;
    }

    .review-correct {
        background: #f0fdf4;
        border-left: 4px solid #16a34a;
    }

    .review-wrong {
        background: #fef2f2;
        border-left: 4px solid #dc2626;
    }

    .review-correct strong {
        color: #16a34a;
    }

    .review-wrong strong {
        color: #dc2626;
    }

    .review-correct p,
    .review-wrong p {
        margin-top: 6px;
        font-size: 13px;
    }

    .review-wrong span {
        color: #dc2626;
        font-weight: 600;
    }

    .review-wrong b {
        color: #16a34a;
    }

    .delete-button {
        border: none;
        background: #fee2e2;
        color: #dc2626;
        padding: 7px 11px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 10px;
    }

    .delete-button:hover {
        background: #fecaca;
    }

`;

document.head.appendChild(reviewStyle);


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    renderCourses();
    renderUsers();
    updateCourseCount();
    updateProgress();
    loadQuestion();

    if (latestScore !== "") {

        document.getElementById("latestScore").textContent =
            latestScore;

        const match =
            latestScore.match(/\((\d+)%\)/);

        const percentage =
            match ? parseInt(match[1]) : 0;

        document.getElementById("resultStatus").textContent =
            percentage >= 60
                ? "Passed"
                : "Needs Improvement";

    } else {

        updateResultDisplay();
    }
});