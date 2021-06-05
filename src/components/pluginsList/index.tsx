import Plugin from '../plugin';
import PluginsData from '../../data/pluginsData';
import './index.css';

const PluginsList = () => {
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
              key={key}
            ></Plugin>
          );
        })}
      </div>
    </>
  );
};

export default PluginsList;
