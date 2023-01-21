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
                content="figma, design, development, plugins"
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
              <h3>All plugins</h3>
            </Link>
          </header>

          {pluginData &&
            pluginData.map(({webp, png, info, name, installLink, comments}) => (
              <div className="pluginPage__content">
                <div className="pluginPage__head">
                  <div className="pluginPage__title">
                    <div className="pluginPage__cover">
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
                    <h1 className="pluginPage__title-text">{name}</h1>
                    <h2 className="pluginPage__short-description">
                      {info}
                    </h2>
                    <a
                      className="plugin__link"
                      href={installLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2>Install 🚀</h2>
                    </a>
                  </div>
                </div>

                {comments.length > 0 && <div className="pluginPage__comments">
                  <h3 className="pluginPage__comments-title">{comments.length > 1 ? "Reviews" : "Review"}</h3>
                  {comments.map((commentary, key) => (
                    <article className="pluginPage__comment" key={key}>
                      <p className="pluginPage__comment-text">{commentary.text}</p>
                      <small>{commentary.author}</small>
                    </article>
                  ))}
                </div>}
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Plugin;
