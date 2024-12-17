import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if username is available
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/check-username/${username}`);
      return response.data.available; // Assuming the API returns { available: true/false }
    } catch (error) {
      console.error(error);
      return false; // If an error occurs, assume the username is not available
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if username is available
    const usernameAvailable = await checkUsernameAvailability(formData.username);
    if (!usernameAvailable) {
      alert('Username is already taken. Please choose another one.'); // Show alert when username is taken
      setLoading(false);
      return; // Stop the form submission if the username is not available
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert(response.data.message);
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Error during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <div>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUp;
