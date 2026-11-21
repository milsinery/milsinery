import { useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { setMetaTags } from '../src/utils/setMetaTags';
import Main from './pages/main/index';
import Application from './pages/app/index';
import PolicyWeather from './pages/app/policy-weather/index';
import PolicyPulse from './pages/app/policy-pulse/index';
import EULAPulse from './pages/app/eula-pulse/index';
import Error from './pages/error/index';

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
        {/* The plugins list and plugin pages were removed: send old links
            (/plugins and /plugins/:name) to the main page. */}
        <Redirect from="/plugins" to="/" />
        <Route exact path="/apps/:name" component={Application} />
        <Route exact path="/apps/weather/privacy-policy" component={PolicyWeather} />
        <Route exact path="/apps/pulse/privacy-policy" component={PolicyPulse} />
        <Route exact path="/apps/pulse/terms-of-use" component={EULAPulse} />
        <Route component={Error} />
      </Switch>
  );
};

export default App;
