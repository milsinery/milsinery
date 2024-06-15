import { useEffect, useState } from 'react';
import './index.css';

type WeatherNowProps = {
  temp: number;
  description: string;
  wind: { speed: number; compass: string };
}

type WeatherTodayProps = {
  temp_min: number; 
  temp_max: number; 
  precipitation: number; 
}

const RenderWeatherNow = ({ temp, description, wind }: WeatherNowProps) => {
  const title = (temp: number) => `Now it's ${temp < 5 && temp >= -5 ? "cold" : temp >= 5 && temp <= 15 ? "coolly" : temp > 15 && temp <= 25 ? "nice" : temp > 25 && temp <= 30 ? "hot" : 'hot as hell'}.`
  const subTitle = (wind: any, description: string) => {
    const windPower = `${wind.speed <= 10 ? " with light" : wind.speed > 20 && wind.speed <= 30 ? "with strong" : wind.speed > 30 ? "with really strong" : "with"}`
    const windState = `${wind.compass.includes('N') ? "cold" : "warm"} ${wind.compass.includes('W') ? "wet" : "dry"} wind.`;
    return `${windPower} ${windState}`;
  };

  return (
    <>
      <div className='now'>
        <h1>{title(temp)}</h1>
        <h1>{description} { wind.speed > 1 ? subTitle(wind, description) : "without wind."}</h1>
      </div>
    </>
  );
}

const RenderWeatherToday = ({ temp_min, temp_max, precipitation }: WeatherTodayProps) => {
  return (
    <>
      <div className='today'>
        <h2>Today will feel like { temp_min === temp_max ? temp_min : `${temp_min} to ${temp_max}`}.</h2>
        <h2>{ precipitation >= 30 && precipitation < 60 ? "You can take an umbrella with you, because there is a slight chance of rain" : precipitation >= 60 ? "Take an umbrella with you, because it's going to rain" : "It won't rain" }.</h2>
      </div>
    </>
  );
}

const RenderWeatherWeek = () => {
  return (
    <>
      <div className='week'>
        <small>Forecast for the week — soon this year.</small>
      </div>
    </>
  );
}

const Weather = () => {
  const auth = { login: "d536a447", key: "77e3b5ed9de2fd82880ec3f20873273d" };
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [weatherNowData, setWeatherNowData] = useState({ temp: 0, description: '', wind: { speed: 0, compass: '' } });
  const [weatherTodayData, setWeatherTodayData] = useState({ temp_min: 0, temp_max: 0, precipitation: 0 });
  const [isFetchedData, fetchData] = useState(false);
  const [error, setError] = useState(null);

  const fetchNowWeatherData = async () => {
    const url = `http://api.weatherunlocked.com/api/current/${location.latitude},${location.longitude}?app_id=${auth.login}&app_key=${auth.key}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { feelslike_c, wx_desc, windspd_ms, winddir_compass } = data;
      setWeatherNowData({ temp: Math.round(feelslike_c), description: wx_desc, wind: { speed: Math.round(windspd_ms), compass: winddir_compass } });
      fetchData(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  const fetchTodayWeatherData = async () => {
    const url = `http://api.weatherunlocked.com/api/forecast/${location.latitude},${location.longitude}?app_id=${auth.login}&app_key=${auth.key}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { Days } = data;
      const today = Days[0];

      setWeatherTodayData( { temp_min: Math.round(today.temp_min_c), temp_max: Math.round(today.temp_max_c), precipitation: today.prob_precip_pct } );
      fetchData(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const defaultLocation = { latitude: 44.8125, longitude: 20.4612 };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          setLocation(defaultLocation);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocation(defaultLocation);
    }
  }, []);

  useEffect(() => {
    console.log(location);
 
    if (location.latitude !== 0 && location.longitude !== 0) {
      fetchNowWeatherData();
      fetchTodayWeatherData();
    }
  }, [location]);

  if (error) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
        <h1>Sorry, we can't get the weather. Try again later, please.</h1>
         </div>
      </main>
    );
  }

  if (location.latitude === 0 && location.longitude === 0) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <h1>Please let us know your location information.</h1>
         </div>
      </main>
    );
  }

  if (!isFetchedData) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <h1>We're getting the weather...</h1>
         </div>
      </main>
    );
  }

  return (
    <main className="main effect-fade-in ">
      <div className="main__wrapper">
        <div className='weather'>
          {RenderWeatherNow(weatherNowData)}
          {RenderWeatherToday(weatherTodayData)}
          {RenderWeatherWeek()}
        </div>
      </div>
    </main>
  );
};

export default Weather;
