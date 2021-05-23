import avatar from '../src/avatar.webp';
import avatar2 from '../src/avatar.png';
import Plugins from './components/plugins';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="App__wrapper effect-fade-in effect-zoom-in">
        <header className="App__header">
          <div className="App__logo">
            <div className="App__avatar">
              <picture>
                <source srcSet={avatar} type="image/webp" />
                <img src={avatar2} width="100%" height="100%" alt="Avatar" />
              </picture>
            </div>
            <h3>Владимир Быков</h3>
          </div>
        </header>

        <h1 className="App__title">
          Разрабатываю интерфейсы, пишу к ним текст и рисую графику.
        </h1>
        <div className="App__plugins">
          <h3 className="App__plugins-title">Плагины для Фигмы</h3>
          <Plugins></Plugins>
        </div>
        <div className="App__links">
          <h3 className="App__links-title">Контакты и портфолио</h3>
          <p className="App__link">
            <a
              href="https://career.habr.com/milsinery"
              target="_blank"
              rel="noopener noreferrer"
            >
              Хабр Карьера
            </a>
          </p>
          <p className="App__link">
            <a
              href="https://www.behance.net/milsinery"
              target="_blank"
              rel="noopener noreferrer"
            >
              Биханс
            </a>
          </p>
          <p className="App__link">
            <a
              href="https://t.me/milsinery"
              target="_blank"
              rel="noopener noreferrer"
            >
              Телеграм
            </a>
          </p>
          <p className="App__link">
            <a
              href="https://t.me/pluginsforfigma"
              target="_blank"
              rel="noopener noreferrer"
            >
              Канал о плагинах, Фигме и дизайне
            </a>
          </p>
        </div>
        <small className="App__version">Предварительная версия</small>
      </div>
    </div>
  );
};

export default App;
