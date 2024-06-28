import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import './index.css';

const weatherDescription = (temp: any) => {
  if (temp <= -25) return "extremely cold";
  if (temp <= -20) return "frosty";
  if (temp <= -15) return "very cold";
  if (temp <= -10) return "cold";
  if (temp <= 0) return "mildly cold";
  if (temp <= 5) return "chilly";
  if (temp <= 10) return "cool";
  if (temp <= 15) return "mildly warm";
  if (temp <= 20) return "warm";
  if (temp <= 25) return "mildly hot";
  if (temp <= 30) return "hot";
  if (temp <= 35) return "very hot";
  if (temp <= 40) return "hot as hell";
  if (temp <= 45) return "deadly inferno";
  return "unknown weather";
}

const RenderWeatherNow = (arr: any) => {
  const { temp, description, name, wind } = arr;
  const capitalizeFirstLetter = (string: string) => {
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
        <h1>It's {weatherDescription(temp)}{name.length > 0 && ` in ${name}`}.</h1>
        <h2>{capitalizeFirstLetter(description)} {description.includes("rain") && "💦"} {wind.speed > 1 ? subTitle(wind, description) : "without wind."}</h2>
      </div>
    </>
  );
}

const RenderWeatherToday = (arr: any) => {
  const now = Math.round(new Date().getHours());

  const getPop = (arr: any) => {
    let rain = { pop: 0, time: 0 };

    for (const { time, pop } of arr) {
      if (pop === 0) continue;
      if (pop > rain.pop) {
        rain.pop = pop;
        rain.time = parseInt(time[11] + time[12]);
      };
    }
    return rain;
  }

  const getTemps = (arr: any) => {
    const minMax = { min: 0, max: 0 };
    for (const { temp } of arr) {
      if (temp > minMax.max) {
        minMax.max = temp
      } else {
        minMax.min = temp;
      }
    }
    return minMax;
  }

  const renderRainDescription = (rain: any, temp: number) => {
    const { pop, time } = rain;
    const getTimeofDay = (time: any) => `${now < time && time < 12 ? " in the morning" : now < time && time >= 12 && time < 17 ? " during the day" : now < time && time >= 17 && time < 21 ? " in the evening" : now < time && time >= 21 ? " late in the evening" : ""}`;

    if (temp < 0) {
      if (pop < 15) {
        return "without snow";
      } else if (pop < 30 && pop >= 15) {
        return `with a slight chance of snow${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `with a chance snow around${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `with snow around${getTimeofDay(time)}`;
      }
    } else if (temp >= 0 && temp < 5) {
      if (pop < 15) {
        return "without snow or rain";
      } else if (pop < 30 && pop >= 15) {
        return `with a slight chance of snow or rain 💦${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `with a chance of snow or rain 💦${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `with snow or rain 💦${getTimeofDay(time)}`;
      }
    } else {
      if (pop < 15) {
        return "without rain";
      } else if (pop < 30 && pop >= 15) {
        return `with a slight chance of rain 💦${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `with a chance of rain 💦${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `with rain 💦${getTimeofDay(time)}`;
      }
    }
  }

  const renderMovie = () => {
    return (
      <>
        <div className='now'>
          <p>If you decide to stay at home, we recommend watching one of <a href='https://www.imdb.com/chart/moviemeter' target="_blank" rel="noopener noreferrer">these popular movies →</a>.</p>
        </div>
      </>
    );
  }

  const rain = getPop(arr);
  const temps = getTemps(arr);
  const isBadWeather = now <= 12 && rain.pop >= 60 && temps.max <= 25;

  return (
    <>
      <div className='day today'>
        <h3>{now <= 12 ? "Today it's" : "Then it will be"} {weatherDescription(temps.max)} {renderRainDescription(rain, temps.max)}.</h3>
        <p>{rain.pop > 60 && renderMovie()}</p>
      </div>
    </>
  );
}

const RenderWeatherTomorrow = (arr: any) => {
  const getPop = (arr: any) => {
    let rain = { pop: 0, time: 0 };

    for (const { time, pop } of arr) {
      if (pop === 0) continue;
      if (pop > rain.pop) {
        rain.pop = pop;
        rain.time = parseInt(time[11] + time[12]);
      };
    }
    return rain;
  }

  const getTemps = (arr: any) => {
    const minMax = { min: 0, max: 0 };

    for (const { temp } of arr) {
      if (temp > minMax.max) {
        minMax.max = temp
      } else {
        minMax.min = temp;
      }
    }
    return minMax;
  }

  const renderRainDescription = (rain: any, temp: number) => {
    const { pop, time } = rain;

    const getTimeofDay = (time: any) => `${time < 12 ? "in the morning" : time >= 12 && time < 17 ? "during the day" : time >= 17 && time < 21 ? " in the evening" : " late in the evening"}`;

    if (temp < 0) {
      if (pop < 15) {
        return "It won't snow";
      } else if (pop < 30 && pop >= 15) {
        return `There is a slight chance snow ${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `There is a chance snow ${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `It's going to snow ${getTimeofDay(time)}`;
      }
    } else if (temp >= 0 && temp < 5) {
      if (pop < 15) {
        return "It won't snow or rain";
      } else if (pop < 30 && pop >= 15) {
        return `There is a slight chance of rain 💦 ${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `You can take an umbrella with you, because there is a chance of snow or rain 💦 ${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `Take an umbrella with you, because there is a chance of snow or rain 💦 ${getTimeofDay(time)}`;
      }
    } else {
      if (pop < 15) {
        return "It won't rain";
      } else if (pop < 30 && pop >= 15) {
        return `There is a slight chance of rain 💦 ${getTimeofDay(time)}`;
      } else if (pop >= 30 && pop < 60) {
        return `You can take an umbrella with you, because there is a chance of rain 💦 ${getTimeofDay(time)}`;
      } else if (pop >= 60) {
        return `Take an umbrella with you, because it's going to rain 💦 ${getTimeofDay(time)}`;
      }
    }
  }
  const rain = getPop(arr);
  const temps = getTemps(arr);

  return (
    <>
      <div className='day tomorrow'>
        <h3>Tomorrow it's expected to be {weatherDescription(temps.max)}. {renderRainDescription(rain, temps.max)}.</h3>
      </div>
    </>
  );
}

const renderOther = () => {
  return (
    <div className='about'>
      <small>The app in development, some features will come later.</small>
      <small>Powered by Open Weather.</small>
    </div>
  );
}

const Weather = () => {
  const key = "422ff778e3bb5484a4b07787c510aa5b";
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [weatherNowData, setWeatherNowData] = useState({ temp: 0, description: '', name: '', wind: { speed: 0, compass: 0 } });
  const [weatherTodayData, setWeatherTodayData] = useState([{ time: "", temp: 0, pop: 0, description: "", wind: { speed: 0, compass: 0 } }]);
  const [weatherTomorrowData, setWeatherTomorrowData] = useState([{ time: "", temp: 0, pop: 0, description: "", wind: { speed: 0, compass: 0 } }]);
  const [movie, setMovie] = useState({ title: "", overview: "" });
  const [isFetchedDataForNow, fetchDataForNow] = useState(false);
  const [isFetchedDataForTwoDays, fetchDataForTwoDays] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const lastRefreshTime: any = localStorage.getItem('lastRefreshTime');
  const now = new Date().getTime();

  const fetchNowWeatherData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${key}`

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { main, weather, wind, name } = data;

      setWeatherNowData({ temp: Math.round(main.feels_like), description: weather[0].description, name, wind: { speed: Math.round(wind.speed), compass: wind.deg } });
      fetchDataForNow(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  const fetchNextWeatherData = async () => {
    const currentDate = new Date().getDate().toString();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&&units=metric&appid=${key}`

    const getToday = (todayRangeTime: any) => {
      const nextDay = [];

      for (const item of todayRangeTime) {
        const itemDay = item.dt_txt[8] + item.dt_txt[9];
        if (itemDay === currentDate) {
          nextDay.push(item);
        }
      }

      const todayData = [];

      for (const item of nextDay) {
        todayData.push({ time: item.dt_txt, temp: Math.round(item.main.feels_like), pop: Math.round(item.pop * 100), description: item.weather[0].description, wind: { speed: item.wind.speed, compass: item.wind.deg } });
      }

      return todayData;
    }

    const getTomorrow = (next48Hours: any) => {
      const nextDay = [];

      for (const item of next48Hours) {
        const itemDay = item.dt_txt[8] + item.dt_txt[9];
        if (itemDay !== currentDate) {
          nextDay.push(item);
        }
      }

      const nextDayData = [];

      for (const item of nextDay) {
        nextDayData.push({ time: item.dt_txt, temp: Math.round(item.main.feels_like), pop: Math.round(item.pop * 100), description: item.weather[0].description, wind: { speed: item.wind.speed, compass: item.wind.deg } });
      }

      return nextDayData.slice(2, 8);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const thisDay = getToday(data.list);
      const nexDay = getTomorrow(data.list);
      setWeatherTodayData(thisDay);
      setWeatherTomorrowData(nexDay);
      fetchDataForTwoDays(true);
    } catch (error: any) {
      console.error("Error fetching weather data: ", error);
      setError(error.message);
    }
  };

  const weatherDescription = (temp: number) => {
    if (temp <= -25) return "Extremely";
    if (temp <= -20) return "Frosty";
    if (temp <= 0) return "Cold";
    if (temp <= 5) return "Chilly";
    if (temp <= 10) return "Cool";
    if (temp <= 15) return "Mildly";
    if (temp <= 20) return "Warm";
    if (temp <= 30) return "Hot";
    if (temp <= 35) return "Heat";
    if (temp <= 40) return "Hell";
    if (temp <= 45) return "Inferno";
    return "Unknown weather";
  }

  const changeThemeColor = () => {
    const metaColor = document.querySelector('meta[name="theme-color"');
    const prefersTheme = window.matchMedia('(prefers-color-scheme:light)').matches;

    const colors = {
      light: {
        cold: "#CCE6FF",
        warm: "#FFEECC",
        hot: "#FFCCCC"
      },
      dark: {
        cold: "#152F4A",
        warm: "#483717",
        hot: "#552222"
      }
    }

    if (metaColor) {
      if (prefersTheme) {
        const color = weatherNowData.temp < 15 ? colors.light.cold : weatherNowData.temp >= 15 && weatherNowData.temp <= 25 ? colors.light.warm : colors.light.hot;
        metaColor.setAttribute('content', color);
      } else {
        const color = weatherNowData.temp < 15 ? colors.dark.cold : weatherNowData.temp >= 15 && weatherNowData.temp <= 25 ? colors.dark.warm : colors.dark.hot;
        metaColor.setAttribute('content', color);
      }
    }
  }

  useEffect(() => {
    const defaultLocation = { latitude: 70.8561221, longitude: 52.8615866 };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: any) => {
          setError(error.message);
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
      fetchNextWeatherData();
    }

    if (lastRefreshTime) {
      const timeDiff = now - lastRefreshTime;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeDiff >= fiveMinutes) {
        setShouldShowButton(true);
      }
    } else {
      setShouldShowButton(true);
    }
  }, [location]);

  const handleReload = () => {
    const thismoment = new Date().getTime().toString();
    localStorage.setItem('lastRefreshTime', thismoment);
    window.location.reload();
  };

  if (error) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <div className='weather'>
            <h3>Sorry, we can't get the weather. Try again later, please.</h3>
            {isStandalone && <small><a className='update' onClick={shouldShowButton ? handleReload : () => { }}>Update</a></small>}
          </div>
        </div>
      </main>
    );
  }

  if (location.latitude === 0 && location.longitude === 0) {
    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <div className='weather'>
            <h3>Getting location information...</h3>
          </div>
        </div>
      </main>
    );
  }

  if (!isFetchedDataForNow && !isFetchedDataForTwoDays) {
    changeThemeColor();

    return (
      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <div className='weather'>
            <h3>Getting the weather...</h3>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="description" content="Weather without numbers" />
        <title>Weather</title>
      </Helmet>

      <main className={"main effect-fade-in " + (weatherNowData.temp < 15 ? "cold" : weatherNowData.temp >= 15 && weatherNowData.temp <= 25 ? "warm" : "hot")} >
        <div className="main__wrapper">
          <div className='weather'>
            {RenderWeatherNow(weatherNowData)}
            <div className='today-tomorrow'>
              {RenderWeatherToday(weatherTodayData)}
              {RenderWeatherTomorrow(weatherTomorrowData)}
            </div>
            <div className='other'>
              {renderOther()}
              {isStandalone && <small><a className='update' onClick={shouldShowButton ? handleReload : () => { }}>Update</a></small>}
            </div>
          </div>
        </div>
        <h1 className={"hero " + (weatherNowData.temp < 15 ? "hero-cold" : weatherNowData.temp >= 15 && weatherNowData.temp <= 25 ? "hero-warm" : "hero-hot")}>{weatherDescription(weatherNowData.temp)}</h1>
      </main>
    </>
  );
};

export default Weather;
