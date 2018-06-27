import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import ChatRoomPage from './ChatRoomPage';
import NotFoundPage from './NotFoundPage';

import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/chat-room/:address" component={ChatRoomPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
