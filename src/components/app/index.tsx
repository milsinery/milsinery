import { Link } from 'react-router-dom';
import './index.css';

type applicationProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink?: string;
  infoLink?: string;
  aboutLink?: string;
  comment?: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
  comingSoon?: boolean;
};

const application = ({
  webp,
  png,
  name,
  info,
  installLink,
  infoLink,
  aboutLink,
  comment,
  isNewLabel,
  comingSoon,
}: applicationProps) => {
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

  const comments = comment ?? [];
  const content = comments.length > 0 && comments[getRandom(comments)];

  return (
    <article className="application">
      {isNewLabel && <span className="application__isNewLable t-h3">New</span>}
      
      <div className="application__cover">
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

      <div className="application__info">
        <h3 className="application__title t-h2">{name}</h3>
        <p className="application__description">{info}</p>
        <div className="application__links">
          {comingSoon ? (
            <span className="application__link application__link--soon">
              <span className="t-h3">Soon</span>
            </span>
          ) : (
            <>
              {installLink && (
                <a
                  className="application__link"
                  href={installLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="t-h3">Install</span>
                  <span className="visually-hidden"> {name} (opens in new tab)</span>
                </a>
              )}

              {infoLink && (
                <Link to={infoLink}>
                  <span className="application__link t-h3">About</span>
                  <span className="visually-hidden"> {name}</span>
                </Link>
              )}

              {aboutLink && (
                <a
                  className="application__link"
                  href={aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="t-h3">Making of</span>
                  <span className="visually-hidden"> {name} (opens in new tab)</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {comments.length > 0 && content && (
        // Hover-only decoration: hidden from screen readers.
        <div className="application__commentary" aria-hidden="true">
          <span className="application__commentary-title t-h4">{content.text}</span>
          <small className="application__commentary-author">{content.author}</small>
          <span className="application__commentary-sym-1 t-h2">
            {symbols[getRandom(symbols)]}
          </span>
          <span className="application__commentary-sym-2 t-h1">
            {symbols[getRandom(symbols)]}
          </span>
        </div>
      )}
    </article>
  );
};

export default application;
