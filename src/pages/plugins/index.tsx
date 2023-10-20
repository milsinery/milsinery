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
          content="Plug-ins for Figma - make the designer's work faster, eliminating routine"
        />
        <meta name="keywords" content="figma, design, development, plugins" />
        <meta property="og:url" content="https://milsinery.com/#/plugins" />
        <meta property="og:title" content="Plug-ins for Figma" />
        <meta
          property="og:description"
          content="Plug-ins for Figma - make the designer's work faster, eliminating routine"
        />
        <meta property="og:type" content="website" />
        <title>Plugins for Figma</title>
      </Helmet>

      <main className="plugins effect-fade-in effect-zoom-in">
        <div className="plugins__wrapper">
          <header className="plugins__header">
            <Link to="/">
              <h3>About the author</h3>
            </Link>
          </header>
          <h1 className="plugins__title">Plugins for Figma</h1>
          <section className="plugins__plugins-list">
            <PluginsList></PluginsList>
          </section>
          <div className='plugins__links'>
            <p className="plugins__link">
              <a
                href="https://t.me/areyoureallyadesigner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about plugins 
              </a>
            </p>
            <p className="plugins__link">
              <a href="mailto:milsinery@icloud.com?subject=Figma%20Plugin">
                Order a plugin
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Plugins;
