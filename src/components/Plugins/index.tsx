import './index.css';
import Plugin from '../plugin';
import pluginsData from './pluginsData';

const Plugins = () => {
  return (
    <>
      <div className="plugins">
        {pluginsData.map((item, key) => {
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
