import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import RecordList from '../../components/recordsList/index';
import './index.css';

const records = () => {
  document
    .querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'system');

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Blog about design and development"
        />
        <meta name="keywords" content="figma, design, development, plugins" />
        <meta property="og:url" content="https://milsinery.com/#/records" />
        <meta property="og:title" content="Blog about design and development" />
        <meta
          property="og:description"
          content="Blog about design and development"
        />
        <meta property="og:type" content="website" />
        <title>Blog</title>
      </Helmet>

      <main className="records effect-fade-in effect-zoom-in">
        <div className="records__wrapper">
          <header className="records__header">
            <Link to="/">
              <h3>About the author</h3>
            </Link>
          </header>
          <h1 className="records__title">Blog</h1>
          <section className="records__records-list">
            <RecordList></RecordList>
          </section>
        </div>
      </main>
    </>
  );
};

export default records;
