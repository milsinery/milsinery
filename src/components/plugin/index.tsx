import './index.css';

type PluginProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink: string;
  comment: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
};

const Plugin = ({
  webp,
  png,
  name,
  info,
  installLink,
  comment,
  isNewLabel,
}: PluginProps) => {
  const symbols = [
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
    return Math.floor(Math.random() * arr.length);
  };

  const content = comment && comment[getRandom(comment)];

  return (
    <article className="plugin">
      {isNewLabel && <span className="plugin__isNewLable t-h3">New</span>}

      <div className="plugin__cover">
        <picture>
          <source srcSet={webp} type="image/webp" />
          <img
            loading="lazy"
            src={png}
            width="100%"
            height="100%"
            alt={`${name} icon`}
          />
        </picture>
      </div>

      <div className="plugin__info">
        <h3 className="plugin__title t-h2">{name}</h3>
        <p className="plugin__description">{info}</p>
        <div className="plugin__links">
          <a
            className="plugin__link"
            href={installLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="t-h3">Install</span>
            <span className="visually-hidden"> {name} (opens in new tab)</span>
          </a>
        </div>
      </div>

      {comment.length > 0 && (
        // Hover-only decoration: hidden from screen readers.
        <div className="plugin__commentary" aria-hidden="true">
          <span className="plugin__commentary-title t-h4">{content.text}</span>
          <small className="plugin__commentary-author">{content.author}</small>
          <span className="plugin__commentary-sym-1 t-h2">
            {symbols[getRandom(symbols)]}
          </span>
          <span className="plugin__commentary-sym-2 t-h1">
            {symbols[getRandom(symbols)]}
          </span>
        </div>
      )}
    </article>
  );
};

export default Plugin;
