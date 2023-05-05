/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
/* Entry point of our client code. Runs when window.onload fires.
   Sets up the event listeners for each form across the whole app.
*/
const init = () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const domoForm = document.getElementById('domoForm');
  const domoMessage = document.getElementById('domoMessage');

  /* If this page has the signupForm, add it's submit event listener.
     Event listener will grab the username, password, and password2
     from the form, validate everything is correct, and then will
     use sendPost to send the data to the server.
  */
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const username = signupForm.querySelector('#user').value;
      const pass = signupForm.querySelector('#pass').value;
      const pass2 = signupForm.querySelector('#pass2').value;

      if (!username || !pass || !pass2) {
        handleError('All fields are required!');
        return false;
      }

      if (pass !== pass2) {
        handleError('Passwords do not match!');
        return false;
      }

      sendPost(signupForm.getAttribute('action'), { username, pass, pass2 });
      return false;
    });
  }

  /* If this page has the loginForm, add it's submit event listener.
     Event listener will grab the username, password, from the form,
     validate both values have been entered, and will use sendPost
     to send the data to the server.
  */
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const username = loginForm.querySelector('#user').value;
      const pass = loginForm.querySelector('#pass').value;

      if (!username || !pass) {
        handleError('Username or password is empty!');
        return false;
      }

      sendPost(loginForm.getAttribute('action'), { username, pass });
      return false;
    });
  }

  /* If this page has the domoForm, add it's submit event listener.
     Event listener will grab the domo name and the domo age from
     the form. It will throw an error if one or both are missing.
     Otherwise, it will send the request to the server.
  */
  if (domoForm) {
    domoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      domoMessage.classList.add('hidden');

      const name = domoForm.querySelector('#domoName').value;
      const age = domoForm.querySelector('#domoAge').value;

      if (!name || !age) {
        handleError('All fields are required!');
        return false;
      }

      sendPost(domoForm.getAttribute('action'), { name, age });
      return false;
    });
  }
};

// Call init when the window loads.
window.onload = init;
