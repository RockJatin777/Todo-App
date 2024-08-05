// Importing useState to maintain state, useEffect for side effects, and useCallback for memoizing functions
import { useEffect, useState, useCallback } from "react";

// Importing Cookies for handling JWT tokens
import Cookies from 'js-cookie';

// Importing useNavigate for navigation
import { useNavigate } from 'react-router-dom';

// Importing Task component to display todo list
import Task from "../Task";

// Importing CSS file for styling
import './index.css';

const Home = () => {
    // State to maintain the list of todo tasks
    const [todoTasks, setTasks] = useState([]);
    
    // State to maintain user input for adding tasks
    const [userInput, setUserInput] = useState('');
    // State to track task completion status
    const [isTaskCompleted, setIsTaskCompleted] = useState(true);
    // State to handle error messages when user input is empty
    const [errmsg, setErrMsg] = useState('');

    // Getting JWT token from cookies
    const jwtToken = Cookies.get('jwt_token');
    // Initializing useNavigate hook
    const navigate = useNavigate();

    // Function to fetch data from server
    const getData = useCallback(async () => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        };

        const response = await fetch('https://todo-app-xxko.onrender.com/todos', options);
        const data = await response.json();
        setTasks(data);
    }, [jwtToken]);

    // useEffect to check JWT token and fetch data on component mount
    useEffect(() => {
        if (jwtToken === undefined) {
            navigate('/login');
        } else {
            getData();
        }
    }, [getData, jwtToken, navigate]);

    // Handling user input and updating state
    const onUserInput = event => {
        setUserInput(event.target.value);
    }

    // Adding new task and updating the state and server
    const onAddTask = async () => {
        if (userInput === '') {
            setErrMsg("*Please enter a name to add task");
        } else {
            const taskDetails = { userInput, isComplete: false };
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskDetails),
            };
            const response = await fetch('https://todo-app-xxko.onrender.com/todos', options);
            const result = await response.json();
            console.log(result);
            setUserInput('');
            setErrMsg('');
            getData();
        }
    }

    // Logging out by removing JWT token and reloading the page
    const onLogOut = () => {
        Cookies.remove('jwt_token');
        window.location.reload();
    };

    // Marking a task as completed and updating the server
    const onChecked = async (id) => {
        setIsTaskCompleted(prev => !prev);
        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isComplete: isTaskCompleted }),
        };
        await fetch(`https://todo-app-xxko.onrender.com/todo/${id}`, options);
        getData();
    }

    // Deleting a task and updating the state and server
    const onDelete = async (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        };
        await fetch(`https://todo-app-xxko.onrender.com/todos/${id}`, options);
        getData();
    }

    // Updating a task's name and updating the server
    const onUpdate = async (id, updateName) => {
        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskName: updateName }),
        };
        await fetch(`https://todo-app-xxko.onrender.com/todos/${id}`, options);
        getData();
        window.location.reload();
    }

    // If JWT token is not available, return null
    if (jwtToken === undefined) {
        return null;
    }
    
    return (
        <article className="app-container">
            <h1 className="app-title">Welcome to the Todos App</h1>
            <section className="user-input-container">
                <input
                    className="user-input"
                    type="text"
                    placeholder="Task Name"
                    onChange={onUserInput}
                    value={userInput}
                />
                <p className="err-msg">{errmsg}</p>
                <section className="btn-section">
                    <button type="button" className="add-todo-button" onClick={onAddTask}>Add Task</button>
                    <button type="button" className="add-todo-button" onClick={onLogOut}>LogOut</button>
                </section>
            </section>
            <h2 className="todo-list-title">My Todos</h2>
            {todoTasks.length === 0 ? (
                <h1>Add Todo Task</h1>
            ) : (
                todoTasks.map(eachTask => (
                    // Passing props to the Task component 
                    <Task
                        key={eachTask.id}
                        tasksDetails={eachTask}
                        onCheckedTask={onChecked}
                        onDeleteTask={onDelete}
                        onTaskUpdated={onUpdate}
                    />
                ))
            )}
        </article>
    );
}
// Exporting Home component
export default Home;
