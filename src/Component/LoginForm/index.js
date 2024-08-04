// Importing Link from react-router-dom for navigation links
import { Link } from 'react-router-dom';
// Importing useEffect hook to perform side effects
import { useEffect } from 'react';
// Importing Cookies for handling JWT tokens
import Cookies from 'js-cookie';
// Importing useState hook to manage component state
import { useState } from 'react';
// Importing useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Importing CSS file for styling
import './index.css';

const LoginPage = () => {
    // State to store the username input
    const [username, setUserName] = useState('');
    // State to store the password input
    const [password, setPassword] = useState('');
    // State to store error message for username
    const [errorMsgForUsername, setErrorMsgForUsername] = useState('');
    // State to store error message for password
    const [errorMsgForPassword, setErrorMsgForPassword] = useState('');
    // State to handle whether to show submit error message
    const [showSubmitError, setShowSubmitErr] = useState(false);
    // State to store the submit error message
    const [submitErrorMsg, setSubmitErrorMsg] = useState('');
    // Initializing useNavigate hook for navigation
    const navigate = useNavigate();

    // useEffect hook to check for JWT token and navigate to home if token exists
    useEffect(() => {
        if (Cookies.get('jwt_token') !== undefined) {
            navigate('/');
        }
    }, [navigate]);

    // Function to check if the username field is not empty
    const checkNotEmptyUsername = event => {
        if (event.target.value === "") {
            setErrorMsgForUsername("*required");
        } else {
            setErrorMsgForUsername('');
        }
    };

    // Function to check if the password field is not empty
    const checkNotEmptyPassword = event => {
        if (event.target.value === "") {
            setErrorMsgForPassword("*required");
        } else {
            setErrorMsgForPassword('');
        }
    };

    // Function to handle username input change
    const onChangeUsername = event => {
        setUserName(event.target.value);
    };

    // Function to handle password input change
    const onChangePassword = event => {
        setPassword(event.target.value);
    };

    // Function to handle form submission
    const submitForm = async event => {
        event.preventDefault();
        const userDetails = { username, password };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        };
        const response = await fetch('http://localhost:3001/login', options);
        const data = await response.json();
        if (response.ok === true) {
            const jwtToken = data.jwtToken;
            Cookies.set('jwt_token', jwtToken, {
                expires: 30,
                path: '/',
            });
            navigate('/');
        } else {
            setShowSubmitErr(true);
            setSubmitErrorMsg(data.message);
        }
    };

    // Function to render password input field
    const renderPasswordField = () => (
        <>
            <label className="input-label" htmlFor="password">
                PASSWORD
            </label>
            <input
                type="password"
                id="password"
                className="password-input-field"
                value={password}
                onChange={onChangePassword}
                onBlur={checkNotEmptyPassword}
                placeholder="Password"
            />
            <p className='error-message'>{errorMsgForPassword}</p>
        </>
    );

    // Function to render username input field
    const renderUsernameField = () => (
        <>
            <label className="input-label" htmlFor="username">
                USERNAME
            </label>
            <input
                type="text"
                id="username"
                className="username-input-field"
                value={username}
                onChange={onChangeUsername}
                onBlur={checkNotEmptyUsername}
                placeholder="Username"
            />
            <p className='error-message'>{errorMsgForUsername}</p>
        </>
    );

    // If JWT token exists, return null to prevent rendering the login form
    if (Cookies.get('jwt_token') !== undefined) {
        return null;
    }

    // Rendering the login form
    return (
        <div className="login-form-container">
            <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png" className="login-img" alt="website login" />
            <form className="form-container" onSubmit={submitForm}>
                <h1 className='login-page-heading'>Login</h1>
                <div className="input-container">{renderUsernameField()}</div>
                <div className="input-container">{renderPasswordField()}</div>
                <button type="submit" className="login-button">
                    Login
                </button>
                {showSubmitError && <p className='error-message'>{submitErrorMsg}</p>}
                <p>If you don't have an account</p>
                <Link to="/register">
                    <p>Sign Up</p>
                </Link>
            </form>
        </div>
    );
};

// Exporting LoginPage component
export default LoginPage;
