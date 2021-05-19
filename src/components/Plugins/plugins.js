import meow from '../../pictures/plugins/meow.png';
import coft from '../../pictures/plugins/coft.png';
import abracadabra from '../../pictures/plugins/abracadabra.png';
import nowInside from '../../pictures/plugins/nowinside.png';

const plugins = [
  {
    cover: meow,
    name: 'Meow!',
    info: 'Cоздаёт компонент из выбранного фрейма, а все остальные такие же делает его копиями.',
    link: 'https://www.figma.com/community/plugin/946844618678350922/Meow!',
  },
  {
    cover: abracadabra,
    name: 'Abracadabra!',
    info: 'Генерирует и вставляет текст и изображения в слои.',
    link: 'https://www.figma.com/community/plugin/919546417582505589/Abracadabra!',
  },
  {
    cover: coft,
    name: 'COFT',
    info: 'Создаёт копии объекта и подменяет в них текст.',
    link: 'https://www.figma.com/community/plugin/903936058293238810/COFT-%E2%80%94-create-objects-from-text',
  },
  {
    cover: nowInside,
    name: 'Now Inside!',
    info: 'Вставляет выпавшие слои в выбранный фрейм.',
    link: 'https://www.figma.com/community/plugin/945329982331973175/Now-inside!',
  },
];

export default plugins;
