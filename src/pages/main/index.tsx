import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PluginsList from '../../components/pluginsList/index';
import ExtensionsList from '../../components/extensionsList/index';
import AppsList from "../../components/appslist/index"
import MacAppsData from "../../data/macAppsData";
// Hero photo: swap this one import to change the picture (any square image;
// it is cropped to a circle in CSS).
import photo from '../../pictures/hero/photo.webp';
import { ReactComponent as NameArc } from '../../pictures/hero/name_arc.svg';
import { CONTACT_EMAIL, EMAIL_HREF, TELEGRAM_HREF, quickContactHref } from '../../utils/quickContact';
import './index.css';

const CAREER_START_YEAR = 2011;

const Main = () => {
  // Email by default (also without JS); Telegram for visitors from Russia.
  const [contactHref, setContactHref] = useState(EMAIL_HREF);
  useEffect(() => {
    setContactHref(quickContactHref());
  }, []);

  const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR;
  const description = `Product designer, ${yearsOfExperience}+ years in design. AI-native now.`;

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

      <div className="main effect-fade-in effect-zoom-in">
        <div className="main__wrapper">
          <nav className="main__quick" aria-label="Quick contact">
            <a
              className="main__contact"
              href={contactHref}
              {...(contactHref === TELEGRAM_HREF
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              Contact
              <span className="visually-hidden">
                {contactHref === TELEGRAM_HREF
                  ? ' on Telegram (opens in new tab)'
                  : ' by email'}
              </span>
            </a>
          </nav>

          <main className="main__content">
            <header className="main__hero">
              <figure className="main__stamp">
                <img
                  className="main__photo"
                  src={photo}
                  width="200"
                  height="200"
                  alt="Vladimir Bykov"
                />
                <NameArc className="main__name" aria-hidden="true" focusable="false" />
              </figure>
              <h1 className="main__title" tabIndex={-1}>
                Product designer, {yearsOfExperience}+&nbsp;years&nbsp;in. AI&#8209;native now.
              </h1>
            </header>

            <section className="main__apps">
              <h2 className="main__app-title t-h3">iOS applications</h2>
              <AppsList></AppsList>
            </section>

            <section className="main__mac-apps">
              <h2 className="main__mac-title t-h3">Mac applications</h2>
              <AppsList data={MacAppsData}></AppsList>
            </section>

            <section className="main__extensions">
              <h2 className="main__extensions-title t-h3">Extensions for browser</h2>
              <ExtensionsList></ExtensionsList>
            </section>

            <section className="main__plugins">
              <h2 className="main__plugins-title t-h3">Plugins for Figma</h2>
              <PluginsList></PluginsList>
            </section>

          </main>

          <footer className="main__footer">
            <div className="main__links">
              <h2 className="main__links-title t-h3">Contacts & portfolio</h2>
              <p className="main__link">
                <a href={EMAIL_HREF}>{CONTACT_EMAIL}</a>
              </p>
              <p className="main__link">
                <a
                  href="https://t.me/milsinery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
              <p className="main__link">
                <a
                  href="https://www.linkedin.com/in/milsinery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
              <p className="main__link">
                <a
                  href="https://t.me/areyoureallyadesigner"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram channel
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
              <p className="main__link">
                <a
                  href="https://www.vsco.co/milsinery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VSCO Profile
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
              <p className="main__link">
                <a
                  href="https://www.behance.net/milsinery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Behance
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
              <p className="main__link">
                <a
                  href="https://instagram.com/milsinery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Main;
