/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

import React, { useState } from "react";
import "./index.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setError("");
      setWeather(null);

      const geocodeURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
      const geoResponse = await fetch(geocodeURL);
      const geoData = await geoResponse.json();

      if (!geoData.results) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherResponse = await fetch(weatherURL);
      const weatherData = await weatherResponse.json();

      setWeather({
        name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code: weatherData.current_weather.weathercode,
      });
    } catch {
      setError("Something went wrong!");
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return "Sunny";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    return "storm";
  };

  return (
    <div className="weather-container">
      <h2>Weather Now</h2>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Check</button>

      {error && <p style={{ color: "yellow" }}>{error}</p>}

      {weather && (
        <>
          <div className="weather-icon">{getWeatherIcon(weather.code)}</div>
          <h3>{weather.name}, {weather.country}</h3>
          <h2>{weather.temp}°C</h2>
          <div className="details">
            <p>Wind: {weather.wind} km/h</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
