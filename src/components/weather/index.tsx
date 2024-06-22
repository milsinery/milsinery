import { Link } from 'react-router-dom';
import './index.css';

const Weather = () => {
  return (
    <div className="weather-card">
      <Link className="weather__title" to="/weather">
        <h2>Weather without numbers</h2>
        <p>About the weather in simple words.</p>
      </Link>
    </div>
  );
};

export default Weather;
