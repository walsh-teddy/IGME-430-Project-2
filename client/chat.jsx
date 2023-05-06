const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleChatMessage = (e) => {
  e.preventDefault();
  helper.hideError();

  const contents = e.target.querySelector('#chatContents').value;

  // Make sure they didn't type an enmpty message
  if (!contents) {
    helper.handleError('Message can\'t be blank!');
    return false;
  }

  // Send a post request
  helper.sendPost(e.target.action, { contents }, loadChatFromServer);

  // Clear the previous text
  document.getElementById("chatContents").value = '';

  return false;
};

const handleTogglePremium = (e) =>{
  e.preventDefault();
  helper.hideError();

  // Send a post request (the session will hold the account which will know if its premium or not)
  helper.sendPost(e.target.action, {}, loadPremiumFromServer);

  return false;
}

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

const TogglePremiumForm = (props) => {
  // Draw the button red or white depending on if they're premium or not
  if (!props.premium) { // They are not premium
    return (
      <form id="togglePremiumForm"
      onSubmit={handleTogglePremium}
      name="togglePremiumform"
      action='/togglePremium'
      method="POST"
      className="togglePremiumForm"
      >
        <input className="togglePremiumFormSubmit" type="submit" value="Activate Premium" />
      </form>
    )
  } else { // They are premium
    return (
      <form id="togglePremiumForm"
      onSubmit={handleTogglePremium}
      name="togglePremiumform"
      action='/togglePremium'
      method="POST"
      className="togglePremiumForm"
      >
        <input className="togglePremiumFormSubmit" class='has-background-danger' type="submit" value="Disable Premium" />
      </form>
    )
  }
}

const DisplayChat = (props) => {
  if (props.chat.length === 0) {
    return (
      <div className="chatMessages">
        <h3 className="emptyChatMessages">No chat messages yet!</h3>
      </div>
    )
  }

  const chatNodes = props.chat.map(chatMessage => {
    // Draw it normal if no premium, or in a differntly colored box if it is
    if (!chatMessage.premium) { // It isn't premium
      return (
        <div key={chatMessage._id} className="chatMessage" class="box">
          <h3 className="chatMessageOwner" class="has-text-weight-bold">{chatMessage.owner}</h3>
          <p className="chatMessageContents">{chatMessage.Contents}</p>
        </div>
      );
    } else { // It is premium
      return (
        <div key={chatMessage._id} className="chatMessage" class="box has-background-danger">
          <h3 className="chatMessageOwner" class="has-text-weight-bold">{chatMessage.owner}</h3>
          <p className="chatMessageContents">{chatMessage.Contents}</p>
        </div>
      );
    }
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

const loadPremiumFromServer = async () => {
  const response = await fetch('/getPremium');
  const data = await response.json();
  ReactDOM.render(
    <TogglePremiumForm premium={data.premium} />,
    document.getElementById('togglePremium')
  );
}

const init = () => {
  ReactDOM.render(
    <ChatForm />,
    document.getElementById('writeMessage')
  );

  ReactDOM.render(
    <TogglePremiumForm premium={false} />,
    document.getElementById('togglePremium')
  );

  ReactDOM.render(
    <DisplayChat chat={[]} />,
    document.getElementById('chat')
  );

  // Ask the server for updates every 2 seconds
  const update = async () => {
    // Ask for data
    await loadChatFromServer();
    await loadPremiumFromServer();

    // Call itself recursively
    setTimeout (update, 2000);
  };

    // Call update for the first time
    update();
};

window.onload = init;
