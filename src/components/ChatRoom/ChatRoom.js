import React from 'react';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Button, Modal, Layout, Dropdown, Menu } from 'antd';
import Qrcode from 'qrcode.react';

import nkn from 'vendor/nkn';

import Messages from './Messages';
import ChatInput from './ChatInput';

import './ChatRoom.less';

const parseOwnerNameFromAddress = address => {
  return address.substr(0, address.length - 67);
};

const { Header, Footer } = Layout;

class ChatRoom extends React.Component {
  chatters = {};

  state = {
    messages: [],
    chatRoomAddress: `nkn-instant-chat-${this.props.address}`,
    isOwner: false,
    ownerName: parseOwnerNameFromAddress(this.props.address),
    slugAddress: this.props.address,
    qrcodeModalOpen: false,
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

      if (this.props.address === 'new') {
        const { history } = this.props;

        const slugAddress = this.client.addr.substr(17);

        this.setState({
          chatRoomAddress: this.client.addr,
          slugAddress,
          ownerName: parseOwnerNameFromAddress(slugAddress),
        });

        this.addMessage({
          type: 'let-there-be-a-chat-room',
          fromMe: true,
        });

        history.replace(`/chat-room/${slugAddress}`);
      } else {
        this.sendHelloMessage();
      }
      this.setState({
        isOwner: this.state.chatRoomAddress === this.client.addr,
      });

      this.saveUsernameForAddress();
    });

    this.client.on('message', (src, payload) => {
      this.handleMessageReceived(src, JSON.parse(payload));
    });
  }

  publishMessage = message => {
    _.keys(this.chatters).forEach(chatterAddress => {
      if (chatterAddress === message.from) return;

      this.client.send(
        chatterAddress,
        JSON.stringify({
          ...message,
          username: this.props.username,
        }),
      );
    });
  };

  saveUsernameForAddress = () => {
    localStorage.setItem(this.state.slugAddress, this.props.username);
  };

  handleMessageReceived = (from, message) => {
    if (from === this.client.addr) {
      return;
    }

    if (message.type === 'hello') {
      this.chatters[from] = message.username;
    }

    const messageWithFrom = {
      from,
      ...message,
    };

    this.addMessage(messageWithFrom);

    if (this.state.isOwner) {
      this.publishMessage(messageWithFrom);
    }
  };

  sendMessage = message => {
    this.client.send(
      this.state.chatRoomAddress,
      JSON.stringify({
        ...message,
        username: this.props.username,
      }),
    );
  };

  sendHelloMessage = () => {
    const message = {
      type: 'hello',
      username: this.props.username,
      ownerName: this.state.ownerName,
    };

    this.sendMessage(message);

    this.addMessage({
      ...message,
      fromMe: true,
    });
  };

  handleSendChatMessage = content => {
    const message = {
      type: 'chat',
      content,
    };

    if (this.state.isOwner) {
      this.publishMessage(message);
    } else {
      this.sendMessage(message);
    }

    this.addMessage({
      ...message,
      fromMe: true,
    });
  };

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  render() {
    console.log(this.props.location);

    return (
      <div className="container">
        <Header className="ChatRoomHeader">
          {this.state.ownerName}'s Chat Room
          <div className="ShareButtons">
            <FacebookShareButton
              url={window.location.href.split('?')[0]}
              quote="Join me"
              style={{ marginRight: 10 }}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <Button
              style={{ marginRight: 10 }}
              shape="circle"
              icon="qrcode"
              onClick={() => this.setState({ qrcodeModalOpen: true })}
            />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="0">
                    <Link to={`/?username=${this.props.username}`}>
                      Create My Own Chat Room
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <Link to="/">Exit</Link>
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button
                style={{ marginRight: 10 }}
                shape="circle"
                icon="ellipsis"
              />
            </Dropdown>
          </div>
        </Header>
        <Messages messages={this.state.messages} />
        <Footer className="InputFooter">
          <ChatInput onSend={this.handleSendChatMessage} />
        </Footer>
        <Modal
          title="Scan to Join"
          wrapClassName="vertical-center-modal"
          visible={this.state.qrcodeModalOpen}
          onCancel={() => this.setState({ qrcodeModalOpen: false })}
          footer={null}
        >
          <Qrcode value={window.location.href.split('?')[0]} size={256} />
        </Modal>
      </div>
    );
  }
}
ChatRoom.defaultProps = {
  username: 'Anonymous',
};

export default withRouter(ChatRoom);
