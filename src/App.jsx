import React, { useState } from 'react';
import './WeatherLookup.css';

function WeatherLookup() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const API_KEY = 'bd780ce5ce0907c93fa50894fbaab958';

  const fetchLatLon = async () => {
    if (!city || !country) {
      setError('Please enter both city and country');
      return;
    }

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Lat Lon');
      }

      const data = await response.json();
      if (data.length === 0){
        setError('No such city/country found')
        setWeatherData(null);
        return
      }
      fetchWeather(data[0].lat, data[0].lon)
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch Lat Lon');
      setWeatherData(null);
    }
  };
  
  const fetchWeather = async (lat, lon) => {
    if (!city || !country) {
      setError('Please enter both city and country');
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      data.time = new Date().toLocaleString()
      setWeatherData(data);
      setError('');
      const newSearch = {
        city,
        country,
        time: data.time,
      };
      setSearchHistory([newSearch, ...searchHistory]); // Add new search to the beginning
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    }
  };
  
  const searchFromHistory = (city, country) => {
    setCity(city);
    setCountry(country);
    fetchLatLon();
  };

  const deleteFromHistory = (index) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
  };
  const clearInput = () => {
    setCity('')
    setCountry('')
  }

  return (
    <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ maxWidth: '50vw'}}>
        <h2>Weather Lookup</h2>
        
        {/* Input Section */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='textInput'
          />
          
          <input
            type="text"
            placeholder="Enter Country Code (e.g., US, UK)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className='textInput'
          />
          
          <button 
            onClick={fetchLatLon}
            className='search-button button'
          >
            Search
          </button>
          <button 
            onClick={clearInput}
            className='clear-button button'
          >
            Clear
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className='error-message'>
            {error}
          </div>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div style={{
            padding: '20px',
            borderRadius: '8px'
          }}>
            <p>{weatherData.name}, {weatherData.sys.country}</p>
            <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                style={{ width: '50px', marginRight: '10px' }}
              />
            <div style={{ display: 'flex', alignItems: 'center' }}>  
              <div>
                <p className='info'>Description: {weatherData.weather[0].description}</p>
                <p className='info'>Temperature: {Math.round(weatherData.main.temp)}°C</p>
                <p className='info'>Humidity: {weatherData.main.humidity}%</p>
                <p className='info'>Time: {weatherData.time}</p>
              </div>
            </div>
          </div>
        )}

        <h3>Search History</h3>
        <ul className="search-history">
          {searchHistory.map((search, index) => (
            <li className="search-history-item" key={index}>
              <div className="search-history-info">
                <strong>{index + 1}. </strong>
                {search.city}, {search.country} - {search.time}
              </div>
              <div className="search-history-buttons">
                <button
                  onClick={() => searchFromHistory(search.city, search.country)}
                  className="search-button"
                >
                  <i className="fas fa-search"></i>
                </button>
                <button
                  onClick={() => deleteFromHistory(index)}
                  className="delete-button"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
}

export default WeatherLookup;