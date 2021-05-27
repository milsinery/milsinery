import meow from '../../pictures/plugins/meow.webp';
import coft from '../../pictures/plugins/coft.webp';
import abracadabra from '../../pictures/plugins/abracadabra.webp';
import nowInside from '../../pictures/plugins/nowinside.webp';
import meow2 from '../../pictures/plugins/meow.png';
import coft2 from '../../pictures/plugins/coft.png';
import abracadabra2 from '../../pictures/plugins/abracadabra.png';
import nowInside2 from '../../pictures/plugins/nowinside.png';

const PluginsData = [
  {
    webp: meow,
    png: meow2,
    name: 'Meow!',
    info: 'Cоздаёт компонент из выбранного фрейма, а все остальные такие же делает его копиями.',
    link: 'https://www.figma.com/community/plugin/946844618678350922/Meow!',
  },
  {
    webp: abracadabra,
    png: abracadabra2,
    name: 'Abracadabra!',
    info: 'Генерирует и вставляет текст и изображения в слои.',
    link: 'https://www.figma.com/community/plugin/919546417582505589/Abracadabra!',
  },
  {
    webp: coft,
    png: coft2,
    name: 'COFT',
    info: 'Создаёт копии объекта и подменяет в них текст.',
    link: 'https://www.figma.com/community/plugin/903936058293238810/COFT-%E2%80%94-create-objects-from-text',
  },
  {
    webp: nowInside,
    png: nowInside2,
    name: 'Now Inside!',
    info: 'Вставляет выпавшие слои в выбранный фрейм.',
    link: 'https://www.figma.com/community/plugin/945329982331973175/Now-inside!',
  },
];

export default PluginsData;
