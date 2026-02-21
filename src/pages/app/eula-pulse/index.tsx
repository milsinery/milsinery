import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import './index.css';

const Pulse = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Terms of Use (EULA) · Din-Dan"
        />

        <title>Terms of Use (EULA) · Din-Dan</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/apps/pulse">
              <h3>Back to app</h3>
            </Link>
          </header>

          <h1 className="app__title">Terms of Use (EULA)</h1>
          <h2 >Updated February 21, 2026</h2>

          <div className="app__section">
            <h3>Acceptance of Terms</h3>
            <p>
              By downloading or using Din-Dan, you agree to these Terms.
            </p>
          </div>

          <div className="app__section">
            <h3>Description of Service</h3>
            <p>
              Din-Dan provides tools for task management, note-taking, and interface customization.
            </p>
          </div>

          <div className="app__section">
            <h3>Subscriptions</h3>
            <p>
              Exclusive themes: A monthly subscription ($0.99) provides access to exclusive themes.
            </p>

             <p>
              Billing: Payments are charged to your Apple ID account at confirmation of purchase.
            </p>

             <p>
              Renewal: Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.
            </p>

             <p>
              Management: You can manage and cancel subscriptions in your App Store Account Settings.
            </p>
          </div>

          <div className="app__section">
            <h3>Data and Sync</h3>
            <p>
              The App uses iCloud for synchronization. You are responsible for maintaining your iCloud account and device security. The Developer is not liable for data loss resulting from iCloud service interruptions or device failure.
            </p>
          </div>

          <div className="app__section">
            <h3>Prohibited Use</h3>
            <p>
              You agree not to use the App for any illegal activities or to attempt to reverse-engineer the software.
            </p>
          </div>

          <div className="app__section">
            <h3>Limitation of Liability</h3>
            <p>
              The App is provided "as is". The Developer is not liable for any indirect or incidental damages resulting from the use or inability to use the App.
            </p>
          </div>

          <div className="app__section">
            <h3>Governing Law</h3>
            <p>
              These terms are governed by the laws of the Republic of Serbia.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Pulse;
