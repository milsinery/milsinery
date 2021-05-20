import avatar from '../src/avatar.png';
import figure1 from './pictures/graphic/figure1.svg'
import Plugins from './components/Plugins';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="Main__wrapper">
        <header className="App__header">
          <div className="App__logo">
            <div className="App__avatar">
              <img src={avatar} alt="avatar" />
            </div>
            <h3>Владимир Быков</h3>
          </div>
        </header>

        <div className="App__description">
          <h1 className="App__title">
            Разрабатываю интерфейсы, пишу к ним текст и рисую графику.
          </h1>
        </div>
        <div className="App__plugins">
          <h3 className="App__plugins-title">Плагины для Фигмы</h3>
          <Plugins></Plugins>
        </div>
        <div className="App__links">
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
              href="https://t.me/milsinery"
              target="_blank"
              rel="noopener noreferrer"
            >
              Телеграм
            </a>
          </p>
        </div>
        <small className="App__version">Предварительная версия</small>
      </div>
    </div>
  );
};

export default App;
