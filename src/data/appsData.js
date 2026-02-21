import weather from '../pictures/apps/weather_hyf.png';
import weather2 from '../pictures/apps/weather_hyf.webp';
import pulse from '../pictures/apps/pulse.png';
import pulse2 from '../pictures/apps/pulse.webp';

const appsData = [
   {
    webp: pulse2,
    png: pulse,
    name: 'Din-Dan',
    info: 'Tasks & notes. Simple and beautiful.',
    installLink:
      '',
    infoLink: '/apps/pulse',
    policyLink: '/apps/pulse/privacy-policy',
    EULA: '/apps/pulse/terms-of-use',
    aboutLink: '',
    comments: [],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Tasks & notes. Simple and beautiful.',
    },
    isNewLabel: true
  },
  {
    webp: weather2,
    png: weather,
    name: 'Weather — how you feel',
    info: 'Without numbers, charts or AI — just the essentials.',
    installLink:
      'https://apps.apple.com/us/app/weather-how-you-feel/id6739215959',
    infoLink: '/apps/weather',
    policyLink: '/apps/weather/privacy-policy',
    aboutLink: 'https://medium.com/@milsinery/weather-how-you-feel-5a82a6c48ab4',
    comments: [],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Without numbers, charts or AI — just the essentials. The app sums up the temperature in a single headline and gives you a quick tip on what to wear.',
      title: 'Weather — how you feel',
    },
    isNewLabel: false
  },
];

export default appsData;
