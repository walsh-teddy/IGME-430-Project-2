const models = require('../models');

const { ChatMessage } = models;

const chatPage = async (req, res) => res.render('chat');

const sendChatMessage = async (req, res) => {
  // Make sure they didn't send a blank message
  if (!req.body.contents) {
    return res.status(400).json({ error: 'Message can\'t be blank!' });
  }

  const chatMessageData = {
    Contents: req.body.contents,
    owner: req.session.account.username,
  };

  try {
    const newChatMessage = new ChatMessage(chatMessageData);
    newChatMessage.save();
    return res.status(201).json({
      contents: newChatMessage.Contents,
      owner: newChatMessage.owner,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured sending the message' });
  }
};

const getChat = async (req, res) => {
  try {
    const query = { };
    const docs = await ChatMessage.find(query).select('Contents owner').lean().exec();

    // Send back the now compiled list of chat messages
    return res.json({ chat: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving chat!' });
  }
};

module.exports = {
  chatPage,
  sendChatMessage,
  getChat,
};
