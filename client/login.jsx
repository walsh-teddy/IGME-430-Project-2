const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleLogin = (e) => {
  console.log('DEBUG: handleLogin called');
  e.preventDefault();
  helper.hideError();

  console.log('DEBUG: helper.hideError finished');

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2) {
    helper.handleError('All fields are requiered!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2 });

  return false;
};

const LoginWindow = (props) => {
  return (
    <form id='loginForm'
      name='loginForm'
      onSubmit={handleLogin}
      action='/login'
      method='POST'
      className='mainForm'
      class="rows"
    >
      <div class="row">
        <label htmlFor='username'>Username: </label>
        <input id='user' type='text' name='username' placeholder='username' />
      </div>
      <div class="row">
        <label htmlFor='pass'> Password: </label>
        <input id='pass' type='text' name='pass' placeholder='password' />
      </div>
      <div class="row">
        <input className='formSubmit' type='submit' value='Sign in' />
      </div>
      <div id="errorMessage" class='hidden row'>
        <h3><span id="errorMessageText" class="has-text-danger"></span></h3>
      </div>
    </form>
  );
};

const SignupWindow = (props) => {
  return (
    <form id='signupForm'
      name='signupForm'
      onSubmit={handleSignup}
      action='/signup'
      method='POST'
      className='mainForm'
      class="rows"
    >
      <div class="row">
        <label htmlFor='username'>Username: </label>
        <input id='user' type='text' name='username' placeholder='username' />
      </div>
      <div class="row">
        <label htmlFor='pass'> Password: </label>
        <input id='pass' type='text' name='pass' placeholder='password' />
      </div>
      <div class="row">
        <label htmlFor='pass2'> Password: </label>
        <input id='pass2' type='text' name='pass2' placeholder='retype password' />
      </div>
      <div class="row">
        <input className='formSubmit' type='submit' value='Sign up' />
      </div>
      <div id="errorMessage" class='hidden row'>
        <h3><span id="errorMessageText" class="has-text-danger"></span></h3>
      </div>
    </form>
  );
};

const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    ReactDOM.render(<LoginWindow />, document.getElementById('content'));
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    ReactDOM.render(<SignupWindow />, document.getElementById('content'));
    return false;
  });

  ReactDOM.render(<LoginWindow />, document.getElementById('content'));
};

window.onload = init;