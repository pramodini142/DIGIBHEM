const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

function saveTasks() {
    localStorage.setItem("taskFlowTasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    if (pending.length === 0) {
        pendingTasks.innerHTML =
            '<p class="empty">No pending tasks.</p>';
    }

    if (completed.length === 0) {
        completedTasks.innerHTML =
            '<p class="empty">No completed tasks.</p>';
    }

    pending.forEach(task => {
        pendingTasks.appendChild(createTaskElement(task));
    });

    completed.forEach(task => {
        completedTasks.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    if (task.completed) {
        taskDiv.classList.add("completed");
    }

    const taskName = document.createElement("div");
    taskName.className = "task-name";
    taskName.textContent = task.text;

    const taskTime = document.createElement("div");
    taskTime.className = "task-time";

    taskTime.innerHTML =
        "Created: " + formatDate(task.createdAt);

    if (task.completedAt) {
        taskTime.innerHTML +=
            "<br>Completed: " + formatDate(task.completedAt);
    }

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    if (!task.completed) {

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = "Complete";

        completeButton.addEventListener("click", function () {

            task.completed = true;
            task.completedAt = new Date().toISOString();

            saveTasks();
            renderTasks();
        });

        buttons.appendChild(completeButton);

    } else {

        const undoButton = document.createElement("button");
        undoButton.className = "undo-btn";
        undoButton.textContent = "Move to Pending";

        undoButton.addEventListener("click", function () {

            task.completed = false;
            task.completedAt = null;

            saveTasks();
            renderTasks();
        });

        buttons.appendChild(undoButton);
    }

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {

        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    });

    buttons.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete) {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();
        }
    });

    buttons.appendChild(deleteButton);

    taskDiv.appendChild(taskName);
    taskDiv.appendChild(taskTime);
    taskDiv.appendChild(buttons);

    return taskDiv;
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

renderTasks();