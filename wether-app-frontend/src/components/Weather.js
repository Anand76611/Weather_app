import React, { useState } from 'react';
import { getWeather } from '../api/api';

const Weather = ({ token, handleLogout }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await getWeather(city, token);
      setWeather(data);
    } catch (err) {
      setError('Error fetching weather. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    
      <form onSubmit={handleSubmit}>
      <h2>Weather Report</h2>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>

       <div class="info">
       {weather && (
        <div>
<h3 style={{ textTransform: 'uppercase', textAlign: 'center' }}>{weather.city}</h3>

 <br></br>
 <br></br>
 <p><strong>Temperature</strong>: {weather.temperature} °C</p>
<br></br>
          <p><strong>Description</strong>: {weather.description}</p>
        </div>
      )}

       </div>
         <button onClick={handleLogout}>Logout</button>
      </form>

      {error && <p>{error}</p>}

     

   
    </div>
  );
};

export default Weather;
