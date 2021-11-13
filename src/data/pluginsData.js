import colorFixer from '../pictures/plugins/colorFixer.webp';
import meow from '../pictures/plugins/meow.webp';
import coft from '../pictures/plugins/coft.webp';
import abracadabra from '../pictures/plugins/abracadabra.webp';
import nowInside from '../pictures/plugins/nowinside.webp';
import colorFixer2 from '../pictures/plugins/colorFixer.png';
import meow2 from '../pictures/plugins/meow.png';
import coft2 from '../pictures/plugins/coft.png';
import abracadabra2 from '../pictures/plugins/abracadabra.png';
import nowInside2 from '../pictures/plugins/nowinside.png';

const PluginsData = [
  {
    webp: colorFixer,
    png: colorFixer2,
    name: 'Color Fixer',
    info: 'Сканирует используемые цвета в макете и связывает с созданными стилями, если они идентичны или очень похожи — в один клик.',
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
        'Color Fixer — бесплатный плагин для Фигмы. Сканирует используемые цвета в макете и связывает с созданными стилями, если они идентичны или очень похожи — в один клик.',
      title: 'Color Fixer — плагин для Фигмы',
    },
  },
  {
    webp: meow,
    png: meow2,
    name: 'Meow!',
    info: 'Cоздаёт компонент из выбранного фрейма, а все остальные такие же делает его копиями.',
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
    ],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Meow! — бесплатный плагин для Фигмы. Cоздаёт компонент из выбранного фрейма, а все остальные такие же делает его копиями.',
      title: 'Meow! — плагин для Фигмы',
    },
  },
  {
    webp: abracadabra,
    png: abracadabra2,
    name: 'Abracadabra!',
    info: 'Генерирует и вставляет текст и изображения в слои.',
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
        'Abracadabra! — плагин для Фигмы. Генерирует и вставляет текст и изображения в слои.',
      title: 'Abracadabra! — плагин для Фигмы',
    },
  },
  {
    webp: coft,
    png: coft2,
    name: 'COFT',
    info: 'Создаёт копии объекта и подменяет в них текст.',
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
        'COFT — плагин для Фигмы. Создаёт копии объекта и подменяет в них текст.',
      title: 'COFT — плагин для Фигмы',
    },
  },
  {
    webp: nowInside,
    png: nowInside2,
    name: 'Now Inside!',
    info: 'Вставляет выпавшие слои в выбранный фрейм.',
    installLink:
      'https://www.figma.com/community/plugin/945329982331973175/Now-inside!',
    infoLink: '/plugins/now-inside',
    comments: [{ author: 'Андрей', text: 'Ну вот, теперь идеален 👌' }, { author: "Steven", text: 'This one will be a big time saver. Kudos'}],
    page: {
      description: '',
      instruction: {},
    },
    meta: {
      content:
        'Now Inside! — плагин для Фигмы. Вставляет выпавшие слои в выбранный фрейм.',
      title: 'Now Inside! — плагин для Фигмы',
    },
  },
];

export default PluginsData;
