import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import AppsData from '../../data/appsData';
import './index.css';

const App = () => {
  document
    .querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'system');

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
              <title>{item.meta.title}</title>
            </Helmet>
          );
        })}

      <main className="appPage effect-fade-in effect-zoom-in">
        <div className="appPage__wrapper">
          <header className="appPage__header">
            <Link to="/">
              <h3>Back to main</h3>
            </Link>
          </header>

          {appData &&
            appData.map(({ webp, png, info, name, installLink, policyLink, aboutLink, meta }) => (
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
                          alt="Cover"
                        />
                      </picture>
                    </div>
                    <h1 className="appPage__title-text">{name}</h1>
                    <h2 className="appPage__short-description">
                      {meta.content}
                    </h2>
                    <div className="appPage__links">
                      <a
                        className="appPage__link"
                        href={installLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h2>Install 🚀</h2>
                      </a>
                      <Link to={policyLink}>
                        <h2 className="appPage__link">Privacy policy</h2>
                      </Link>
                          <a
            className="application__link"
            href={aboutLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Making of</h2>
          </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default App;
