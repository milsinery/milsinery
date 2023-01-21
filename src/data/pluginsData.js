import renamer from '../pictures/plugins/renamer.webp';
import colorFixer from '../pictures/plugins/colorFixer.webp';
import meow from '../pictures/plugins/meow.webp';
import coft from '../pictures/plugins/coft.webp';
import abracadabra from '../pictures/plugins/abracadabra.webp';
import nowInside from '../pictures/plugins/nowinside.webp';
import renamer2 from '../pictures/plugins/renamer.png';
import colorFixer2 from '../pictures/plugins/colorFixer.png';
import meow2 from '../pictures/plugins/meow.png';
import coft2 from '../pictures/plugins/coft.png';
import abracadabra2 from '../pictures/plugins/abracadabra.png';
import nowInside2 from '../pictures/plugins/nowinside.png';
import data from '../records/stageManager';

const pluginsData = [
  {
    webp: renamer,
    png: renamer2,
    name: 'Renamer',
    info: 'Just assigns random names to all layers, including groups and frames.',
    installLink:
      'https://www.figma.com/community/plugin/1185219382747213717/Renamer',
    infoLink: '/plugins/renamer',
    comments: [
      {
        author: 'Настя Кино',
        text: 'Я в восторге! спасибо большое) это сделало мою жизнь чуточку лучше.',
      },
    ],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Renamer — free plugin for Figma. Just assigns random names to all layers, including groups and frames.',
      title: 'Renamer — plugin for Figma',
    },
    isNewLabel: true,
  },
  {
    webp: colorFixer,
    png: colorFixer2,
    name: 'Color Fixer',
    info: 'Associates colors to styles if it finds matching or very similar ones. In one click.',
    installLink:
      'https://www.figma.com/community/plugin/1037616212525799012/Color-Fixer',
    infoLink: '/plugins/colorFixer',
    comments: [],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Color Fixer — free plugin for Figma. Associates colors to styles if it finds matching or very similar ones. In one click.',
      title: 'Color Fixer — plugin for Figma',
    },
    isNewLabel: false,
  },
  {
    webp: meow,
    png: meow2,
    name: 'Meow!',
    info: 'The plugin will create a component from an object, and all other similar objects will make it instances.',
    installLink:
      'https://www.figma.com/community/plugin/946844618678350922/Meow!',
    infoLink: '/plugins/meow',
    comments: [
      { author: 'Бойко Константин', text: 'Просто магия какая-то' },
      {
        author: 'Юлия Лазовская',
        text: 'Большое спасибо, очень полезный плагин!',
      },
      { author: 'Alina', text: 'Cool tool, will try, thank you!' },
      {
        author: 'Vitaly Z',
        text: 'Very useful plugin and cool cat. Thank you!',
      },
      {
        author: 'Настя Кино',
        text: 'Этот плагин делает за меня то, что я так не люблю делать. Это ли не счастье',
      },
      {
        author: 'Juno',
        text: 'Ещё не успела воспользоваться, но идея огонь, и обложка и текст милейшие) Всегда приятно сталкиваться с такой любовью к своему продукту)',
      },
    ],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Meow! — free plugin for figma. The plugin will create a component from an object, and all other similar objects will make it instances.',
      title: 'Meow! — plugin for Figma',
    },
    isNewLabel: false,
  },
  {
    webp: abracadabra,
    png: abracadabra2,
    name: 'Abracadabra!',
    info: 'You no longer have to write lorem-ipsum-text manually and insert images into layouts — Abracadabra will do it for you.',
    installLink:
      'https://www.figma.com/community/plugin/919546417582505589/Abracadabra!',
    infoLink: '/plugins/abracadabra',
    comments: [
      { author: 'Tony Shi', text: 'Omg this is magical! Thank you for this!' },
    ],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Abracadabra! — free plugin for Figma. You no longer have to write lorem-ipsum-text manually and insert images into layouts — Abracadabra will do it for you.',
      title: 'Abracadabra! — plugin for Figma',
    },
    isNewLabel: false,
  },
  {
    webp: coft,
    png: coft2,
    name: 'COFT',
    info: 'The plugin creates copies of the selected object or text layers with the changed text in them.',
    installLink:
      'https://www.figma.com/community/plugin/903936058293238810/COFT-%E2%80%94-create-objects-from-text',
    infoLink: '/plugins/coft',
    comments: [{ author: 'Данила Щаников', text: 'Золото, а не плагин 😍' }],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'COFT — free plugin for Figma. The plugin creates copies of the selected object or text layers with the changed text in them.',
      title: 'COFT — plugin for Figma',
    },
    isNewLabel: false,
  },
  {
    webp: nowInside,
    png: nowInside2,
    name: 'Now Inside!',
    info: 'For situations when objects are outside the frame and you want to insert them into it saving their location, but the list of layers is not easy to navigate quickly. ',
    installLink:
      'https://www.figma.com/community/plugin/945329982331973175/Now-inside!',
    infoLink: '/plugins/now-inside',
    comments: [
      { author: 'Андрей', text: 'Ну вот, теперь идеален 👌' },
      { author: 'Steven', text: 'This one will be a big time saver. Kudos' },
    ],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Now Inside! — free plugin for Figma. For situations when objects are outside the frame and you want to insert them into it saving their location, but the list of layers is not easy to navigate quickly. ',
      title: 'Now Inside! — plugin for Figma',
    },
    isNewLabel: false,
  },
];

export const getLastPlugin = () => data[0];

export default pluginsData;
