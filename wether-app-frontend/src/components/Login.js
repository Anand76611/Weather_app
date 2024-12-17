import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
//to set Token
const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(''); // Clear any previous errors
    try {
      const data = await loginUser({ username, password });
      if (data.token) {
        //Pass token to parent
        setToken(data.token);
        alert('Login Successful');
        navigate('/weather');
        throw new Error('Login failed. Please check your username and password.');
      }
    } catch (err) {
     
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your username and password.';
      setError(errorMessage); // Set error to show in UI
      alert(errorMessage); // Alert with error message
    } finally {
      setIsLoading(false); // End loading
    }
  };
//navigat to singnup
  const handleSignUpRedirect = () => {
    navigate('/signup'); 
  };

  return (
    <div className="login-container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <h2 className="login-header">Login</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>
        <div className="input-group password-input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
            disabled={isLoading} 
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-icon"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div className="sign-up-container">
          <button
            type="button"
            onClick={handleSignUpRedirect}
            className="sign-up-btn"
            disabled={isLoading} // Disable sign-up button while loading
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
