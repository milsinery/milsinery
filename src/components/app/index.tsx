import { Link } from 'react-router-dom';
import './index.css';

type applicationProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink: string;
  infoLink: string;
  aboutLink: string;
  comment: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
};

const application = ({
  webp,
  png,
  name,
  info,
  installLink,
  infoLink,
  aboutLink,
  isNewLabel,
}: applicationProps) => {

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
            alt="Cover"
          />
        </picture>
      </div>

      <div className="application__info">
        <h2 className="application__title">{name}</h2>
        <p className="application__description">{info}</p>
        <div className="application__links">
          <a
            className="application__link"
            href={installLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Install</h3>
          </a>

          <Link to={infoLink}>
            <h3 className="application__link">About</h3>
          </Link>

          <a
            className="application__link"
            href={aboutLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Making of</h3>
          </a>
        </div>
      </div>
    </article>
  );
};

export default application;
