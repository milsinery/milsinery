import Plugin from '../plugin';
import PluginsData from './pluginsData';
import './index.css';

const Plugins = () => {
  return (
    <>
      <div className="plugins">
        {PluginsData.map((item, key) => {
          return (
            <Plugin
              webp={item.webp}
              png={item.webp}
              name={item.name}
              info={item.info}
              link={item.link}
              key={key}
            ></Plugin>
          );
        })}
      </div>
    </>
  );
};

export default Plugins;
