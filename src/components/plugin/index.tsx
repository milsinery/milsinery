import './index.css';

type PluginProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  link: string;
  comment: Array<{ text: string; author: string }>;
};

const Plugin = ({ webp, png, name, info, link, comment }: PluginProps) => {
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
    return Math.floor(Math.random() * (arr.length));
  };

  const content = comment && comment[getRandom(comment)];

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
          <a
            className="plugin__link"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Установить</h3>
          </a>
          {/* <h3 className="plugin__link">Описание</h3> */}
        </div>
      </div>

      {comment && (
        <div className="plugin__commentary">
          <h4 className="plugin__commentary-title">{content.text}</h4>
          <small className="plugin__commentary-author">{content.author}</small>
          <h2 className="plugin__commentary-sym-1">
            {symbols[getRandom(symbols)]}
          </h2>
          <h1 className="plugin__commentary-sym-2">
            {symbols[getRandom(symbols)]}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Plugin;
