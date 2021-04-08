/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Container } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import 'rsuite/lib/styles/index.less';

import Character from './components/character';
import Episode from './components/episode';
import Home from './components/home';
import Search from './components/search';
import Show from './components/show';
import ErrorComponent from './components/error';
import Toolbar from './components/toolbar';

const App = () => {
  const commonApiUrl = 'https://tarea-1-breaking-bad.herokuapp.com/api';
  return (
    <Container style={{ height: '100%' }}>
      <Router id="container">
        <Toolbar />
        <Switch>
          <Route
            path="/character/:id"
            render={(props) => (
              <Character
                commonApiUrl={commonApiUrl}
                {...props}
              />
            )}
          />
          {/* <Route
            path="/show/:id"
            render={(props) => (
              <Show
                commonApiUrl={commonApiUrl}
                {...props}
              />
            )}
          /> */}
          <Route
            path="/episode/:id"
            render={(props) => (
              <Episode
                commonApiUrl={commonApiUrl}
                {...props}
              />
            )}
          />
          <Route
            path="/search/:name/:offset"
            render={(props) => (
              <Search
                commonApiUrl={commonApiUrl}
                {...props}
              />
            )}
          />
          <Route
            path="/error"
            render={(props) => (
              <ErrorComponent
                {...props}
              />
            )}
          />
          <Route
            path="/"
            render={(props) => (
              <Home
                commonApiUrl={commonApiUrl}
                {...props}
              />
            )}
          />
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
