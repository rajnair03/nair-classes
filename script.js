/* ================= LOGIN SYSTEM ================= */

const ADMIN_USERNAME = "surekha";
const ADMIN_PASSWORD = "rudraj";

function login() {
    if (username.value === ADMIN_USERNAME && password.value === ADMIN_PASSWORD) {
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}

function checkLogin() {
    if (!sessionStorage.getItem("loggedIn")) {
        window.location.href = "login.html";
    }
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

/* ================= DATA ================= */

let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let fees = JSON.parse(localStorage.getItem("fees")) || {};

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("fees", JSON.stringify(fees));
}

/* ================= STUDENTS ================= */

function addStudent() {
    students.push({
        name: name.value,
        parent: parent.value,
        phone: phone.value,
        className: studentClass.value,
        fee: fee.value
    });

    saveData();
    renderStudents();
}

function deleteStudent(index) {
    students.splice(index, 1);
    saveData();
    renderStudents();
}

let currentStudentIndex = null;

function renderStudents() {
    if (!document.getElementById("studentTable")) return;

    studentTable.innerHTML = `
        <tr>
            <th>Name</th><th>Parent</th><th>Phone</th>
            <th>Class</th><th>Fee</th><th>Delete</th>
        </tr>
    `;

    students.forEach((s, i) => {
        studentTable.innerHTML += `
        <tr>
            <td>
              <span onclick="viewStudent(${i})" style="cursor:pointer; color:blue;">
                ${s.name}
              </span>
            </td>
            <td>${s.parent}</td>
            <td>${s.phone}</td>
            <td>${s.className}</td>
            <td>${s.fee}</td>
            <td><button class="delete-btn" onclick="deleteStudent(${i})">Delete</button></td>
        </tr>`;
    });
}

function viewStudent(index) {
    let s = students[index];

    document.getElementById("editName").value = s.name;
    document.getElementById("editParent").value = s.parent;
    document.getElementById("editPhone").value = s.phone;
    document.getElementById("editClass").value = s.className;
    document.getElementById("editFee").value = s.fee;

    currentStudentIndex = index;
    document.getElementById("studentDetails").style.display = "block";
}

function saveStudentEdit() {
    students[currentStudentIndex] = {
        name: editName.value,
        parent: editParent.value,
        phone: editPhone.value,
        className: editClass.value,
        fee: editFee.value
    };

    saveData();
    document.getElementById("studentDetails").style.display = "none";
    renderStudents();
}

/* ================= ATTENDANCE ================= */

function markAttendance() {
    attendance.push({
        student: students[attendanceStudent.value].name,
        date: attendanceDate.value,
        status: attendanceStatus.value
    });

    saveData();
    renderAttendance();
}

function deleteAttendance(index) {
    attendance.splice(index, 1);
    saveData();
    renderAttendance();
}

function renderAttendance() {
    if (!document.getElementById("attendanceTable")) return;

    attendanceTable.innerHTML = `
        <tr>
            <th>Student</th><th>Date</th>
            <th>Status</th><th>Delete</th>
        </tr>
    `;

    attendance.forEach((a, i) => {
        attendanceTable.innerHTML += `
        <tr>
            <td>${a.student}</td>
            <td>${a.date}</td>
            <td>${a.status}</td>
            <td><button class="delete-btn" onclick="deleteAttendance(${i})">Delete</button></td>
        </tr>`;
    });

    if (document.getElementById("attendanceStudent")) {
        attendanceStudent.innerHTML = "";
        students.forEach((s, i) => {
            attendanceStudent.innerHTML += `<option value="${i}">${s.name}</option>`;
        });
    }
}

/* ================= FEES (UPDATED SYSTEM) ================= */

function updateFee() {
    let studentName = students[feeStudent.value].name;

    fees[studentName] = {
        date: feeDate.value,
        amount: amountPaid.value,
        status: feeStatus.value
    };

    saveData();
    renderFees();
}

function renderFees() {
    if (!document.getElementById("feeTable")) return;

    feeTable.innerHTML = `
        <tr>
            <th>Student</th><th>Date</th>
            <th>Status</th><th>Amount</th>
        </tr>
    `;

    for (let studentName in fees) {
        let f = fees[studentName];

        feeTable.innerHTML += `
        <tr>
            <td>${studentName}</td>
            <td>${f.date}</td>
            <td>${f.status}</td>
            <td>${f.amount}</td>
        </tr>`;
    }

    if (document.getElementById("feeStudent")) {
        feeStudent.innerHTML = "";
        students.forEach((s, i) => {
            feeStudent.innerHTML += `<option value="${i}">${s.name}</option>`;
        });
    }
}

renderStudents();
renderAttendance();
renderFees();
