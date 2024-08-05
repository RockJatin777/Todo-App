This is a Todo Application built with a React frontend and a Node.js backend using Express and SQLite. The application allows users to register, log in, create, update, delete, and mark tasks as complete.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

Navigate to the frontend directory:
### `cd my-app`
### `cd src`
### `npm start`

Project Structure

todo-application
├── backend
│   ├── server.js
│   └── package.json
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── Task
│   │   │   │   └── index.js
│   │   ├── pages
│   │   │   ├── LoginPage
│   │   │   │   └── index.js
│   │   │   ├── RegisterPage
│   │   │   │   └── index.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json


Features :-

Backend_:-

User registration and authentication with JWT
CRUD operations for tasks
SQLite database integration

Frontend :-

User login and registration
Create, update, delete, and mark tasks as complete
Responsive UI with React and CSS

Usage :-

Register a new user.
Log in with the registered user credentials.
Create new tasks, update existing tasks, delete tasks, and mark tasks as complete.

Technologies Used :-

Backend :-

Node.js
Express
SQLite
JWT for authentication
bcryptjs for password hashing

Frontend :-

React
react-router-dom for routing
js-cookie for handling cookies
reactjs-popup for modal popups
react-icons for icons

### Deployment

Frontend Project is deployed on vercel
Backend Project is deployed on Render

You can learn more in the https://todo-app-murex-mu.vercel.app/
