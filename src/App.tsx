import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/index';
import Plugins from './pages/plugins/index';
import Error from './pages/error/index';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/plugins" component={Plugins} />
      <Route component={Error} />
    </Switch>
  );
};

export default App;
