import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/index';
import Plugins from './pages/plugins/index';
import Plugin from './pages/plugin/index';

const App = () => {
  return (
    <main className="main effect-fade-in effect-zoom-in">
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/plugins" component={Plugins} />
        <Route exact path="/plugins/:name" component={Plugin} />
        <Route component={Main} />
      </Switch>
    </main>
  );
};

export default App;
