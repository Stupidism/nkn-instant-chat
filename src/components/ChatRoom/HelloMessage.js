import React from 'react';

class Message extends React.Component {
  render() {
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'from-me' : '';

    return (
      <div className={`hello-message ${fromMe}`}>
        {fromMe
          ? `You joined ${this.props.ownerName}'s chat room!`
          : `${this.props.username} joined the chat room!`}
      </div>
    );
  }
}

Message.defaultProps = {
  message: '',
  username: '',
  ownerName: '',
  fromMe: false,
};

export default Message;
