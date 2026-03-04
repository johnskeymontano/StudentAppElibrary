import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG [cite: 70]
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase & Firestore [cite: 73]
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const studentCol = collection(db, "students");

const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

// CREATE: Add Student [cite: 27, 74]
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const sid = document.getElementById('studentID').value;
    const course = document.getElementById('course').value;

    try {
        await addDoc(studentCol, { name, sid, course });
        studentForm.reset();
        alert("Student added successfully to Cloud!");
    } catch (error) {
        console.error("Error adding student: ", error);
    }
});

// READ: Display Students in Real-time [cite: 28, 30, 74]
onSnapshot(studentCol, (snapshot) => {
    studentList.innerHTML = "";
    snapshot.forEach((docSnap) => {
        const student = docSnap.data();
        const id = docSnap.id;
        
        const row = `
            <tr>
                <td>${student.name}</td>
                <td>${student.sid}</td>
                <td>${student.course}</td>
                <td>
                    <button class="delete-btn" onclick="deleteRecord('${id}')">Delete</button>
                </td>
            </tr>
        `;
        studentList.innerHTML += row;
    });
});

// DELETE: Remove Student [cite: 29, 74]
window.deleteRecord = async (id) => {
    if (confirm("Delete this student record?")) {
        await deleteDoc(doc(db, "students", id));
    }
};