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
      {isNewLabel && <h3 className="application__isNewLable">New</h3>}
      
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
        <h2 className="application__title">{name}</h2>
        <p className="application__description">{info}</p>
        <div className="application__links">
          {comingSoon ? (
            <span className="application__link application__link--soon">
              <h3>Soon</h3>
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
                  <h3>Install</h3>
                </a>
              )}

              {infoLink && (
                <Link to={infoLink}>
                  <h3 className="application__link">About</h3>
                </Link>
              )}

              {aboutLink && (
                <a
                  className="application__link"
                  href={aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3>Making of</h3>
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {comments.length > 0 && content && (
        <div className="application__commentary">
          <h4 className="application__commentary-title">{content.text}</h4>
          <small className="application__commentary-author">{content.author}</small>
          <h2 className="application__commentary-sym-1">
            {symbols[getRandom(symbols)]}
          </h2>
          <h1 className="application__commentary-sym-2">
            {symbols[getRandom(symbols)]}
          </h1>
        </div>
      )}
    </article>
  );
};

export default application;
