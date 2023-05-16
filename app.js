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

// Get DOM elements
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const namesList = document.getElementById('names-list');
const copyAllButton = document.getElementById('copy-all-button');

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
db.collection('names').orderBy('name').onSnapshot((snapshot) => {
  // Clear names list
  namesList.innerHTML = '';

  // Add names to the list
  if (snapshot.size > 0) {
  let counter = 1;
  snapshot.forEach((doc) => {
    const li = document.createElement('li');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
      const text = `${counter}. ${doc.data().name}`;
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch((error) => {
          console.error('Error copying text: ', error);
        });
    });
    li.textContent = `${doc.data().name}`;
    namesList.appendChild(li);
    counter++;
	});
	} else {
    const li = document.createElement('li');
    li.textContent = 'No Names Submitted Yet';
    namesList.appendChild(li);
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
