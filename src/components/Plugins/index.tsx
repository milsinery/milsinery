import './index.css';
import plugins from './plugins';

const Plugins = () => {
  return (
    <>
      <div className="plugins">
        {plugins.map((item, key) => {
          return (
            <Plugin
              cover={item.cover}
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

type PluginProps = {
  cover: string;
  name: string;
  info: string;
  link: string;
};

const Plugin = ({ cover, name, info, link }: PluginProps) => {
  return (
    <div className="plugin">
      <div className="plugin__cover">
        <picture>
          <img src={cover} width="100%" height="100%" alt="Cover picture" />
        </picture>
      </div>

      <div className="plugin__info">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h2 className="plugin__title">{name}</h2>
        </a>
        <p>{info}</p>
      </div>
    </div>
  );
};

export default Plugins;
