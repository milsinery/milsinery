import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PluginsList from '../../components/pluginsList/index';
import './index.css';

const Plugins = () => {
  return (
    <>
      <Helmet>
        <title>Плагины для Фигмы</title>
        <meta
          name="description"
          content="Плагины для Фигмы — ускоряют работу дизайнера, избавляя от повторения одних и тех же действий. Бесплатно и на русском языке."
        />
        <meta
          name="keywords"
          content="figma, фигма, плагины, разработка"
        />
        <meta property="og:url" content="https://milsinery.com/#/plugins" />
        <meta property="og:title" content="Плагины для Фигмы" />
        <meta
          property="og:description"
          content="Плагины для Фигмы — ускоряют работу дизайнера, избавляя от повторения одних и тех же действий. Бесплатно и на русском языке."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="plugins effect-fade-in effect-zoom-in">
        <div className="plugins__wrapper">
          <header className="plugins__header">
            <Link to="/">
              <h3>← Владимир Быков</h3>
            </Link>
          </header>
          <h1 className="plugins__title">Плагины для Фигмы</h1>
          <div className="plugins__plugins-list">
            <PluginsList></PluginsList>
          </div>
          <h3 className="plugins__telegram-link">
            <a
              href="https://t.me/pluginsforfigma"
              target="_blank"
              rel="noopener noreferrer"
            >
              Канал с описанием и примерами
            </a>
          </h3>
        </div>
      </div>
    </>
  );
};

export default Plugins;
