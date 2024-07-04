// importing popup from reactjs popup package to update todo task and useState from react hooks to maintain state
import {Popup} from 'reactjs-popup';
import { useState } from "react";

// importing uptate and delte icons from react-icons
import { FaDeleteLeft } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

// importing css file for styling...
import './index.css'

const Task = props => {
  // getting todo details and function form props 
  const {tasksDetails, onCheckedTask, onDeleteTask, onTaskUpdated} = props
  // extracting todo details 
  const {id, name, isCompleted} = tasksDetails

  // maintaining state for updating task when user want to update the todo task
  const [updateName, setUpdateName] = useState(name)
  
  // storing name by user using setter function of react hooks
  const onUpdateName = event => {
    setUpdateName(event.target.value)
  }

  // passing details to the upadate function which is used to update details in parent component
  const onUpdate = () => {
    onTaskUpdated(id, updateName)
  }

 // passing details to the checked function which is used to update details in parent component
  const onChecked = () =>{
    onCheckedTask(id)
  }

  // passing details to the delete function which is used to delete details in parent component
  const onDelete = () => {
    onDeleteTask(id)
  }

  return (
    <section className="todo-container"  key={id}>
      <input type="checkbox" className="checkbox" checked={isCompleted} onChange={onChecked} />
      <div className="todo-item">
        <p className={isCompleted ? "task-name" : ""}>{name}</p>
        <div>
            <Popup
              modal
              trigger={
                <button type="button" className="update-button"><FaEdit size={20} /></button>
              }>
                {close => (
                  <section className="popup-container">
                    <input type="text" value={updateName} onChange={onUpdateName} className="user-input" />
                    <div>
                      <button type="button" className="popup-button" onClick={() => close()}>Cancel</button>
                      <button type="button" className="popup-button" onClick={onUpdate}>Update</button>
                    </div>
                  </section>
                )}
              </Popup>
            <button type="button" className="delete-button" onClick={onDelete}><FaDeleteLeft size={20} /></button>
        </div>
      </div>
    </section>
  )
}

// exporting Task component
export default Task