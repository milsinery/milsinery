import './index.css';

type PluginProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  link: string;
};

const Plugin = ({ webp, png, name, info, link }: PluginProps) => {
  return (
    <div className="plugin">
      <div className="plugin__cover">
        <picture>
          <source srcSet={webp} type="image/webp" />
          <img
            loading="lazy"
            src={png}
            width="100%"
            height="100%"
            alt="Cover picture"
          />
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

export default Plugin;
