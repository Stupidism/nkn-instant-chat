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
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const address = match.params.address;

    const username = query.username || localStorage.getItem(address);

    // Valid combinnation
    // 1. username=foo, address=new
    // 1. username=foo, address=real-address
    if (!username || !address) {
      if (username) {
        history.push(`/?username=${username}`);
      }
      if (address) {
        history.push(`/?address=${address}`);
      }
      return;
    }

    this.setState({
      username,
      address,
    });
  }

  render() {
    return (
      <ChatRoom username={this.state.username} address={this.state.address} />
    );
  }
}
App.defaultProps = {};

export default App;
