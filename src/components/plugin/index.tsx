import './index.css';

type PluginProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  link: string;
  title?: string;
  author?: string;
};

const Plugin = ({
  webp,
  png,
  name,
  info,
  link,
  title,
  author,
}: PluginProps) => {
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
            alt="Cover"
          />
        </picture>
      </div>

      <div className="plugin__info">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h2 className="plugin__title">{name}</h2>
        </a>
        <p>{info}</p>
      </div>
      <div className="plugin__bg-first">
        <div className="plugin__bg-second"></div>
        <div className="plugin__glass"></div>
      </div>

      {title && author && (
        <div className="plugin__commentary">
          <h3 className="plugin__commentary-title">{title}</h3>
          <small className="plugin__commentary-author">{author}</small>
          <h2 className="plugin__commentary-sym-1">❤️</h2>
          <h1 className="plugin__commentary-sym-2">👏</h1>
        </div>
      )}
    </div>
  );
};

export default Plugin;
