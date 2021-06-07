import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/index';
import Plugins from './pages/plugins/index';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/plugins" component={Plugins} />
      <Route component={Main} />
    </Switch>
  );
};

export default App;
