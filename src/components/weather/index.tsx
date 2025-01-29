import { Link } from 'react-router-dom';
import './index.css';

const Weather = () => {
  return (
    <div className="weather-card">
      <Link className="weather__title" to="/weather">
        <h2>Weather — how you feel</h2>
        <p>Just the weather app without numbers, huh.</p>
      </Link>
    </div>
  );
};

export default Weather;
