import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/index';
import Plugins from './pages/plugins/index';
import Plugin from './pages/plugin/index';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/plugins" component={Plugins} />
      <Route exact path="/plugins/meow" component={Plugin} />
      <Route exact path="/plugins/coft" component={Plugin} />
      <Route exact path="/plugins/abracadabra" component={Plugin} />
      <Route exact path="/plugins/now-inside" component={Plugin} />
      <Route component={Main} />
    </Switch>
  );
};

export default App;
