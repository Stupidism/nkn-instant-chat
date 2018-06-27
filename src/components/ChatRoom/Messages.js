import React from 'react';

import Message from './Message';
import HelloMessage from './HelloMessage';
import CreationMessage from './CreationMessage';

class Messages extends React.Component {
  componentDidUpdate() {
    // There is a new message in the state, scroll to bottom of list
    const objDiv = document.getElementById('messageList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  render() {
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      switch (message.type) {
        case 'let-there-be-a-chat-room': {
          return <CreationMessage key={i} />;
        }
        case 'hello': {
          return <HelloMessage key={i} {...message} />;
        }
        case 'chat': {
          return <Message key={i} {...message} />;
        }
        default: {
          return null;
        }
      }
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
