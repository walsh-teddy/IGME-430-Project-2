const models = require('../models');
const { Account } = models;

const loginPage = (req, res) => {
  res.render('login');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/chat' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ message: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/chat' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getPremium = async (req, res) => {
  try {
    const query = { username: req.session.account.username };
    const docs = await Account.find(query).select('premium').lean().exec();

    // Send back data (docs is an array, so we just need to look at index 0)
    return res.json({ premium: docs[0].premium });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving account!' });
  }
};

const togglePremium = async (req, res) => {
  // Get the up-to-date account from the database
  const userAccount = req.session.account;
  const { username } = userAccount;
  const [accountData] = await Account.find({ username }).exec();

  // Change the account on the database
  accountData.premium = !accountData.premium;
  const savePromise = accountData.save();
  savePromise.then(() => {
    req.session.account.premium = accountData.premium;
    res.json({ premium: accountData.premium });
  });
  savePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });

  return false;
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getPremium,
  togglePremium,
};
