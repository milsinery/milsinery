import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import './index.css';

const Pulse = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Privacy policy · Pulse"
        />

        <title>Privacy policy · Pulse</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/apps/pulse">
              <span className="t-h3">Back to app</span>
            </Link>
          </header>

          <h1 className="app__title" tabIndex={-1}>Privacy policy</h1>
          <div className="t-h2">Updated November 23, 2026</div>

          <div className="app__section">
            <h2 className="t-h3">General Information</h2>
            <p>
              Pulse ("the App") is a productivity tool for creating tasks and notes. This Privacy Policy explains how data is handled within the App.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Data Collection</h2>
            <p>
              The Developer does not collect, store, or process any personal data, identifiers, or usage statistics. All information created within the App (tasks, notes, settings) remains under the user's control.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Data Storage and Synchronization</h2>
            <p>
              All user content is stored locally on the device. Synchronization between devices is performed exclusively through Apple’s iCloud service. The Developer does not have access to your iCloud data.
            </p>

            <p>
              Apple may process this data as part of iCloud. You can learn more in <a href='https://www.apple.com/legal/privacy/' target="_blank" rel="noopener noreferrer">Apple’s Privacy Policy<span className="visually-hidden"> (opens in new tab)</span></a>.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Payments</h2>
            <p>
              Subscription payments for exclusive themes are processed entirely by Apple Inc. via the App Store. The Developer does not receive your credit card information or personal billing details.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Notifications</h2>
            <p>
              The App sends local notifications only for tasks specifically scheduled by the user. No marketing or tracking notifications are used.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Shortcuts, Sharing and AI Assistants</h2>
            <p>
              Pulse has no built-in AI. It does not send your tasks or notes to the Developer or to an AI service. iCloud synchronization is described above.
            </p>
            <p>
              When you run a Shortcut, export a report through the share sheet, or let a third-party assistant read or change your tasks and notes, that app or service handles the data under its own privacy policy. The Developer does not receive it.
            </p>
            <p>
              Pulse indexes your tasks and notes for Spotlight on the device. That index is not sent to the Developer.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make changes, the updated Privacy Policy will be available on this page with the “Last updated” date updated accordingly.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, you can contact us at <a href="mailto:milsinery@icloud.com">milsinery@icloud.com</a>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Pulse;
