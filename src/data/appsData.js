import weather from '../pictures/apps/weather_hyf.png';
import weather2 from '../pictures/apps/weather_hyf.webp';
import pulse from '../pictures/apps/pulse.png';
import pulse2 from '../pictures/apps/pulse.webp';

const appsData = [
   {
    webp: pulse2,
    png: pulse,
    name: 'Pulse',
    info: 'Tasks & notes. No AI. No tracking. No bloat.',
    installLink: 'https://apps.apple.com/us/app/pulse-tasks-notes/id6754890551',
    infoLink: '/apps/pulse',
    policyLink: '/apps/pulse/privacy-policy',
    EULA: '/apps/pulse/terms-of-use',
    aboutLink: 'https://medium.com/@milsinery/pulse-tasks-notes-06943b80e001',
    comments: [],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        "Tasks and notes in one place. No projects, no labels, no clutter. Just what needs to get done and the thoughts you don't want to lose.",
    },
    isNewLabel: true
  },
  {
    webp: weather2,
    png: weather,
    name: 'How you feel',
    info: 'Weather right now, today, and tomorrow.',
    installLink: 'https://apps.apple.com/us/app/weather-how-you-feel/id6739215959',
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
        'Weather right now, today, and tomorrow. Without numbers, charts or something else. The app sums up the temperature in a single headline and gives you a quick tip on what to wear.',
      title: 'How you feel',
    },
    isNewLabel: false
  },
];

export default appsData;
