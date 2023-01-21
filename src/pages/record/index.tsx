import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import {getRecords} from '../../data/recordsData';
import parser from './parser';
import './index.css';

const Record = () => {
  document
    .querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'system');

  const url = useRouteMatch().url;
  const recordData = getRecords().filter((item) => item.infoLink === url);

  return (
    <>
      {recordData &&
        recordData.map((item) => {
          return (
            <Helmet>
              <meta name="description" content={item.meta.content} />
              <meta
                name="keywords"
                content="figma, design, development, plugins"
              />
              <meta
                property="og:url"
                content={`https://milsinery.com/#/blog/${item.infoLink}`}
              />
              <meta property="og:title" content={item.meta.title} />
              <meta property="og:description" content={item.meta.content} />
              <meta property="og:type" content="website" />
              <title>{item.meta.title}</title>
            </Helmet>
          );
        })}

      <main className="recordPage effect-fade-in effect-zoom-in">
        <div className="recordPage__wrapper">
          <header className="recordPage__header">
            <Link to="/blog">
              <h3>Blog</h3>
            </Link>
          </header>

          {recordData &&
            recordData.map((record) => (
              <div className="recordPage__content">
                <h1 className="recordPage__title-text">{record.title}</h1>
                {record.content.map((item) => parser(item))}
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Record;
