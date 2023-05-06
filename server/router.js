const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getChat', mid.requireLogin, controllers.Chat.getChat);

  app.get('/login', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requireLogout, controllers.Account.login);

  app.post('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signup);

  app.get('/logout', mid.requireLogin, controllers.Account.logout);

  app.get('/chat', mid.requireLogin, controllers.Chat.chatPage);
  app.post('/chat', mid.requireLogin, controllers.Chat.sendChatMessage);

  app.get('/getPremium', mid.requireLogin, controllers.Account.getPremium);
  app.post('/togglePremium', mid.requireLogin, controllers.Account.togglePremium);

  app.get('/', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
