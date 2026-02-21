import { Link, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import './index.css';

const Pulse = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Privacy policy · Din-Dan"
        />

        <title>Privacy policy · Din-Dan</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/apps/pulse">
              <h3>Back to app</h3>
            </Link>
          </header>

          <h1 className="app__title">Privacy policy</h1>
          <h2 >Updated February 21, 2026</h2>

          <div className="app__section">
            <h3>General Information</h3>
            <p>
              Din-Dan ("the App") is a productivity tool for creating tasks and notes. This Privacy Policy explains how data is handled within the App.
            </p>
          </div>

          <div className="app__section">
            <h3>Data Collection</h3>
            <p>
              The Developer does not collect, store, or process any personal data, identifiers, or usage statistics. All information created within the App (tasks, notes, settings) remains under the user's control.
            </p>
          </div>

          <div className="app__section">
            <h3>Data Storage and Synchronization</h3>
            <p>
              All user content is stored locally on the device. Synchronization between devices is performed exclusively through Apple’s iCloud service. The Developer does not have access to your iCloud data.
            </p>

            <p>
              Apple may process this data as part of iCloud. You can learn more in <a href='https://www.apple.com/legal/privacy/' target="_blank" rel="noopener noreferrer">Apple’s Privacy Policy</a>.
            </p>
          </div>

          <div className="app__section">
            <h3>Payments</h3>
            <p>
              Subscription payments for exclusive themes are processed entirely by Apple Inc. via the App Store. The Developer does not receive your credit card information or personal billing details.
            </p>
          </div>

          <div className="app__section">
            <h3>Notifications</h3>
            <p>
              The App sends local notifications only for tasks specifically scheduled by the user. No marketing or tracking notifications are used.
            </p>
          </div>

          <div className="app__section">
            <h3>Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. If we make changes, the updated Privacy Policy will be available on this page with the “Last updated” date updated accordingly.
            </p>
          </div>

          <div className="app__section">
            <h3>Contact Us</h3>
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
