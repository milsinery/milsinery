import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './index.css';

const Error = () => {
  return (
    <main className="error effect-fade-in">
      <Helmet>
        <title>Not found · Vladimir Bykov</title>
      </Helmet>
      <div className="error__wrapper">
        <h1 className="error__title" tabIndex={-1}>Not found</h1>
        <Link to="/">
          <span className="t-h3">Back to main</span>
        </Link>
      </div>
    </main>
  );
};

export default Error;
