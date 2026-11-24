import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import '../eula-pulse/index.css';

const PulseForAI = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="How an AI assistant can add Pulse tasks and notes with a URL, and list, edit, complete, or delete them with Shortcuts."
        />
        <title>For AI assistants · Pulse</title>
      </Helmet>

      <main className="app effect-fade-in effect-zoom-in">
        <div className="app__wrapper">
          <header className="app__header">
            <Link to="/apps/pulse">
              <span className="t-h3">Back to app</span>
            </Link>
          </header>

          <h1 className="app__title" tabIndex={-1}>For AI assistants</h1>

          <div className="app__section">
            <h2 className="t-h3">What Pulse is</h2>
            <p>
              Pulse is a local task and note list for iPhone, iPad, and Mac. Tasks sit in a period: today, tomorrow, week, month, or year. A task can also sit on a specific date. Notes have no period and no deadline. Finished tasks stay visible until the end of the day, then move to Done.
            </p>
            <p>
              Pulse does not add, edit, or complete items for you. An assistant does that through the URL scheme or Shortcuts, on the person’s device.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">URL scheme</h2>
            <p>
              URLs only add. They cannot list, edit, complete, or delete. <code>pulse://add</code> creates a task. <code>pulse://note</code> creates a note. Percent-encode the text. A task with no <code>when</code> and no <code>date</code> goes to Today.
            </p>
            <p>
              <code>when</code> is <code>tomorrow</code>, <code>week</code>, <code>month</code>, or <code>year</code>. <code>date</code> is <code>YYYY-MM-DD</code>. If both are valid, the date wins.
            </p>
            <p>
              Put a time in <code>remind</code>, not in the title. <code>remind=HH:mm</code> is a clock time on the task’s day. <code>remind=YYYY-MM-DDTHH:mm</code> is an absolute time and may fall on another day.
            </p>
            <p><code>pulse://add?text=Buy%20milk</code></p>
            <p><code>pulse://add?text=Buy%20milk&amp;when=tomorrow</code></p>
            <p><code>pulse://add?text=Dentist&amp;date=2026-11-02</code></p>
            <p><code>pulse://add?text=Standup&amp;remind=09:30</code></p>
            <p><code>pulse://add?text=Call&amp;date=2026-11-02&amp;remind=2026-11-03T09:00</code></p>
            <p><code>pulse://note?text=App%20idea</code></p>
            <p>
              A note rejects <code>when</code>, <code>date</code>, and <code>remind</code>. A past clock time still creates the task and skips the reminder. A past absolute reminder is an error.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Shortcuts and App Intents</h2>
            <p>
              Listing, editing, completing, and deleting are Shortcuts actions, not URLs. These are the names and parameters Pulse shows in Shortcuts.
            </p>
            <ul className="app__section">
              <li>
                <p>
                  Create Task. Content. Category, default Today: Today, Tomorrow, This week, This month, This year. Reminder time, optional.
                </p>
              </li>
              <li>
                <p>
                  Pulse Task Date. Content. Date. Reminder time, optional. Use this when the task sits on a calendar day rather than a period.
                </p>
              </li>
              <li>
                <p>Get Tasks. Time period, optional. Returns JSON.</p>
              </li>
              <li>
                <p>
                  Edit Task. ID. Content. Time period. Date. Clear date. Reminder time. Remove reminder. A period and a date together are rejected. Clear date and a date together are rejected. Reminder time and Remove reminder together are rejected.
                </p>
              </li>
              <li>
                <p>
                  Complete Task. ID. Marks the task with the same checkmark as the list and clears its reminder. It does not move the task to Done the same day.
                </p>
              </li>
              <li>
                <p>Delete Task. ID. Does not ask for confirmation.</p>
              </li>
              <li>
                <p>Create Note. Content.</p>
              </li>
              <li>
                <p>Get Notes. Returns JSON.</p>
              </li>
              <li>
                <p>Edit Note. ID. Content. Text only.</p>
              </li>
              <li>
                <p>Delete Note. ID. Does not ask for confirmation.</p>
              </li>
              <li>
                <p>
                  Get Done Tasks. Returns tasks already on the Done list, as JSON. It does not delete them.
                </p>
              </li>
            </ul>
          </div>

          <div className="app__section">
            <h2 className="t-h3">How to change an existing item</h2>
            <p>
              Call Get Tasks or Get Notes, read the <code>id</code>, then pass that id to Edit, Complete, or Delete. Do not invent an id.
            </p>
            <p>
              On macOS, a shortcut that wraps one of these actions can be run from the terminal. The name is the shortcut’s own name. The built-in App Shortcuts are named Create Task, Pulse Task Date, Create Note, Get Tasks, Get Notes, and Get Done Tasks.
            </p>
            <p><code>shortcuts run "Get Tasks"</code></p>
            <p>
              Edit Task, Complete Task, Delete Task, Edit Note, and Delete Note are actions you place inside a shortcut. <code>shortcuts run</code> uses the name of that shortcut, not a hidden intent name.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">Notes for assistants</h2>
            <p>
              Ask the person before you delete a task or a note. The actions themselves do not ask.
            </p>
            <p>
              Do not put a time in the title. Put it in Reminder time, or in <code>remind</code> on a URL.
            </p>
            <p>
              Pulse is local-first. It collects no data. Tasks and notes stay on the device and sync through the person’s iCloud.
            </p>
          </div>

          <div className="app__section">
            <h2 className="t-h3">A tested scenario</h2>
            <p>
              Tested on November 24, 2026 by an AI assistant on a Mac running Pulse.
            </p>
            <ul className="app__section">
              <li>
                <p>
                  On a locked Mac, adding still works if Pulse is already running:
                </p>
                <p>
                  <code>open -g -a /Applications/pulse.app "pulse://add?text=...&amp;remind=HH:mm"</code>
                </p>
                <p>
                  <code>-g</code> keeps Pulse in the background. The lock screen blocks bringing the app to the front, but the add is processed. An <code>open</code> exit status of 0 is not proof that the task was created.
                </p>
              </li>
              <li>
                <p>
                  Shortcuts that read, edit, or delete — Get Tasks, Edit Task, Delete Task, Get Notes, and Delete Note — require the Mac to be unlocked. That is a macOS authentication policy. Creating a task or note with a URL does not.
                </p>
              </li>
              <li>
                <p>
                  For a recurring task, check for an existing or postponed copy first so you do not add a duplicate. When the Mac is unlocked, use Get Tasks. When it is locked, ask the person or skip the check. Then add with a URL, and verify after a short delay: tasks sync through iCloud across devices.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default PulseForAI;
