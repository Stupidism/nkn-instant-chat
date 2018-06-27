import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';

import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
