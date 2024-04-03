import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/index';
import Plugins from './pages/plugins/index';
import Plugin from './pages/plugin/index';
import Records from './pages/records/index';
import Record from './pages/record/index';
import Karina from './pages/karina/index';
import Danila from './pages/danila/index';

const App = () => {
  return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/plugins" component={Plugins} />
        <Route exact path="/plugins/:name" component={Plugin} />
        <Route exact path="/blog" component={Records} />
        <Route exact path="/blog/:name" component={Record} />
        <Route exact path="/karina" component={Karina} />
        <Route exact path="/danila" component={Danila} />
      </Switch>
  );
};

export default App;
