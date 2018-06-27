import React from 'react';
import qs from 'qs';

import ChatRoom from 'components/ChatRoom/ChatRoom';

import '../App.less';

class App extends React.Component {
  state = {
    username: '',
    address: '',
  };

  componentWillMount() {
    const { location, history, match } = this.props;
    const { username } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const address = match.params.address;

    if (!username || address.length < 67) {
      history.push('/');
      return;
    }

    this.setState({
      username,
      address,
    });
  }

  render() {
    return (
      <ChatRoom
        username={this.state.username}
        chatRoomAddress={this.state.address}
      />
    );
  }
}
App.defaultProps = {};

export default App;
