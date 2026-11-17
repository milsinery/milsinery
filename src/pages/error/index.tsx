import { Link } from 'react-router-dom';
import './index.css';

const Error = () => {
  return (
    <main className="error effect-fade-in">
      <div className="error__wrapper">
        <h1 className="error__title">Not found</h1>
        <Link to="/">
          <h3>Back to main</h3>
        </Link>
      </div>
    </main>
  );
};

export default Error;
