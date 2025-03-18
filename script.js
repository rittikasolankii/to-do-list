// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const tasksCounter = document.getElementById('tasks-counter');
const clearCompletedBtn = document.getElementById('clear-completed');

// App state
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);
    
    li.innerHTML = `
        <div class="task-checkbox">
            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
        </div>
        <span class="task-text">${task.text}</span>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    // Event listeners for task actions
    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    
    checkbox.addEventListener('click', () => toggleTaskStatus(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return li;
}

// Function to render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    updateTasksCounter();
}

// Function to add a new task
function addTask(text) {
    if (text.trim() === '') return;
    
    const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
}

// Function to toggle task completion status
function toggleTaskStatus(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Function to clear all completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Function to update tasks counter
function updateTasksCounter() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = activeTasks;
}

// Function to set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Event listener for form submission (add task)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
});

// Event listeners for filter buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        setFilter(filter);
    });
});

// Event listener for clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
renderTasks();