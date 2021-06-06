import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PluginsList from '../../components/pluginsList/index';
import avatar from '../../avatar.webp';
import avatar2 from '../../avatar.png';
import './index.css';

const Main = () => {
  return (
    <>
      <Helmet>
        <title>Владимир Быков</title>
        <meta
          name="description"
          content="Разрабатываю интерфейсы, пишу к ним текст и рисую графику. Создаю плагины для Фигмы и рассказываю о них в канале Plugins for Figma."
        />

        <meta
          name="keywords"
          content="ui, ux, figma, дизайн, интерфейс, разработка, фигма, плагины"
        />
        <meta property="og:url" content="https://milsinery.com" />
        <meta property="og:title" content="Владимир Быков" />
        <meta
          property="og:description"
          content="Разрабатываю интерфейсы, пишу к ним текст и рисую графику. Создаю плагины для Фигмы и рассказываю о них в канале Plugins for Figma."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <header className="main__header">
            <div className="main__logo">
              <div className="main__avatar">
                <picture>
                  <source srcSet={avatar} type="image/webp" />
                  <img src={avatar2} width="100%" height="100%" alt="Avatar" />
                </picture>
              </div>
              <h3>Владимир Быков</h3>
            </div>
          </header>
          <h1 className="main__title">
            Разрабатываю интерфейсы, пишу к ним текст и рисую графику.
          </h1>
          <div className="main__plugins">
            <Link to="/plugins">
              <h3 className="main__plugins-title">Плагины для Фигмы</h3>
            </Link>
            <PluginsList></PluginsList>
          </div>
          <div className="main__links">
            <h3 className="main__links-title">Контакты и портфолио</h3>
            <p className="main__link">
              <a
                href="https://career.habr.com/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Хабр Карьера
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://www.behance.net/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Биханс
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://t.me/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Телеграм
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://instagram.com/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Инстаграм
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://t.me/pluginsforfigma"
                target="_blank"
                rel="noopener noreferrer"
              >
                Канал о плагинах, Фигме и дизайне
              </a>
            </p>
          </div>
          <small className="main__version">Предварительная версия</small>
        </div>
      </div>
    </>
  );
};

export default Main;
