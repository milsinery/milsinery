import './index.css';

type PluginProps = {
  webp: string,
  png: string,
  name: string,
  info: string,
  link: string,
  sym1?: string,
  sym2?: string,
  text?: string,
  author?: string
};

const Plugin = ({ webp, png, name, info, link, sym1, sym2, text, author }: PluginProps) => {
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
        <h2 className="plugin__title">{name}</h2>
        <p className="plugin__description">{info}</p>
        <div className="plugin__links">
          <a className="plugin__link" href={link} target="_blank" rel="noopener noreferrer">
            <h3>Установить</h3>
          </a>
          {/* <h3 className="plugin__link">Описание</h3> */}
        </div>
      </div>

      {text && (
        <div className="plugin__commentary">
          <h3 className="plugin__commentary-title">{text}</h3>
          <small className="plugin__commentary-author">
            {author}
          </small>
          <h2 className="plugin__commentary-sym-1">{sym1}</h2>
          <h1 className="plugin__commentary-sym-2">{sym2}</h1>
        </div>
      )}
    </div>
  );
};

export default Plugin;
