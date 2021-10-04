import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import PluginsData from '../../data/pluginsData';
import './index.css';

const Plugin = () => {
  document
    .querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'system');

  const url = useRouteMatch().url;
  const pluginData = PluginsData.filter((item) => item.infoLink === url);

  return (
    <>
      {pluginData &&
        pluginData.map((item) => {
          return (
            <Helmet>
              <meta name="description" content={item.meta.content} />
              <meta
                name="keywords"
                content="figma, фигма, плагины, разработка"
              />
              <meta
                property="og:url"
                content={`https://milsinery.com/#/plugins/${item.infoLink}`}
              />
              <meta property="og:title" content={item.meta.title} />
              <meta property="og:description" content={item.meta.content} />
              <meta property="og:type" content="website" />
              <title>{item.meta.title}</title>
            </Helmet>
          );
        })}

      <main className="pluginPage effect-fade-in effect-zoom-in">
        <div className="pluginPage__wrapper">
          <header className="pluginPage__header">
            <Link to="/plugins">
              <h3>← Все плагины</h3>
            </Link>
          </header>

          {pluginData &&
            pluginData.map((item) => (
              <div className="pluginPage__content">
                <div className="pluginPage__head">
                  <div className="pluginPage__title">
                    <div className="pluginPage__cover">
                      <picture>
                        <source srcSet={item.webp} type="image/webp" />
                        <img
                          loading="lazy"
                          src={item.png}
                          width="100%"
                          height="100%"
                          alt="Cover"
                        />
                      </picture>
                    </div>
                    <h1 className="pluginPage__title-text">{item.name}</h1>
                    <h2 className="pluginPage__short-description">
                      {item.info}
                    </h2>
                    <a
                      className="plugin__link"
                      href={item.installLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2>Установить 🚀</h2>
                    </a>
                  </div>
                </div>

                <div className="pluginPage__comments">
                  <h3 className="pluginPage__comments-title">{item.comments.length > 1 ? "Отзывы пользователей" : "Отзыв пользователя"}</h3>
                  {item.comments.map((commentary, key) => (
                    <article className="pluginPage__comment" key={key}>
                      <p className="pluginPage__comment-text">{commentary.text}</p>
                      <small>{commentary.author}</small>
                    </article>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Plugin;
