import React from 'react';

import Message from './Message';
import HelloMessage from './HelloMessage';

class Messages extends React.Component {
  componentDidUpdate() {
    // There is a new message in the state, scroll to bottom of list
    const objDiv = document.getElementById('messageList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  render() {
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      if (message.type === 'hello') {
        return (
          <HelloMessage
            key={i}
            username={message.username}
            fromMe={message.fromMe}
          />
        );
      }

      return (
        <Message
          key={i}
          username={message.username}
          message={message.message}
          fromMe={message.fromMe}
        />
      );
    });

    return (
      <div className="messages" id="messageList">
        {messages}
      </div>
    );
  }
}

Messages.defaultProps = {
  messages: [],
};

export default Messages;
