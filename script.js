document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");
    tasks.forEach(renderTask);
}

function addTask() {
    let taskText = prompt("Enter task:");
    if (taskText && taskText.trim() !== "") {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const newTask = { id: Date.now(), text: taskText.trim(), status: "todo" }; // Use a timestamp as a unique ID
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

function renderTask(task) {
    let taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("draggable", true);
    taskElement.ondragstart = drag;
    taskElement.dataset.taskId = task.id; // Store task ID for drag-and-drop

    let taskText = document.createElement("div");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    taskText.onclick = () => editTask(task);

    let actionButton = document.createElement("button");
    actionButton.className = "action-btn";
    actionButton.textContent = task.status === "done" ? "Reopen" : "Complete";
    actionButton.onclick = () => updateTaskStatus(task.id, task.status === "done" ? "in-progress" : "done");

    let deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(task.id);

    taskElement.appendChild(taskText);
    taskElement.appendChild(actionButton);
    taskElement.appendChild(deleteButton);
    document.getElementById(task.status).querySelector(".task-list").appendChild(taskElement);
}

function editTask(task) {
    let newText = prompt("Edit task:", task.text);
    if (newText && newText.trim() !== "" && newText !== task.text) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        tasks = tasks.map(t => t.id === task.id ? { ...t, text: newText.trim() } : t);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

function updateTaskStatus(taskId, newStatus) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("task-id");
    let column = event.target.closest(".column");
    if (column) updateTaskStatus(parseInt(taskId), column.id); // Convert taskId to integer
}

function drag(event) {
    let taskId = event.target.dataset.taskId;
    event.dataTransfer.setData("task-id", taskId);
}
