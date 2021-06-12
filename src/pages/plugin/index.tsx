import {Link} from "react-router-dom";
import Helmet from "react-helmet";
import './index.css';

type PluginProps = {
  title: string;
};

const Plugin = ({title}: PluginProps) => {
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
        <title>Плагины для Фигмы</title>
      </Helmet>

      <div className="plugins effect-fade-in effect-zoom-in">
        <div className="plugins__wrapper">
          <header className="plugins__header">
            <Link to="/plugins">
              <h3>← Все плагины</h3>
            </Link>
          </header>
          <h1 className="plugins__title">{title}</h1>
        </div>
      </div>
      </>
  )
};

export default Plugin;
