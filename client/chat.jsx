const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleChatMessage = (e) => {
  e.preventDefault();
  helper.hideError();

  const contents = e.target.querySelector('#chatContents').value;

  if (!contents) {
    helper.handleError('Message can\'t be blank!');
    return false;
  }

  helper.sendPost(e.target.action, { contents }, loadChatFromServer);

  return false;
};

const ChatForm = (props) => {
  return ( 
  <form id="chatForm"
      onSubmit={handleChatMessage}
      name="chatForm"
      action="/chat"
      method="POST"
      className="chatForm"
    >
      <label htmlFor="contents">Message: </label>
      <input id="chatContents" type="text" name="contents" placeholder="Start typing..." />

      <input className="chatFormSubmit" type="submit" value="Send" />
    </form>
  )
};

const DisplayChat = (props) => {
  if (props.chat.length === 0) {
    return (
      <div className="chatMessages">
        <h3 className="emptyChatMessages">No chat messages yet!</h3>
      </div>
    )
  }

  const chatNodes = props.chat.map(chatMessage => {
    return (
      <div key={chatMessage._id} className="chatMessage">
        <h3 className="chatMessageOwner">{chatMessage.owner}</h3>
        <p className="chatMessageContents">{chatMessage.Contents}</p>
      </div>
    );
  });

  return (
    <div className="chatMessages">
      {chatNodes}
    </div>
  );
};

const loadChatFromServer = async () => {
  const response = await fetch('/getChat');
  const data = await response.json();
  ReactDOM.render(
    <DisplayChat chat={data.chat} />,
    document.getElementById('chat')
  );
};

const init = () => {
  ReactDOM.render(
    <ChatForm />,
    document.getElementById('writeMessage')
  );


  ReactDOM.render(
    <DisplayChat chat={[]} />,
    document.getElementById('chat')
  );

  // Ask the server for updates every 2 seconds
  const update = async () => {
    // Ask for data
    await loadChatFromServer();

    // Call itself recursively
    setTimeout (update, 2000);
  };

    // Call update for the first time
    update();
};

window.onload = init;
