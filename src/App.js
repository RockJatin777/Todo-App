// importing useState to maintain state and uuid package for creating unique id for every todo task
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// importing Task component to display todo list
import Task from "./Task";
// importing css file to styling
import './App.css';

// creating a sample todo data to display
const tasklist = [
  {id: uuidv4(), name: 'Html', isCompleted: false},
  {id: uuidv4(), name: 'Css', isCompleted: false},
  {id: uuidv4(), name: 'JavaScript', isCompleted: false},
  {id: uuidv4(), name: 'React', isCompleted: false},
];

function App() {
  // adding sample data into state using react hooks and adding todo list to the local storage
  const [tasks, setTasks] = useState(() => {
    if(JSON.parse(localStorage.getItem('tasks')) === null){
      localStorage.setItem('tasks', JSON.stringify(tasklist))
    }
    return JSON.parse(localStorage.getItem('tasks'))
  })

  // maintaining state for task by user input and marked as completed the task without deleting
  const [userInput, setUserInput] = useState('')
  const [isTaskCompleted, setIsTaskCompleted] = useState(true)

  // storing user input in state using hooks setter function
  const onUserInput = event => {
    setUserInput(event.target.value)
  }

  // adding todo task to the todo list and updating in local storage
  const onAddTask = () => {
    const newTask = {id: uuidv4(), name: userInput, isCompleted: false}
    const newTaskList = [...tasks, newTask]
    setTasks(newTaskList)
    localStorage.setItem('tasks', JSON.stringify(newTaskList))
    setUserInput('')
  }

  // marking todo task as completed also upading local storage
  const onChecked = id => {
    setIsTaskCompleted((prev) => !prev)
    const newTaskList = tasks
    const index = newTaskList.findIndex(each => each.id === id)
    newTaskList[index].isCompleted = isTaskCompleted
    setTasks(newTaskList)
    localStorage.setItem('tasks', JSON.stringify(newTaskList));
  }

  // deleting todo task when user click on the the delete icon
  const onDelete = id => {
    const newTaskList = tasks.filter(each => each.id !== id)
    setTasks(newTaskList)
    localStorage.setItem('tasks', JSON.stringify(newTaskList));
  }
 // updaing the todo task as well as in local storage
  const onUpdate = (id, updateName) => {
    let newTaskList = tasks.filter(each => each.id !== id)
    const newTask = {id: uuidv4(), name: updateName, isCompleted: isTaskCompleted}
    newTaskList = [...newTaskList, newTask]
    setTasks(newTaskList)
    localStorage.setItem('tasks', JSON.stringify(newTaskList))
    window.location.reload()
  }

  return (
    // using semantic elements for UI
    <article className="app-container">
      <h1 className="app-title">Welcome to the Todos App</h1>
      <section className="user-input-container">
        <input className="user-input" type="text" placeholder="Task Name" onChange={onUserInput} value={userInput} />
        <button type="button" className="add-todo-button" onClick={onAddTask}>Add Task</button>
      </section>
      <h2 className="todo-list-title">My Todos</h2>
      {tasks.map(eachTask => (
        // passing props to the Task component 
        <Task key={eachTask.id} tasksDetails={eachTask} onCheckedTask={onChecked} onDeleteTask={onDelete} onTaskUpdated={onUpdate} />
      ))}
    </article>
  );
}

// exporting App component
export default App;
