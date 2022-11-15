import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PluginsList from '../../components/pluginsList/index';
import ExtensionsList from '../../components/extensionsList/index';
import avatar from '../../avatar.webp';
import avatar2 from '../../avatar.png';
import './index.css';

const Main = () => {
  const [value, setValue] = useState(localStorage.getItem('theme') || 'system');
  document.querySelector('html')?.setAttribute('data-theme', value);
  localStorage.setItem('theme', value);

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Разрабатываю интерфейсы, пишу для них текст и рисую графику. Создаю плагины для Фигмы и рассказываю о них в канале Plugins for Figma."
        />

        <meta
          name="keywords"
          content="ui, ux, figma, дизайн, интерфейс, разработка, фигма, плагины"
        />
        <meta property="og:url" content="https://milsinery.com" />
        <meta property="og:site_name" content="Владимир Быков" />
        <meta property="og:title" content="Владимир Быков" />
        <meta
          property="og:description"
          content="Разрабатываю интерфейсы, пишу для них текст и рисую графику. Создаю плагины для Фигмы и рассказываю о них в канале Plugins for Figma."
        />
        <meta property="og:type" content="website" />
        <title>Владимир Быков</title>
      </Helmet>

      <main className="main effect-fade-in effect-zoom-in">
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
            Разрабатываю интерфейсы, пишу для них текст и рисую графику
          </h1>

          <section className="main__extensions">
            <h3 className="main__extensions-title">Расширения для бровзёра</h3>
            <ExtensionsList></ExtensionsList>
          </section>

          <section className="main__plugins">
            <Link to="/plugins">
              <h3 className="main__plugins-title">Пладжины для Фижмы</h3>
            </Link>
            <PluginsList></PluginsList>
          </section>
          <section className="main__links">
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
                href="https://t.me/areyoureallydesigner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Канал о моих проектах и дизайне
              </a>
            </p>
          </section>

          <select
            className="main__themeSwitcher"
            name="themeSwitcher"
            onChange={handleChange}
            value={value}
            defaultValue={value}
          >
            <option value="system">Цветовая схема вашего устройства</option>
            <option value="dark">Тёмная схема</option>
            <option value="light">Светлая схема</option>
          </select>

          <small className="main__version">
            Обновлён 9-го мая · Добавлено расширение для бровзёра.
          </small>
        </div>
      </main>
    </>
  );
};

export default Main;
