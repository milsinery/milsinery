import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import './index.css';

const Pulse = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Terms of Use (EULA) · Pulse"
        />

        <title>Terms of Use (EULA) · Pulse</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/apps/pulse">
              <span className="t-h3">Back to app</span>
            </Link>
          </header>

          <h1 className="app__title" tabIndex={-1}>Terms of Use (EULA)</h1>
          <div className="t-h2">Updated November 23, 2026</div>

          <div className="app__section">
            <h2 className="t-h3">Acceptance of Terms</h2>
            <p>
              By downloading or using Pulse, you agree to these Terms.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Description of Service</h2>
            <p>
              Pulse provides tools for tasks, notes, reminders, and interface customization. You can also automate Pulse through its URL scheme and through Shortcuts (App Intents).
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Automation and Third-Party Assistants</h2>
            <p>
              Pulse can be controlled through its URL scheme, through Shortcuts, and through third-party AI assistants or apps you choose. Adding, editing, completing, and deleting are done on your behalf and at your direction.
            </p>
            <p>
              You are responsible for which tools you grant access, and for reviewing the changes they make. The Developer is not responsible for third-party services, their availability, or how they handle data.
            </p>
            <p>
              How an assistant can use Pulse is described on the <Link to="/apps/pulse/ai">For AI assistants</Link> page.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Subscriptions</h2>
            <p>
              Exclusive themes: A monthly subscription provides access to exclusive themes.
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
            <h2 className="t-h3">Data and Sync</h2>
            <p>
              The App uses iCloud for synchronization. You are responsible for maintaining your iCloud account and device security. The Developer is not liable for data loss resulting from iCloud service interruptions or device failure.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Prohibited Use</h2>
            <p>
              You agree not to use the App for any illegal activities or to attempt to reverse-engineer the software.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Limitation of Liability</h2>
            <p>
              The App is provided "as is". The Developer is not liable for any indirect or incidental damages resulting from the use or inability to use the App.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Relationship with Apple</h2>
            <p>
              This agreement is between you and the Developer only, and not with Apple Inc. Apple is not responsible for the App and its content, and expressly disclaims all warranties with respect to the App.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Pulse;
