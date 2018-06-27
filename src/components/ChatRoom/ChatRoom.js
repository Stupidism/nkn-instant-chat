import React from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';

import nkn from 'vendor/nkn';

import Messages from './Messages';
import ChatInput from './ChatInput';

import './ChatRoom.less';

const parseOwnerNameFromAddress = address => {
  return address.substr(0, address.length - 67);
};

class ChatRoom extends React.Component {
  chatters = {};

  state = {
    messages: [],
    chatRoomAddress: `nkn-instant-chat-${this.props.chatRoomAddress}`,
    isOwner: false,
    ownerName: parseOwnerNameFromAddress(this.props.chatRoomAddress),
  };

  componentWillMount() {
    const privateKey = localStorage.getItem('nkn-instant-chat-private-key');

    this.client = !privateKey
      ? nkn()
      : nkn({
          identifier: `nkn-instant-chat-${this.props.username}`,
          privateKey,
        });

    this.client.on('connect', () => {
      localStorage.setItem(
        'nkn-instant-chat-private-key',
        this.client.key.privateKey,
      );

      if (!this.props.chatRoomAddress) {
        this.setState({
          chatRoomAddress: this.client.addr,
          isOwner: true,
        });

        this.addMessage({
          type: 'let-there-be-a-chat-room',
          fromMe: true,
        });
      } else {
        this.sendHelloMessage();
      }
    });

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
      ownerName: this.state.ownerName,
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
        <h3 className="ChatRoomHeader">
          Nkn Chat App
          <FacebookShareButton
            style={{ float: 'right' }}
            url={window.location.href.split('?')[0]}
            quote="Join me"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </h3>
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
