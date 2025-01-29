import { Link } from 'react-router-dom';
import './index.css';

type AppProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink: string;
  policyLink: String
  infoLink: string;
  comment: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
};

const app = ({
  webp,
  png,
  name,
  info,
  installLink,
  policyLink,
  infoLink,
  isNewLabel,
}: AppProps) => {

  return (
    <article className="app">
      {isNewLabel && <h3 className="app__isNewLable">New</h3>}
      
      <div className="app__cover">
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

      <div className="app__info">
        <h2 className="app__title">{name}</h2>
        <p className="app__description">{info}</p>
        <div className="app__links">
          <a
            className="app__link"
            href={installLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Install</h3>
          </a>

          <Link to={infoLink}>
            <h3 className="app__link">About</h3>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default app;
