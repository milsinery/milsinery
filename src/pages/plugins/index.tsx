import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PluginsList from '../../components/pluginsList/index';
import './index.css';

const Plugins = () => {
  document
    .querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'system');

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Плагины для Фигмы — ускоряют работу дизайнера, избавляя от повторения одних и тех же действий. Бесплатно и на русском языке."
        />
        <meta name="keywords" content="figma, фигма, плагины, разработка" />
        <meta property="og:url" content="https://milsinery.com/#/plugins" />
        <meta property="og:title" content="Плагины для Фигмы" />
        <meta
          property="og:description"
          content="Плагины для Фигмы — ускоряют работу дизайнера, избавляя от повторения одних и тех же действий. Бесплатно и на русском языке."
        />
        <meta property="og:type" content="website" />
        <title>Plugins for Figma</title>
      </Helmet>

      <main className="plugins effect-fade-in effect-zoom-in">
        <div className="plugins__wrapper">
          <header className="plugins__header">
            <Link to="/">
              <h3>← Vladimir Bykov</h3>
            </Link>
          </header>
          <h1 className="plugins__title">Plugins for Figma</h1>
          <section className="plugins__plugins-list">
            <PluginsList></PluginsList>
          </section>
          <div>
            <h3 className="plugins__link">
              <a
                href="https://t.me/areyoureallydesigner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about plugins and examples
              </a>
            </h3>
            <h3 className="plugins__link">
              <a href="mailto:milsinery@icloud.com?subject=Figma%20Plugin">
                Order a plugin
              </a>
            </h3>
          </div>
        </div>
      </main>
    </>
  );
};

export default Plugins;
