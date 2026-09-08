# TaskFlow - To-Do App

TaskFlow is a responsive productivity and task management web application developed as part of the Oasis Infobyte Web Development and Designing Internship.

The application allows users to create tasks with deadlines, manage urgent work, edit tasks, complete tasks, track progress, and retain their data between browser sessions.

## Features

### Task Creation

Users can create a task with:

- Task title
- Task description
- Deadline date
- Deadline time

The deadline field uses the browser's built-in date and time picker.

### Deadline Management

Each task has a specific deadline.

TaskFlow continuously checks task deadlines while the application is open.

When a task deadline passes, the task is automatically removed.

### Automatic Urgent Tasks

TaskFlow automatically moves approaching tasks into the Urgent section.

The urgency rules are:

- If a task originally has more than 24 hours before its deadline, it becomes urgent when 24 hours remain.
- If a task originally has less than 24 hours before its deadline, it becomes urgent when 3 hours remain.

Urgent tasks appear above normal pending tasks.

### Pending Tasks

Tasks that are not completed and have not yet reached their urgency threshold remain in the Pending Tasks section.

Pending tasks are ordered according to their deadline.

### Completed Tasks

Users can mark tasks as completed.

Completed tasks are moved to the Completed Tasks section.

Users can also restore completed tasks back to the active task list.

### Edit Tasks

Users can edit existing tasks.

The following information can be changed:

- Task title
- Task description
- Deadline date
- Deadline time

The application validates edited deadlines to ensure they are in the future.

### Delete Tasks

Users can delete individual tasks.

Completed tasks can also be removed together using the Clear Completed button.

### Task Statistics

TaskFlow displays live statistics for:

- Total tasks
- Urgent tasks
- Pending tasks
- Completed tasks

The counters update automatically whenever tasks change.

### Deadline Information

Each task displays its deadline.

Active tasks also display the amount of time remaining before the deadline.

### Local Storage

TaskFlow uses browser localStorage to preserve task data.

Tasks remain available after:

- Refreshing the page
- Closing the browser tab
- Reopening the application

No external database is required.

### Light and Dark Mode

TaskFlow includes both light and dark themes.

The selected theme is stored in localStorage so the preference remains after the browser is refreshed.

### Quote of the Day

TaskFlow contains a productivity quote section.

The application includes a collection of 50 short motivational and productivity quotes from well-known figures.

A random quote is displayed whenever the page loads.

### Responsive Design

The application is designed to work across:

- Desktop computers
- Laptops
- Tablets
- Mobile phones

### Accessibility

TaskFlow includes:

- Semantic HTML
- Form labels
- Accessible button labels
- Keyboard focus indicators
- Live validation messages
- Keyboard-friendly controls
- Reduced-motion support

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- Lucide Icons

## Project Structure

```text
WebDev-L2-TodoApp/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
```

## How to Run the Project

Clone the repository:

```bash
git clone https://github.com/HamphreyChinyerere/OIBSIP.git
```

Navigate to the To-Do App folder:

```bash
cd OIBSIP/WebDev-L2-TodoApp
```

Open `index.html` in your browser.

You can also open the project using the Live Server extension in Visual Studio Code.

## How to Use TaskFlow

1. Enter a task title.
2. Enter a task description.
3. Select a deadline date and time.
4. Click Add Task.
5. View the task in the Pending Tasks section.
6. Tasks approaching their deadline automatically move to the Urgent section.
7. Click the check button to mark a task as completed.
8. Click the pencil button to edit a task.
9. Click the delete button to remove a task.
10. Use the restore button to return a completed task to the active task list.
11. Use Clear Completed to remove all completed tasks.
12. Use the theme button to switch between light and dark mode.

## Urgency Logic

TaskFlow calculates urgency based on the amount of time originally available before the task deadline.

### Tasks with more than 24 hours available

```text
Deadline remaining <= 24 hours
→ Urgent
```

### Tasks with less than 24 hours available

```text
Deadline remaining <= 3 hours
→ Urgent
```

### Expired Tasks

```text
Current time >= Deadline
→ Task removed
```

## Data Storage

Task information is stored locally in the browser using:

```text
taskflow-tasks
```

Theme preferences are stored using:

```text
taskflow-theme
```

The application does not require a backend or external database.

## Screenshots

Project screenshots will be stored inside the `screenshots` directory.

Planned screenshots include:

- Main TaskFlow interface
- Task creation form
- Pending tasks
- Urgent tasks
- Completed tasks
- Dark mode
- Mobile responsive layout

## Internship Task

This project was created for the Oasis Infobyte Web Development and Designing Internship as part of the Level 2 To-Do Web App task.

## Repository

OIBSIP Repository:

https://github.com/HamphreyChinyerere/OIBSIP

## Author

Hamphrey Tanatswa Chinyerere

GitHub:

https://github.com/HamphreyChinyerere