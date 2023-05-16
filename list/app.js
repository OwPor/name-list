const firebaseConfig = {
  apiKey: "AIzaSyD8wf4spJyoglvgGKa5wOp1CNXft6V3QmE",
  authDomain: "inputlist-ce6ab.firebaseapp.com",
  projectId: "inputlist-ce6ab",
  storageBucket: "inputlist-ce6ab.appspot.com",
  messagingSenderId: "519533395557",
  appId: "1:519533395557:web:7a1365f2f0d1ecf52e908c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Get the names list and logout button elements
const namesList = document.getElementById('names-list');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const copyAllButton = document.getElementById('copy-all-button');
const logoutButton = document.getElementById('btn-logout');
const deleteAllButton = document.getElementById('delete-all-button');

// Add a click event listener to the logout button
logoutButton.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      console.log('User successfully logged out');
      window.location.href = 'https://owpor.github.io/name-list/login'; // Redirect to the login page
    })
    .catch((error) => {
      console.error('Error logging out user: ', error);
    });
});

// Listen for form submission
nameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim().toUpperCase(); // Convert input to uppercase
  if (name) {
    // Check if name already exists in Firestore
    const querySnapshot = await db.collection('names').where('name', '==', name).get();
    if (querySnapshot.empty) {
      // Add name to Firestore
      await db.collection('names').add({ name });
      // Clear input field
      nameInput.value = '';
    } else {
	  alert("Name already exists in Firestore");
      console.error("Name already exists in Firestore");
    }
  }
});

// Listen for Firestore updates
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('User is logged in');
    db.collection('names').orderBy('name').onSnapshot((snapshot) => {
      // Clear names list
      namesList.innerHTML = '';

      // Add names to the list
      if (snapshot.size > 0) {
        snapshot.forEach((doc) => {
          const li = document.createElement('li');
          const name = doc.data().name;
          const deleteButton = document.createElement('button');
		  deleteButton.textContent = 'Delete';
		  deleteButton.classList.add('delete-button');
          deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm(`Are you sure you want to delete ${name}?`);
            if (confirmDelete) {
              db.collection('names').doc(doc.id).delete()
                .then(() => {
                  console.log(`Document with ID ${doc.id} successfully deleted`);
                })
                .catch((error) => {
                  console.error('Error deleting document: ', error);
                });
            }
          });
          li.textContent = name;
          li.appendChild(deleteButton);
          namesList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No Names Submitted Yet';
        namesList.appendChild(li);
      }
    });
  } else {
    console.log('User is not logged in');
    window.location.href = 'https://owpor.github.io/name-list/login'; // Redirect to the login page
  }
});

// Listen for delete all button click
deleteAllButton.addEventListener('click', async () => {
  const confirmDelete = confirm('Are you sure you want to delete all names?');
  if (confirmDelete) {
    try {
      // Delete all documents from Firestore collection
      const querySnapshot = await db.collection('names').get();
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    } catch (error) {
      console.error('Error deleting documents: ', error);
    }
  }
});

// Listen for copy all button click
copyAllButton.addEventListener('click', () => {
  const text = Array.from(namesList.children)
    .map((li, index) => `${index + 1}. ${li.textContent}`)
    .join('\n');
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch((error) => {
      console.error('Error copying text: ', error);
    });
});