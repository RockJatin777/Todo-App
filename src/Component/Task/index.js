// Importing Popup from reactjs-popup package to update todo task and useState from React hooks to maintain state
import { Popup } from 'reactjs-popup';
import { useState } from "react";

// Importing update and delete icons from react-icons
import { FaDeleteLeft } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

// Importing CSS file for styling
import './index.css';

// Defining the Task component and accepting props
const Task = props => {
  // Destructuring tasksDetails and functions from props
  const { tasksDetails, onCheckedTask, onDeleteTask, onTaskUpdated } = props;
  // Extracting individual task details
  const { id, task_name, isComplete } = tasksDetails;

  // State for updating task name when user wants to update the todo task
  const [updateName, setUpdateName] = useState(task_name);
  
  // Function to handle name update input change
  const onUpdateName = event => {
    setUpdateName(event.target.value);
  };

  // Function to handle task update and passing updated details to the parent component
  const onUpdate = () => {
    onTaskUpdated(id, updateName);
  };

  // Function to handle checkbox change and passing details to the parent component to update task status
  const onChecked = () => {
    onCheckedTask(id);
  };

  // Function to handle delete button click and passing details to the parent component to delete the task
  const onDelete = () => {
    onDeleteTask(id);
  };

  return (
    // Rendering the task item
    <section className="todo-container" key={id}>
      {/* Checkbox to mark task as complete or incomplete */}
      <input type="checkbox" className="checkbox" checked={isComplete} onChange={onChecked} />
      <div className="todo-item">
        {/* Displaying the task name, applying a class if the task is complete */}
        <p className={isComplete ? "task-name" : ""}>{task_name}</p>
        <div>
          {/* Popup to update task name */}
          <Popup
            modal
            trigger={
              <button type="button" className="update-button"><FaEdit size={20} /></button>
            }>
            {close => (
              <section className="popup-container">
                {/* Input field for updating task name */}
                <input type="text" value={updateName} onChange={onUpdateName} className="user-input" />
                <div>
                  {/* Cancel and Update buttons inside the popup */}
                  <button type="button" className="popup-button" onClick={() => close()}>Cancel</button>
                  <button type="button" className="popup-button" onClick={onUpdate}>Update</button>
                </div>
              </section>
            )}
          </Popup>
          {/* Button to delete the task */}
          <button type="button" className="delete-button" onClick={onDelete}><FaDeleteLeft size={20} /></button>
        </div>
      </div>
    </section>
  );
};

// Exporting Task component
export default Task;
