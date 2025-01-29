import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import './index.css';

const Weather = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Privacy policy · Weather — how you feel"
        />

        <title>Privacy policy · Weather — how you feel</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/app/weather">
              <h3>Back to app</h3>
            </Link>
          </header>

          <h1 className="app__title">Privacy policy</h1>
          <h2 >Updated January 28th, 2025</h2>

          <p className="app__section">
            "Weather — how you feel" does not collect, store, or share any personal data of its users. This Privacy Policy explains how we handle user information in compliance with Apple’s guidelines.
          </p>

          <div className="app__section">
            <h3>Information We Do Not Collect</h3>
            <p>
              Our app does not collect or transmit any personal information, such as names, email addresses, or device identifiers, to our servers or any third party.
            </p>
          </div>

          <div className="app__section">
            <h3>Location Data</h3>
            <p>
              The app may request access to your location solely to provide weather information from OpenWeather. Your location data is used only locally on your device to make weather requests and is not stored or transmitted to any server, including ours or third-party servers, other than OpenWeather’s weather data API.
            </p>
          </div>

          <div className="app__section">
            <h3>Weather Data Requests</h3>
            <p>
              When you use our app, weather data is retrieved from the OpenWeather service based on your location. These requests are made directly from your device, and no additional user information is attached to the request.
            </p>
          </div>

          <div className="app__section">
            <h3>Third-Party Services</h3>
            <p>
              Our app uses OpenWeather API to fetch weather data. Please refer to OpenWeather’s Privacy Policy for details on their data practices: <a href='https://openweather.co.uk/privacy-policy' target="_blank" rel="noopener noreferrer">openweather.co.uk/privacy-policy</a>.
            </p>
          </div>

          <div className="app__section">
            <h3>Data Retention</h3>
            <p>
              We do not store any user data. Any data, such as your location, reapps on your device and is only retained temporarily for the app’s functionality.
            </p>
          </div>

          <div className="app__section">
            <h3>Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. If we make changes, the updated Privacy Policy will be available on this page with the “Last updated” date updated accordingly.
            </p>
          </div>

          <div className="app__section">
            <h3>Contact Us</h3>
            <p>
              If you have any questions or concerns about this Privacy Policy, you can contact us at <a href="mailto:milsinery@icloud.com">milsinery@icloud.com</a>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Weather;
