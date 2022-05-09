import './index.css';

type ExtensionProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink: string;
  infoLink: string;
  comment: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
};

const Extension = ({
  webp,
  png,
  name,
  info,
  installLink,
  isNewLabel,
}: ExtensionProps) => {

  return (
    <article className="extension">
      {isNewLabel && <h3 className="extension__isNewLable">Новое</h3>}
      
      <div className="extension__cover">
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

      <div className="extension__info">
        <h2 className="extension__title">{name}</h2>
        <p className="extension__description">{info}</p>
        <div className="extension__links">
          <a
            className="extension__link"
            href={installLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Установить</h3>
          </a>
        </div>
      </div>
    </article>
  );
};

export default Extension;
