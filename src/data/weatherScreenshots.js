import weather01 from '../pictures/apps/weather-screens/01-hey.jpg';
import weather01w from '../pictures/apps/weather-screens/01-hey.webp';
import weather02 from '../pictures/apps/weather-screens/02-now.jpg';
import weather02w from '../pictures/apps/weather-screens/02-now.webp';
import weather03 from '../pictures/apps/weather-screens/03-next.jpg';
import weather03w from '../pictures/apps/weather-screens/03-next.webp';
import weather04 from '../pictures/apps/weather-screens/04-tomorrow.jpg';
import weather04w from '../pictures/apps/weather-screens/04-tomorrow.webp';
import weather05 from '../pictures/apps/weather-screens/05-wear.jpg';
import weather05w from '../pictures/apps/weather-screens/05-wear.webp';

// Official iPhone App Store screenshots for Weather — how you feel
// (id 6739215959), in store order. All five are used in the homepage hover fan.
const weatherScreenshots = [
  {
    webp: weather01w,
    src: weather01,
    alt: 'Weather — How you feel: I’ll tell you about the weather and air quality',
    inFan: true,
  },
  {
    webp: weather02w,
    src: weather02,
    alt: 'Weather on iPhone — now, where you are, in plain language',
    inFan: true,
  },
  {
    webp: weather03w,
    src: weather03,
    alt: 'Weather on iPhone — the rest of the day, including what to wear',
    inFan: true,
  },
  {
    webp: weather04w,
    src: weather04,
    alt: 'Weather on iPhone — tomorrow’s forecast in plain language',
    inFan: true,
  },
  {
    webp: weather05w,
    src: weather05,
    alt: 'Weather — now, today, tomorrow. No charts, just what to wear',
    inFan: true,
  },
];

export default weatherScreenshots;
