import React from 'react';
import ChatRoom from 'components/ChatRoom/ChatRoom';

import '../App.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      address: '',
    };

    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.addressChangeHandler = this.addressChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
  }

  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  addressChangeHandler(event) {
    this.setState({ address: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ submitted: true, username: this.state.username });
  }

  render() {
    if (this.state.submitted) {
      // Form was submitted, now show the main App
      return (
        <ChatRoom
          username={this.state.username}
          chatRoomAddress={this.state.address}
        />
      );
    }

    // Initial page load, show a simple login form
    return (
      <form
        onSubmit={this.usernameSubmitHandler}
        className="username-container"
      >
        <h1>Nkn Instant Chat</h1>
        <div>
          <input
            type="text"
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required
          />
          <input
            type="text"
            onChange={this.addressChangeHandler}
            placeholder="Enter an address or leave it blank..."
          />
        </div>
        <input
          type="submit"
          value={this.state.address ? 'Join a Chat Room' : 'Create a Chat Room'}
        />
      </form>
    );
  }
}
App.defaultProps = {};

export default App;
