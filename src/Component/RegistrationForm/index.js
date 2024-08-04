// Importing necessary hooks and packages
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const RegisterPage = () => {
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
    // State to store the confirm password input
    const [confirmPassword, setConfirmPassword] = useState('');
    // State to store error message for confirm password
    const [errorMsgForConfirmPassword, setErrorMsgForConfirmPassword] = useState('');
    
    // Initializing useNavigate hook for navigation
    const navigate = useNavigate();

    // useEffect hook to check for JWT token and navigate to home if token exists
    useEffect(() => {
        if (Cookies.get('jwt_token') !== undefined) {
            navigate('/');
        }
    }, [navigate]);

    // Function to check if the confirm password field is not empty
    const checkNotEmptyConfirmPassword = event => {
        if (event.target.value === "") {
            setErrorMsgForConfirmPassword("*Confirm Password can't be empty");
        } else {
            setErrorMsgForConfirmPassword('');
        }
    };

    // Function to check if the username field is not empty
    const checkNotEmptyUsername = event => {
        if (event.target.value === "") {
            setErrorMsgForUsername("*Username can't be empty");
        } else {
            setErrorMsgForUsername('');
        }
    };

    // Function to check if the password field is not empty
    const checkNotEmptyPassword = event => {
        if (event.target.value === "") {
            setErrorMsgForPassword("*Password can't be empty");
        } else {
            setErrorMsgForPassword('');
        }
    };

    // Function to handle confirm password input change
    const onChangeConfirmPassword = event => {
        setConfirmPassword(event.target.value);
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
        if (password === confirmPassword) {
            if (username !== "" && password.length > 7) {
                const userDetails = { username, password };
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userDetails),
                };
                const response = await fetch('http://localhost:3001/register', options);
                const data = await response.json();
                const jwtToken = data.jwtToken;
                Cookies.set('jwt_token', jwtToken, {
                    expires: 30,
                    path: '/',
                });
                navigate('/');
            } else {
                setShowSubmitErr(true);
                setSubmitErrorMsg('Please Provide Valid Username or Password');
            }
        } else {
            setShowSubmitErr(true);
            setSubmitErrorMsg('Password is not Matching....');
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

    // If JWT token exists, return null to prevent rendering the registration form
    if (Cookies.get('jwt_token') !== undefined) {
        return null;
    }

    // Rendering the registration form
    return (
        <div className="login-form-container">
            <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png" className="register-img" alt="website login" />
            <form className="form-container" onSubmit={submitForm}>
                <h1 className='register-page-heading'>Sign Up</h1>
                <div className="input-container">{renderUsernameField()}</div>
                <div className="input-container">{renderPasswordField()}</div>
                <div className='input-container'>
                    <label className="input-label" htmlFor="confirmPassword">
                        CONFIRM PASSWORD
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="password-input-field"
                        value={confirmPassword}
                        onChange={onChangeConfirmPassword}
                        onBlur={checkNotEmptyConfirmPassword}
                        placeholder="Confirm Password"
                    />
                    <p className='error-message'>{errorMsgForConfirmPassword}</p>
                </div>
                <button type="submit" className="login-button">
                    Sign Up
                </button>
                {showSubmitError && <p className='error-message'>{submitErrorMsg}</p>}
            </form>
        </div>
    );
};

// Exporting RegisterPage component
export default RegisterPage;
