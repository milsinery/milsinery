import { useEffect, useState } from 'react';
import './index.css';

type WeatherNowProps = {
  temp: number;
  description: string;
  name: string,
  wind: { speed: number; compass: number };
}

type WeatherTodayProps = {
  temp_min: number; 
  temp_max: number; 
  precipitation: number; 
}

const RenderWeatherNow = ({ temp, description, name, wind }: WeatherNowProps) => {
  const capitalizeFirstLetter = (string: string) => {
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const title = (temp: number) => `Now it's ${temp < 5 && temp >= -5 ? "cold" : temp >= 5 && temp <= 15 ? "coolly" : temp > 15 && temp <= 25 ? "nice" : temp > 25 && temp <= 30 ? "hot" : 'hot as hell'}`
  
  const subTitle = (wind: any, description: string) => {
    const getDirection = (degrees: number) => {
      if ((degrees >= 337.5 && degrees <= 360) || (degrees >= 0 && degrees < 22.5)) {
        return 'cold'; 
      } else if (degrees >= 67.5 && degrees < 112.5) {
        return 'dry'; 
      } else if (degrees >= 157.5 && degrees < 202.5) {
        return 'warm'; 
      } else if (degrees >= 247.5 && degrees < 292.5) {
        return 'wet'; 
      } else {
        return ''; 
      }
    }

    const windPower = `${wind.speed <= 10 ? " with light" : wind.speed > 20 && wind.speed <= 30 ? "with strong" : wind.speed > 30 ? "with really strong" : "with"}`
    const windState = `${getDirection(wind.compass)} wind.`;
    return `${windPower} ${windState}`;
  };

  return (
    <>
      <div className='now'>
        <h1>{title(temp)}{name.length > 0 && ` in ${name}`}.</h1>
        <h1>{capitalizeFirstLetter(description)} { wind.speed > 1 ? subTitle(wind, description) : "without wind."}</h1>
      </div>
    </>
  );
}

const RenderWeatherToday = ({ temp_min, temp_max, precipitation }: WeatherTodayProps) => {
  return (
    <>
      <div className='today'>
        <h3>Today's and weekly forecasts will be coming soon.</h3>
        <small>Powered by Open Weather.</small>
        {/* <h2>Today will feel like { temp_min === temp_max ? temp_min : `${temp_min} to ${temp_max}`}.</h2>
        <h2>{ precipitation >= 30 && precipitation < 60 ? "You can take an umbrella with you, because there is a slight chance of rain" : precipitation >= 60 ? "Take an umbrella with you, because it's going to rain" : "It won't rain" }.</h2> */}
      </div>
    </>
  );
}

const Weather = () => {
  const key = "422ff778e3bb5484a4b07787c510aa5b";

  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [weatherNowData, setWeatherNowData] = useState({ temp: 0, description: '', name: '', wind: { speed: 0, compass: 0 } });
  const [weatherTodayData, setWeatherTodayData] = useState({ temp_min: 0, temp_max: 0, precipitation: 0 });
  const [isFetchedData, fetchData] = useState(false);
  const [error, setError] = useState(null);

  const fetchNowWeatherData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${key}`
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { main, weather, wind, name, pop } = data;

      setWeatherNowData({ temp: Math.round(main.feels_like), description: weather[0].description, name, wind: { speed: Math.round(wind.speed), compass: wind.deg } });
      fetchData(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  const fetchTodayWeatherData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${key}`
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const today = data.list;

      // setWeatherTodayData( { temp_min: Math.round(today.temp_min_c), temp_max: Math.round(today.temp_max_c), precipitation: today.prob_precip_pct } );
      fetchData(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const defaultLocation = { latitude: 40.7128, longitude: 74.0060 };

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
          <h1>Getting location information...</h1>
         </div>
      </main>
    );
  }

  if (!isFetchedData) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <h1>Getting the weather...</h1>
         </div>
      </main>
    );
  }

  return (
    <main className={"main effect-fade-in " + (weatherNowData.temp < 15 ? "cold" : weatherNowData.temp >= 15 && weatherNowData.temp <= 25? "warm" : "hot")} >
      <div className="main__wrapper">
        <div className='weather'>
          {RenderWeatherNow(weatherNowData)}
          {RenderWeatherToday(weatherTodayData)}
        </div>
      </div>
      <h1 className={"hero " + (weatherNowData.temp < 15 ? "hero-cold" : weatherNowData.temp >= 15 && weatherNowData.temp <= 25? "hero-warm" : "hero-hot")}>{weatherNowData.temp}</h1>
    </main>
  );
};

export default Weather;
