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


let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let fees = JSON.parse(localStorage.getItem("fees")) || [];

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
        class: studentClass.value,
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

function renderStudents() {
    if (!document.getElementById("studentTable")) return;

    studentTable.innerHTML = `
        <tr>
            <th>Name</th><th>Parent</th><th>Phone</th>
            <th>Class</th><th>Fee</th><th>Delete</th>
        </tr>
    `;

    students.forEach((s,i)=>{
        studentTable.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.parent}</td>
            <td>${s.phone}</td>
            <td>${s.class}</td>
            <td>${s.fee}</td>
            <td><button class="delete-btn" onclick="deleteStudent(${i})">Delete</button></td>
        </tr>`;
    });
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

    attendance.forEach((a,i)=>{
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
        students.forEach((s,i)=>{
            attendanceStudent.innerHTML += `<option value="${i}">${s.name}</option>`;
        });
    }
}

/* ================= FEES ================= */

function addFee() {
    fees.push({
        student: students[feeStudent.value].name,
        date: feeDate.value,
        amount: amountPaid.value,
        status: feeStatus.value
    });
    saveData();
    renderFees();
}

function deleteFee(index) {
    fees.splice(index, 1);
    saveData();
    renderFees();
}

function renderFees() {
    if (!document.getElementById("feeTable")) return;

    feeTable.innerHTML = `
        <tr>
            <th>Student</th><th>Date</th>
            <th>Status</th><th>Amount</th><th>Delete</th>
        </tr>
    `;

    fees.forEach((f,i)=>{
        feeTable.innerHTML += `
        <tr>
            <td>${f.student}</td>
            <td>${f.date}</td>
            <td>${f.status}</td>
            <td>${f.amount}</td>
            <td><button class="delete-btn" onclick="deleteFee(${i})">Delete</button></td>
        </tr>`;
    });

    if (document.getElementById("feeStudent")) {
        feeStudent.innerHTML = "";
        students.forEach((s,i)=>{
            feeStudent.innerHTML += `<option value="${i}">${s.name}</option>`;
        });
    }
}

renderStudents();
renderAttendance();
renderFees();

/* ================= DASHBOARD ================= */

function loadDashboard() {

    if (!document.getElementById("totalStudents")) return;

    const students = JSON.parse(localStorage.getItem("students")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const fees = JSON.parse(localStorage.getItem("fees")) || [];

    // Total Students
    totalStudents.innerText = students.length;

    // Fees This Month
    let currentMonth = new Date().getMonth();
    let monthlyTotal = 0;

    fees.forEach(f => {
        let feeDate = new Date(f.date);
        if (feeDate.getMonth() === currentMonth && f.status === "Paid") {
            monthlyTotal += Number(f.amount);
        }
    });

    monthlyFees.innerText = "₹ " + monthlyTotal;

    // Pending Amount
    let totalExpected = students.reduce((sum, s) => sum + Number(s.fee), 0);
    pendingAmount.innerText = "₹ " + (totalExpected - monthlyTotal);

    // Today Attendance %
    let today = new Date().toISOString().split("T")[0];
    let todayRecords = attendance.filter(a => a.date === today);
    let presentCount = todayRecords.filter(a => a.status === "Present").length;

    let percent = students.length > 0 
        ? Math.round((presentCount / students.length) * 100)
        : 0;

    attendancePercent.innerText = percent + "%";

    // Monthly Income Chart
    let monthlyData = new Array(12).fill(0);

    fees.forEach(f => {
        if (f.status === "Paid") {
            let month = new Date(f.date).getMonth();
            monthlyData[month] += Number(f.amount);
        }
    });

    new Chart(document.getElementById("incomeChart"), {
        type: "bar",
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [{
                label: "Income",
                data: monthlyData
            }]
        }
    });

    // Pending Students List
    pendingList.innerHTML = "";
    students.forEach(s => {
        let paid = fees
            .filter(f => f.student === s.name && f.status === "Paid")
            .reduce((sum,f)=> sum + Number(f.amount),0);

        if (paid < s.fee) {
            pendingList.innerHTML += `<li>${s.name} - ₹${s.fee - paid} Pending</li>`;
        }
    });
}

loadDashboard();

// Toggle Mobile Menu
function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("show");
}

// Dark Mode Toggle
function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Apply saved theme on load
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
};

function filterStudents() {
    let input = document.getElementById("searchStudent").value.toLowerCase();
    let rows = document.querySelectorAll("#studentTable tbody tr");

    rows.forEach(row => {
        let name = row.cells[0].innerText.toLowerCase();
        if (name.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker Registered"));
}