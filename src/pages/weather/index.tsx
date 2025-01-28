import Helmet from 'react-helmet';
import './index.css';

const Weather = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="Weather without numbers" />
        <title>Weather</title>
      </Helmet>
``
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
        <h1>There was a hole here.</h1>
        <h1>It's gone now.</h1>
          </div>
        </main>
    </>
  );
};

export default Weather;
