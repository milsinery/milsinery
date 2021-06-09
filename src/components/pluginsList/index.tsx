import Plugin from '../plugin';
import PluginsData from '../../data/pluginsData';
import './index.css';

const PluginsList = () => {
  const symbols = [
    '❤️',
    '☺️',
    '🥰',
    '👏',
    '😎',
    '🔥',
    '💔',
    '😍',
    '💪',
    '🎉',
    '🥳',
    '🍾',
    '😜',
    '😽',
    '🤟',
    '🤌',
  ];

  const getRandom = (arr: Array<any>) => {
    return Math.floor(Math.random() * (arr.length - 1));
  };

  return (
    <>
      <div className="pluginsList">
        {PluginsData.map((item, key) => {
          return (
            <Plugin
              webp={item.webp}
              png={item.webp}
              name={item.name}
              info={item.info}
              link={item.link}
              sym1={symbols[getRandom(symbols)]}
              sym2={symbols[getRandom(symbols)]}
              text={item.comment[getRandom(item.comment)].text}
              author={item.comment[getRandom(item.comment)].author}
              key={key}
            ></Plugin>
          );
        })}
      </div>
    </>
  );
};

export default PluginsList;
