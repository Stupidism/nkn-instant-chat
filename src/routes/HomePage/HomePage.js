import React from 'react';
import _ from 'lodash';
import qs from 'qs';

import '../App.less';

class App extends React.Component {
  state = {
    username: '',
    address: '',
  };

  componentWillMount() {
    const { location } = this.props;
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    this.setState(_.pick(query, ['username', 'address']));
  }

  usernameChangeHandler = event => {
    this.setState({ username: event.target.value });
  };

  addressChangeHandler = event => {
    this.setState({ address: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { history } = this.props;

    history.push(
      `/chat-room/${this.state.address || 'new'}?username=${
        this.state.username
      }`,
    );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="username-container">
        <h1>NKN Instant Chat</h1>
        <div>
          <input
            type="text"
            value={this.state.username}
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required
          />
        </div>
        <input
          type="submit"
          value={
            this.state.address ? 'Join the Chat Room' : 'Create a Chat Room'
          }
        />
      </form>
    );
  }
}
App.defaultProps = {};

export default App;
