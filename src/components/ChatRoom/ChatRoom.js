import React from 'react';
import nkn from 'nkn-client';

import Messages from './Messages';
import ChatInput from './ChatInput';

import './ChatRoom.less';

class ChatRoom extends React.Component {
  chatters = {};

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      chatRoomAddress: this.props.chatRoomAddress,
    };
    this.handleSendChatMessage = this.handleSendChatMessage.bind(this);

    // Connect to the server
    // this.socket = io(config.api, { query: `username=${props.username}` }).connect();
    this.client = nkn();

    this.client.on('connect', () => {
      if (!this.props.chatRoomAddress) {
        this.setState({ chatRoomAddress: this.client.addr });
      } else {
        this.sendHelloMessage();
      }
    });

    // Listen for messages from the server
    // this.socket.on('server:message', message => {
    //   this.addMessage(message);
    // });

    this.client.on('message', (src, payload) => {
      this.handleMessageReceived(src, JSON.parse(payload));
    });
  }

  handleHelloMessage = (from, username) => {
    this.chatters[from] = { username };
    this.addMessage({
      from,
      username,
      type: 'hello',
    });
  };

  handleMessageReceived = (from, { type, username }) => {
    switch (type) {
      case 'hello': {
        this.handleHelloMessage(from, username);
        break;
      }
      case 'chat': {
        break;
      }
      case 'goodbye': {
        break;
      }
      default: {
        console.warn('Unknown Message Type', type);
      }
    }
  };

  sendMessage = message => {
    this.client.send(
      this.state.chatRoomAddress,
      JSON.stringify({
        ...message,
      }),
    );

    this.addMessage({
      ...message,
      fromMe: true,
    });
  };

  sendHelloMessage = () => {
    const message = {
      type: 'hello',
      username: this.props.username,
    };

    this.sendMessage(message);
  };

  handleSendChatMessage(content) {
    const message = {
      type: 'chat',
      content,
    };

    // Emit the message to the server

    // this.socket.emit('client:message', messageObject);
    this.sendMessage(message);
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  render() {
    return (
      <div className="container">
        <h3>Nkn Chat App</h3>
        <h2>Current Address: {this.state.chatRoomAddress}</h2>
        <Messages messages={this.state.messages} />
        <ChatInput onSend={this.handleSendChatMessage} />
      </div>
    );
  }
}
ChatRoom.defaultProps = {
  username: 'Anonymous',
};

export default ChatRoom;
