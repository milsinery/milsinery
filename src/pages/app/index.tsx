import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import AppsData from '../../data/appsData';
import './index.css';

const App = () => {
  const url = useRouteMatch().url;
  const appData = AppsData.filter((item) => item.infoLink === url);

  return (
    <>
      {appData &&
        appData.map((item) => {
          return (
            <Helmet>
              <meta name="description" content={item.meta.content} />
              <meta
                name="keywords"
                content="figma, design, development, apps"
              />
              <meta
                property="og:url"
                content={`https://milsinery.com/#/apps/${item.infoLink}`}
              />
              <meta property="og:title" content={item.meta.title} />
              <meta property="og:description" content={item.meta.content} />
              <meta property="og:type" content="website" />
              <title>{item.name}</title>
            </Helmet>
          );
        })}

      <main className="appPage effect-fade-in effect-zoom-in">
        <div className="appPage__wrapper">
          <header className="appPage__header">
            <Link to="/">
              <span className="t-h3">Back to main</span>
            </Link>
          </header>

          {appData &&
            appData.map(({ webp, png, info, name, installLink, policyLink, EULA, aboutLink, aiLink, meta, page }) => (
              <div className="appPage__content">
                <div className="appPage__head">
                  <div className="appPage__title">
                    <div className="appPage__cover">
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
                    <h1 className="appPage__title-text" tabIndex={-1}>{name}</h1>
                    <div className="appPage__short-description t-h2">
                      {meta.content}
                    </div>
                    <div className="appPage__links">
                      <a
                        className="appPage__link"
                        href={installLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="t-h2">
                          Install <span aria-hidden="true">🚀</span>
                        </span>
                        <span className="visually-hidden"> {name} (opens in new tab)</span>
                      </a>
                      {aiLink && (
                        <Link to={aiLink}>
                          <span className="appPage__link t-h2">For AI assistants</span>
                        </Link>
                      )}
                         { aboutLink && <a
            className="application__link"
            href={aboutLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="t-h2">Making of</span>
            <span className="visually-hidden"> {name} (opens in new tab)</span>
          </a>
}
            <Link to={policyLink}>
                        <span className="appPage__link t-h2">Privacy policy</span>
                      </Link>

                      { EULA && <Link to={EULA}>
                        <span className="appPage__link t-h2">Terms of Use (EULA)</span>
                      </Link>
            }
                    </div>
                  </div>
                </div>
                <AppStoreDescription blocks={page && page.description} />
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

function AppStoreDescription({
  blocks,
}: {
  blocks?: Array<{ paragraphs: string[]; list?: string[] }>;
}) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="app__section">
      {blocks.map((block) => (
        <div className="app__section" key={block.paragraphs[0]}>
          {block.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {block.list && (
            <ul className="app__section">
              {block.list.map((item) => (
                <li key={item}>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
