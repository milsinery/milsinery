import React from 'react';
import avatar from '../src/avatar.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="Main__wrapper">
      <div className="App__avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <div className="App__links">
        <a href="https://t.me/pluginsforfigma" target="_blank" rel="noopener noreferrer">Канал, где я рассказываю про свои плагины — Plugins for Figma</a>
        <a href="https://t.me/milsinery" target="_blank" rel="noopener noreferrer">Инста</a>
        <a href="https://behance.net/milsinery" target="_blank" rel="noopener noreferrer">Биханс</a>
        <a href="https://instagram.com/milsinery" target="_blank" rel="noopener noreferrer">Телега</a>
        <a href="https://career.habr.com/milsinery" target="_blank" rel="noopener noreferrer">Профиль на Хабр Карьере</a>
        <a href="mailto:milsinery@icloud.com">milsinery@icloud.com</a>
      </div>
      </div>
    </div>
  );
}

export default App;
