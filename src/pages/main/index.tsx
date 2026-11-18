import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PluginsList from '../../components/pluginsList/index';
import ExtensionsList from '../../components/extensionsList/index';
import AppsList from "../../components/appslist/index"
import MacAppsData from "../../data/macAppsData";
import avatar from '../../avatar.webp';
import './index.css';

const CAREER_START_YEAR = 2011;

const Main = () => {
  const [value, setValue] = useState(localStorage.getItem('theme') || 'system');
  document.querySelector('html')?.setAttribute('data-theme', value);
  localStorage.setItem('theme', value);

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR;
  const title = `${yearsOfExperience}+ years in interface design. Now building apps with AI.`;
  const description = `Product designer, ${yearsOfExperience}+ years in interface design. Now building apps with AI.`;

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={description}
        />

        <meta
          name="keywords"
          content="ui, ux, figma, design, development, interface, text, illustration, figma, plugins"
        />
        <meta property="og:url" content="https://milsinery.com" />
        <meta property="og:site_name" content="Vladimir Bykov" />
        <meta property="og:title" content="Vladimir Bykov" />
        <meta
          property="og:description"
          content={description}
        />
        <meta property="og:type" content="website" />
        <title>Vladimir Bykov</title>
      </Helmet>

      <main className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <header className="main__header">
            <div className="main__logo">
              <div className="main__avatar">
                <picture>
                  <source srcSet={avatar} type="image/webp" />
                  <img src={avatar} width="100%" height="100%" alt="Avatar" />
                </picture>
              </div>
              <div className="main__headline">
                <h3 className="main__headline-main">Vladimir Bykov</h3>
                <small className="main__headline-additional">
                  Product designer
                </small>
              </div>
            </div>
          </header>
          <h1 className="main__title">
            {title}
          </h1>

          <section className="main__apps">
            <h3 className="main__app-title">iOS applications</h3>
            <AppsList></AppsList>
          </section>

          <section className="main__mac-apps">
            <h3 className="main__mac-title">Mac applications</h3>
            <AppsList data={MacAppsData}></AppsList>
          </section>

          <section className="main__extensions">
            <h3 className="main__extensions-title">Extensions for browser</h3>
            <ExtensionsList></ExtensionsList>
          </section>

          <section className="main__plugins">
            <Link to="/plugins">
              <h3 className="main__plugins-title">Plugins for Figma</h3>
            </Link>
            <PluginsList></PluginsList>
          </section>

          <section className="main__links">
            <h3 className="main__links-title">Contacts & portfolio</h3>
            <p className="main__link">
              <a
                href="https://www.linkedin.com/in/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://t.me/areyoureallyadesigner"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram channel
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://www.vsco.co/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                VSCO Profile
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://www.behance.net/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Behance
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://instagram.com/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </p>
            <p className="main__link">
              <a
                href="https://t.me/milsinery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
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
            <option value="system">System theme</option>
            <option value="dark">Dark theme</option>
            <option value="light">Light theme</option>
          </select>

          <small className="main__version">Updated Nov 17 · Added Stay Awake.</small>
        </div>
      </main>
    </>
  );
};

export default Main;
