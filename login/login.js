// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8wf4spJyoglvgGKa5wOp1CNXft6V3QmE",
  authDomain: "inputlist-ce6ab.firebaseapp.com",
  projectId: "inputlist-ce6ab",
  storageBucket: "inputlist-ce6ab.appspot.com",
  messagingSenderId: "519533395557",
  appId: "1:519533395557:web:7a1365f2f0d1ecf52e908c"
};
firebase.initializeApp(firebaseConfig);

// Get the login form and error message elements
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Add a submit event listener to the login form
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get the email and password values from the form
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  // Sign in the user with the email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User successfully logged in');
      window.location.href = 'name-list.html'; // Redirect to the name list page
    })
    .catch((error) => {
      console.error('Error logging in user: ', error);
      errorMessage.textContent = error.message; // Display the error message
    });
});
