import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { setMetaTags } from '../src/utils/setMetaTags';
import Main from './pages/main/index';
import Application from './pages/app/index';
import PolicyWeather from './pages/app/policy-weather/index';
import PolicyPulse from './pages/app/policy-pulse/index';
import EULAPulse from './pages/app/eula-pulse/index';
import Plugins from './pages/plugins/index';
import Plugin from './pages/plugin/index';
import Records from './pages/records/index';
import Record from './pages/record/index';

const usePageViews = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/weather') {
      setMetaTags('weather.png', '/manifest-weather.json');
    } else {
      setMetaTags('favicon.png', '/manifest.json');
    }
  }, [location]);
};

const App = () => {
  usePageViews();

  return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/plugins" component={Plugins} />
        <Route exact path="/plugins/:name" component={Plugin} />
        <Route exact path="/blog" component={Records} />
        <Route exact path="/blog/:name" component={Record} />
        <Route exact path="/apps/:name" component={Application} />
        <Route exact path="/apps/weather/privacy-policy" component={PolicyWeather} />
        <Route exact path="/apps/pulse/privacy-policy" component={PolicyPulse} />
        <Route exact path="/apps/pulse/terms-of-use" component={EULAPulse} />
      </Switch>
  );
};

export default App;
