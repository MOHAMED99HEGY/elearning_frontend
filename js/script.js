function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

document.addEventListener('DOMContentLoaded', function () {

    handleNavigation();
    handleHeroButtons();
    handleCourseFilter();
    handleLessonDisplay();

});

//صفحة الرئيسية//
function handleNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!navLinks.length) return;

    navLinks.forEach(link => {
        const text = link.textContent.trim();

        if (text.includes('الرئيسية')) link.href = 'index.html';
        else if (text.includes('الدورات')) link.href = 'courses.html';
        else if (text.includes('تسجيل الدخول')) link.href = 'login.html';
        else if (text.includes('إنشاء حساب')) link.href = 'register.html';
        else if (text.includes('تواصل معنا')) link.href = 'contact.html';
    });
}

//Hero Buttons//
function handleHeroButtons() {
    const primaryBtn = document.querySelector('.hero .primary-btn');
    const secondaryBtn = document.querySelector('.hero .secondary-btn');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'courses.html';
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
}

// Courses Filter//
function handleCourseFilter() {
    const courseContainer = document.getElementById('courseContainer');
    if (!courseContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('type');
    const allCourses = document.querySelectorAll('.course');

    if (!courseType) {
        allCourses.forEach(course => course.style.display = 'block');
        return;
    }

    allCourses.forEach(course => {
        course.style.display = course.id === courseType ? 'block' : 'none';
    });

    courseContainer.style.display = 'flex';
    courseContainer.style.justifyContent = 'center';
}

//Lesson Display//
function handleLessonDisplay() {
    const allCards = document.querySelectorAll('.lesson-card');
    if (!allCards.length) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course') || urlParams.get('type');

    allCards.forEach(card => card.style.display = 'block');

    if (!selectedCourse) return;

    allCards.forEach(card => card.style.display = 'none');

    const targetCard = document.getElementById(selectedCourse);

    if (targetCard) {
        targetCard.style.display = 'block';
    } else {
        console.error("ID Not Found: " + selectedCourse);
    }
}

//Toggle Video (Global)//
window.toggleVideo = function(titleElement) {
    const video = titleElement.nextElementSibling;
    if (!video) return;

    video.style.display = video.style.display === "block" ? "none" : "block";
};
//---تسجيل الدخول//
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const userTypeSelect = document.getElementById('loginUserType');
    const teacherCodeGroup = document.getElementById('teacherCodeGroup');
    const teacherCodeInput = document.getElementById('teacherCode');

    // إظهار كود المدرس
    userTypeSelect.addEventListener('change', function () {
        if (this.value === 'teacher') {
            teacherCodeGroup.style.display = 'block';
            teacherCodeInput.required = true;
        } else {
            teacherCodeGroup.style.display = 'none';
            teacherCodeInput.required = false;
            teacherCodeInput.value = "";
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        const role = userTypeSelect.value;

        const users = getUsers();

        const user = users.find(u =>
            u.email === email &&
            u.password === password &&
            u.role === role
        );

        if (!user) {
            alert("بيانات الدخول غير صحيحة");
            return;
        }

        if (role === 'teacher') {
            const secretCode = "1234";
            if (teacherCodeInput.value !== secretCode) {
                alert("كود المدرس غير صحيح!");
                return;
            }
        }

        setCurrentUser(user);

        window.location.href =
            role === 'student'
                ? 'student_dashboard.html'
                : 'teacher_dashboard.html';
    });

});
//--- انشاء حساب//
function toggleTeacherFields() {
    const userType = document.getElementById('userType');
    const teacherSection = document.getElementById('teacherFields');

    if (!userType || !teacherSection) return;

    if (userType.value === 'teacher') {
        teacherSection.style.display = 'block';
    } else {
        teacherSection.style.display = 'none';
    }
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const userType = document.getElementById('userType')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const teacherCode = document.getElementById('teacherCode')?.value;

    if (!username || !email || !userType || !password || !confirmPassword) {
        alert("من فضلك أكمل البيانات");
        return false;
    }

    if (password !== confirmPassword) {
        alert("كلمات المرور غير متطابقة!");
        return false;
    }

    if (userType === 'teacher') {
        const secretKey = "1234";
        if (teacherCode !== secretKey) {
            alert("رمز المدرس غير صحيح");
            return false;
        }
    }

    const users = getUsers();

    const emailExists = users.find(u => u.email === email);
    if (emailExists) {
        alert("هذا البريد مسجل بالفعل!");
        return false;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        role: userType
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    window.location.href =
        userType === 'student'
            ? 'student_dashboard.html'
            : 'teacher_dashboard.html';

    return false;
}
//---صفحة المدرس//
document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const nameDisplay = document.getElementById("teacherNameDisplay");
    const messagesContainer = document.getElementById("messagesContainer");

    // عرض اسم المدرس
    if (nameDisplay) {
        if (currentUser && currentUser.role === "teacher") {
            nameDisplay.innerText = "أهلاً مستر " + currentUser.username + " 👨‍🏫";
        } else {
            nameDisplay.innerText = "أهلاً مستر 👨‍🏫";
        }
    }

    // تحميل الرسائل
    loadMessages();
});


// فتح مودال// 
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "block";
    }
}


//غلق مودال//
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "none";
    }
}


//حفظ تعديل البروفايل//
function saveProfileChanges() {

    const newNameInput = document.getElementById("newNameInput");
    const newBioInput = document.getElementById("newBioInput");
    const nameDisplay = document.getElementById("teacherNameDisplay");
    const bioDisplay = document.getElementById("teacherBioDisplay");

    if (!newNameInput || !newBioInput || !nameDisplay || !bioDisplay) return;

    const newName = newNameInput.value.trim();
    const newBio = newBioInput.value.trim();

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (newName !== "" && currentUser && currentUser.role === "teacher") {
        currentUser.username = newName;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        nameDisplay.innerText = "أهلاً مستر " + newName + " 👨‍🏫";
    }

    if (newBio !== "") {
        bioDisplay.innerText = newBio;
    }

    closeModal("editProfileModal");

    newNameInput.value = "";
    newBioInput.value = "";
}


//التحكم في الكروت//
function action(type) {

    if (type === "video") {
        openModal("lectureModal");
    } else if (type === "exam") {
        openModal("examModal");
    } else if (type === "msg") {
        openModal("messagesModal");
    }
}


//إغلاق المودال عند الضغط خارجها//
window.onclick = function (event) {

    const modals = ["editProfileModal", "lectureModal", "examModal", "messagesModal"];

    modals.forEach(function (id) {
        const modal = document.getElementById(id);
        if (modal && event.target === modal) {
            modal.style.display = "none";
        }
    });
};


//إضافة كورس//
function addLecture() {

    const input = document.getElementById("lectureTitleInput");
    if (!input) return;

    const courseName = input.value.trim();

    if (courseName === "") {
        alert("اكتب اسم الكورس");
        return;
    }

    // تحميل الكورسات القديمة
    let courses = JSON.parse(localStorage.getItem("teacherCourses")) || [];

    // إضافة الكورس الجديد
    courses.push(courseName);

    // حفظ الكورسات
    localStorage.setItem("teacherCourses", JSON.stringify(courses));

    // إضافة في جدول الكورسات
    const tableBody = document.querySelector("table tbody");

    if (tableBody) {

        const newRow = document.createElement("tr");

        newRow.innerHTML =
            "<td>" + courseName + "</td>" +
            "<td>0</td>" +
            "<td>جديد</td>" +
            "<td><button class='btn' onclick=\"manageCourse('" + courseName + "')\">إدارة الكورس</button></td>";

        tableBody.appendChild(newRow);
    }

    alert("تم إضافة الكورس بنجاح ✅");

    input.value = "";
    closeModal("lectureModal");
}
document.addEventListener("DOMContentLoaded", function () {
    loadCourses();
});

function loadCourses() {

    const tableBody = document.querySelector("table tbody");
    if (!tableBody) return;

let courses = JSON.parse(localStorage.getItem("teacherCourses")) || [];
    courses.forEach(function (courseName) {

        const newRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = courseName;

        const studentsCell = document.createElement("td");
        studentsCell.textContent = "0";

        const statusCell = document.createElement("td");
        statusCell.textContent = "جديد";

        const actionCell = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "إدارة الكورس";
        btn.onclick = function () {
            manageCourse(courseName);
        };

        actionCell.appendChild(btn);

        newRow.appendChild(nameCell);
        newRow.appendChild(studentsCell);
        newRow.appendChild(statusCell);
        newRow.appendChild(actionCell);

        tableBody.appendChild(newRow);
    });

}

//إضافة امتحان//
function addExam() {

    const input = document.getElementById("examTitleInput");
    if (!input) return;

    const title = input.value.trim();
    if (title === "") {
        alert("اكتب اسم الامتحان");
        return;
    }

    let exams = JSON.parse(localStorage.getItem("exams")) || [];
    exams.push(title);
    localStorage.setItem("exams", JSON.stringify(exams));

    alert("تم إنشاء الامتحان");
    input.value = "";
    closeModal("examModal");
}
//تحميل الرسائل من صفحة تواصل معنا//
function loadMessages() {

    const container = document.getElementById("messagesContainer");
    if (!container) return;

    container.innerHTML = "";

    const messages = JSON.parse(localStorage.getItem("messages")) || [];

    if (messages.length === 0) {
        container.innerHTML = "<p>لا توجد رسائل حالياً</p>";
        return;
    }

    //نعرض الأحدث أولاً//
    messages.slice().reverse().forEach(function (msg) {

        const div = document.createElement("div");
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #eee";

        div.innerHTML =
            "<strong>" + msg.name + "</strong><br>" +
            "<small>" + msg.email + "</small><br>" +
            "<p>" + msg.message + "</p>" +
            "<small style='color:gray'>" + (msg.date || "") + "</small>";

        container.appendChild(div);
    });
}


//إدارة الكورس//
function manageCourse(courseName) {

    const courseMap = {
        "أساسيات البرمجة": "programming",
        "تصميم مواقع الويب": "web-design",
        "تطوير تطبيقات الموبايل": "mobile",
        "تصميم الجرافيك": "graphic",
        "المحاسبة": "accounting",
        "التسويق الإلكتروني": "marketing",
        "تحليل البيانات": "data-analysis",
        "التصميم ثلاثي الأبعاد": "3d",
        "ICDL": "icdl",
    };

    const courseId = courseMap[courseName];

    if (courseId) {
        window.location.href = "lessons.html?id=" + courseId;
    } else {
        window.location.href = "lessons.html";
    }
}
//إدارة الكورس//
function manageCourse(courseName) {

    const courseMap = {
        "مقدمة في HTML": "web-design",
        "أساسيات CSS": "web-design",
        "أساسيات JavaScript": "web-design",
        "التسويق الالكتروني": "marketing",
        "تحليل البيانات": "data-analysis",
        "التصميم ثلاثي الابعاد": "3d",
        "ICDL": "icdl",
        "مقدمة في قواعد البيانات": "programming"
    };

    const courseId = courseMap[courseName];

    if (courseId) {
        window.location.href = "lessons.html?id=" + courseId;
    } else {
        window.location.href = "lessons.html";
    }
}
document.addEventListener("DOMContentLoaded", function(){

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const teacherCourses = JSON.parse(localStorage.getItem("teacherCourses")) || [];

    const students = users.filter(u => u.role === "student");

    const stats = document.querySelectorAll(".stats b");

    // العدد الحقيقي للكورسات
    const totalCourses = courses.length + teacherCourses.length;

    if(stats.length >= 3){
        stats[0].innerText = totalCourses;   // عدد الكورسات
        stats[1].innerText = students.length;  // عدد الطلاب
        stats[2].innerText = 0;                // طلبات الانضمام
    }

});
function normalize(text){
return String(text)
.replace(/إ|أ|آ/g,"ا")
.replace(/ى/g,"ي")
.replace(/ة/g,"ه")
.replace(/\s/g,"")
.trim();
}

function updateStudentsCount(){

const studentsCourses = JSON.parse(localStorage.getItem("studentsCourses")) || {};
const rows = document.querySelectorAll("table tbody tr");

rows.forEach(function(row){

const courseName = normalize(row.children[0].innerText);
const studentsCell = row.children[1];

let count = 0;

for(let student in studentsCourses){

let courses = studentsCourses[student];

// لو مش مصفوفة نحولها لمصفوفة
if(!Array.isArray(courses)){
courses = [courses];
}

courses.forEach(function(course){

let storedName;

// لو الكورس object
if(typeof course === "object" && course !== null){
storedName = course.name || "";
}

// لو الكورس string
else{
storedName = course;
}

if(normalize(storedName) === courseName){
count++;
}

});

}

studentsCell.innerText = count;

});

}

document.addEventListener("DOMContentLoaded",function(){
updateStudentsCount();
});
//---لوحة الطالب//
document.addEventListener("DOMContentLoaded", function () {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const nameDisplay = document.getElementById("studentNameDisplay");

    if (!currentUser || currentUser.role !== "student") return;

    if (nameDisplay) {
        nameDisplay.innerText = "مرحبًا يا " + currentUser.username + " 👋";
    }

    loadStudentData();
});


//تحميل كل بيانات الطالب (كورسات + امتحانات)//
function loadStudentData() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const tableBody = document.querySelector("tbody");

    if (!tableBody || !currentUser) return;

    tableBody.innerHTML = "";

    //عرض الكورسات//
    const allStudents = JSON.parse(localStorage.getItem("studentsCourses")) || {};
    const myCourses = allStudents[currentUser.username] || [];

    myCourses.forEach(function (course, index) {

        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + course.name + "</td>" +
            "<td class='status'>" + course.status + "</td>" +
            "<td><button class='btn' onclick='handleCourse(" + index + ")'>" +
            getButtonText(course.status) +
            "</button></td>";

        tableBody.appendChild(row);
    });

    // عرض الامتحانات //
    const studentsResults = JSON.parse(localStorage.getItem("studentsResults")) || {};
    const userResults = studentsResults[currentUser.username] || {};

    for (let examName in userResults) {

        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + examName + " (اختبار)</td>" +
            "<td class='status'>مكتمل</td>" +
            "<td><button class='btn' onclick='showExamResult(\"" + examName + "\")'>عرض النتيجة</button></td>";

        tableBody.appendChild(row);
    }

    calculateProgress(myCourses);
}


// عرض نتيجة الامتحان //
function showExamResult(examName) {

    const nameToIdMap = {
        "أساسيات البرمجة": "programming",
        "تصميم مواقع الويب": "web-design",
        "تطوير تطبيقات الموبايل": "mobile-apps",
        "تصميم الجرافيك": "graphic-design",
        "المحاسبة المالية": "accounting",
        "التسويق الالكتروني": "marketing",
        "تحليل البيانات": "data-analysis",
        "التصميم ثلاثي الابعاد": "3d",
        "ICDL": "icdl"
    };

    const courseId = nameToIdMap[examName];

    if (courseId) {
        window.location.href = "results.html?course=" + courseId;
    } else {
        window.location.href = "results.html";
    }
}


// إضافة كورس//
function addCourseToStudent(courseName) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    let allStudents = JSON.parse(localStorage.getItem("studentsCourses")) || {};

    if (!allStudents[currentUser.username]) {
        allStudents[currentUser.username] = [];
    }

    const exists = allStudents[currentUser.username]
        .some(course => course.name === courseName);

    if (exists) {
        alert("أنت مسجل بالفعل في هذا الكورس");
        return;
    }

    allStudents[currentUser.username].push({
        name: courseName,
        status: "غير مكتمل"
    });

    localStorage.setItem("studentsCourses", JSON.stringify(allStudents));
    loadStudentData();
}


//التحكم في الكورس//
function handleCourse(index) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let allStudents = JSON.parse(localStorage.getItem("studentsCourses")) || {};
    let myCourses = allStudents[currentUser.username];
    let course = myCourses[index];

    // خريطة تحويل الاسم لـ id//
    const nameToIdMap = {
        "أساسيات البرمجة": "programming",
        "تصميم مواقع الويب": "web-design",
        "تطوير تطبيقات الموبايل": "mobile",
        "تصميم الجرافيك": "graphic",
        "المحاسبة": "accounting",
        "التسويق الإلكتروني": "marketing",
        "تحليل البيانات": "data-analysis",
        "التصميم ثلاثي الأبعاد": "3d",
        "ICDL": "icdl",
    };

    const courseId = nameToIdMap[course.name];

    if (course.status === "غير مكتمل") {
        course.status = "جاري التعلم";
        localStorage.setItem("studentsCourses", JSON.stringify(allStudents));

        window.location.href = "lessons.html?course=" + courseId;
    }
    else if (course.status === "جاري التعلم") {
        window.location.href = "lessons.html?course=" + courseId;
    }
    else {
        window.location.href = "results.html?course=" + courseId;
    }
}
// ===============================
function getButtonText(status) {

    if (status === "غير مكتمل") return "ابدأ الآن";
    if (status === "جاري التعلم") return "تابع التعلم";
    return "مكتمل";
}


// ===============================
function calculateProgress(courses) {

    if (!courses || courses.length === 0) {
        updateProgress(0);
        return;
    }

    let totalPoints = 0;

    courses.forEach(course => {

        if (course.status === "غير مكتمل") {
            totalPoints += 0;
        }
        else if (course.status === "جاري التعلم") {
            totalPoints += 50;
        }
        else if (course.status === "مكتمل") {
            totalPoints += 100;
        }

    });

    const percent = Math.round(totalPoints / courses.length);

    updateProgress(percent);
}


function updateProgress(percent) {

    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");

    if (bar) {
        bar.style.width = percent + "%";

        // تغيير اللون حسب التقدم//
        if (percent < 30) {
            bar.style.backgroundColor = "red";
        } else if (percent < 70) {
            bar.style.backgroundColor = "orange";
        } else {
            bar.style.backgroundColor = "green";
        }
    }

    if (text) {
        text.innerText = percent + "% مكتمل ✅";
    }
}
//---صفحة النتائج//
document.addEventListener('DOMContentLoaded', function () {

    if (!document.body.classList.contains("page-results")) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCourse = urlParams.get('course');

    const studentsResults = JSON.parse(localStorage.getItem("studentsResults")) || {};
    const userResults = studentsResults[currentUser.username] || {};

    const nameToIdMap = {
        "أساسيات البرمجة": "programming",
        "تصميم مواقع الويب": "web-design",
        "تطوير تطبيقات الموبايل": "mobile-apps",
        "تصميم الجرافيك": "graphic-design",
        "المحاسبة المالية": "accounting",
        "التسويق الالكتروني": "marketing",
        "تحليل البيانات": "data-analysis",
        "التصميم ثلاثي الابعاد": "3d",
        "ICDL": "icdl"
    };

    const resultCards = document.querySelectorAll('.result-card');

    resultCards.forEach(card => card.style.display = "none");

    for (let courseName in userResults) {

        const cardId = nameToIdMap[courseName];
        const card = document.getElementById(cardId);

        if (!card) continue;

        if (selectedCourse && selectedCourse !== cardId) continue;

        card.style.display = "block";

        const scoreEl = card.querySelector(".score");
        const gradeEl = card.querySelector(".grade");

        if (scoreEl && userResults[courseName]) {
            scoreEl.textContent = "الدرجة: " + userResults[courseName].score;
        }

        if (gradeEl && userResults[courseName]) {
            gradeEl.textContent = "التقدير: " + userResults[courseName].grade;
        }
    }

});
//---صفحةالاختبارات//
document.addEventListener("DOMContentLoaded", function () {

    const startButtons = document.querySelectorAll(".start-exam-btn");
    const examSection = document.getElementById("exam-section");
    const examTitle = document.getElementById("exam-title");
    const examContainer = document.querySelector(".exam-container");
    const backBtn = document.getElementById("back-btn");
    const submitBtn = document.getElementById("submit-exam-btn");
    const viewResultBtn = document.getElementById("view-result-btn");

    let currentExamId = null;

    const correctAnswers = {
        "exam-programming": { q1:"int", q2:"cin", q3:"cout", q4:"float", q5:"return", q6:"true", q7:"false", q8:"false", q9:"true", q10:"true" },
        "exam-web": { q1:"a", q2:"c", q3:"c", q4:"b", q5:"a", q6:"true", q7:"true", q8:"false", q9:"true", q10:"true" },
        "exam-mobile": { q1:"a", q2:"b", q3:"a", q4:"c", q5:"b", q6:"true", q7:"false", q8:"true", q9:"true", q10:"true" },
        "exam-graphic": { q1:"b", q2:"c", q3:"a", q4:"c", q5:"a", q6:"true", q7:"false", q8:"true", q9:"true", q10:"true" },
        "exam-finance": { q1:"a", q2:"b", q3:"b", q4:"a", q5:"c", q6:"true", q7:"true", q8:"false", q9:"true", q10:"false" },
        "exam-digital-marketing": { q1:"c", q2:"b", q3:"a", q4:"a", q5:"c", q6:"true", q7:"false", q8:"false", q9:"true", q10:"true" },
        "exam-data-analysis": { q1:"a", q2:"c", q3:"b", q4:"c", q5:"b", q6:"true", q7:"true", q8:"false", q9:"false", q10:"true" },
        "exam-3d": { q1:"b", q2:"a", q3:"c", q4:"a", q5:"b", q6:"true", q7:"false", q8:"true", q9:"false", q10:"false" },
        "exam-icdl": { q1:"c", q2:"b", q3:"a", q4:"c", q5:"b", q6:"true", q7:"false", q8:"true", q9:"false", q10:"true" }
    };

    function calculateGrade(percent) {
        if (percent >= 85) return "ممتاز ⭐️";
        if (percent >= 75) return "جيد جداً 👍";
        if (percent >= 65) return "جيد";
        if (percent >= 50) return "مقبول";
        return "راسب";
    }

    function saveResult(courseName, percent, grade) {

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        let studentsResults = JSON.parse(localStorage.getItem("studentsResults")) || {};

        if (!studentsResults[currentUser.username]) {
            studentsResults[currentUser.username] = {};
        }

        studentsResults[currentUser.username][courseName] = {
            score: percent + "%",
            grade: grade
        };

        localStorage.setItem("studentsResults", JSON.stringify(studentsResults));
    }

    function correctExam(examId) {

        const examBox = document.getElementById(examId);
        const answers = correctAnswers[examId];

        let score = 0;
        let total = Object.keys(answers).length;

        for (let q in answers) {
            const selected = examBox.querySelector('input[name="' + q + '"]:checked');
            if (selected && selected.value === answers[q]) {
                score++;
            }
        }

        const percent = Math.round((score / total) * 100);
        const grade = calculateGrade(percent);

        const currentCourse = examTitle.textContent.replace("امتحان مادة: ", "").trim();

        saveResult(currentCourse, percent, grade);

        alert("تم تسليم الامتحان بنجاح ✅");
    }

    const allExams = document.querySelectorAll(".exam-box");
    allExams.forEach(exam => exam.style.display = "none");

    startButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {

            const course = this.dataset.course;
            examTitle.textContent = "امتحان مادة: " + course;

            examContainer.style.display = "none";
            examSection.style.display = "block";

            allExams.forEach(exam => exam.style.display = "none");
            const examIdMap = {
                "أساسيات البرمجة": "exam-programming",
                "تصميم مواقع الويب": "exam-web",
                "تطوير تطبيقات الموبايل": "exam-mobile",
                "تصميم الجرافيك": "exam-graphic",
                "المحاسبة المالية": "exam-finance",
                "التسويق الالكتروني": "exam-digital-marketing",
                "تحليل البيانات": "exam-data-analysis",
                "التصميم ثلاثي الابعاد": "exam-3d",
                "ICDL": "exam-icdl"
            };

            currentExamId = examIdMap[course];
            const targetExam = document.getElementById(currentExamId);

            if (targetExam) {
                targetExam.style.display = "block";
                examSection.scrollIntoView({ behavior: "smooth" });
            } else {
                alert("الامتحان غير متاح حالياً");
            }
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            if (!currentExamId) return;

            correctExam(currentExamId);

            examSection.style.display = "none";
            if (viewResultBtn) viewResultBtn.style.display = "inline-block";
        });
    }

  if (viewResultBtn) {
    viewResultBtn.addEventListener("click", function () {

        const currentCourse = examTitle.textContent
            .replace("امتحان مادة: ", "")
            .trim();

        const nameToIdMap = {
            "أساسيات البرمجة": "programming",
            "تصميم مواقع الويب": "web-design",
            "تطوير تطبيقات الموبايل": "mobile-apps",
            "تصميم الجرافيك": "graphic-design",
            "المحاسبة المالية": "accounting",
            "التسويق الالكتروني": "marketing",
            "تحليل البيانات": "data-analysis",
            "التصميم ثلاثي الابعاد": "3d",
            "ICDL": "icdl"
        };

        const courseId = nameToIdMap[currentCourse];

        if (courseId) {
            window.location.href = "results.html?course=" + courseId;
        } else {
            window.location.href = "results.html";
        }
    });
}

});
// --- صفحة تواصل معنا ---//
document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            alert("من فضلك املأ جميع الحقول.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("من فضلك أدخل بريد إلكتروني صالح.");
            return;
        }

        // ✅ نحفظ الرسالة في localStorage//
        let messages = JSON.parse(localStorage.getItem("messages")) || [];

        messages.push({
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("messages", JSON.stringify(messages));

        alert("تم إرسال رسالتك بنجاح ✅");

        contactForm.reset();
    });

});

// ===============================
// الكورسات الأساسية للمنصة
// ===============================

const defaultCourses = [
    { name: "أساسيات البرمجة" },
    { name: "تصميم مواقع الويب" },
    { name: "تطوير تطبيقات الموبايل" },
    { name: "تصميم الجرافيك" },
    { name: "المحاسبة المالية" },
    { name: "التسويق الالكتروني" },
    { name: "تحليل البيانات" },
    { name: "التصميم ثلاثي الابعاد" },
    { name: "ICDL" }
];

// لو مفيش كورسات متخزنة
if (!localStorage.getItem("courses")) {
    localStorage.setItem("courses", JSON.stringify(defaultCourses));
}


// لوحة المدير//
document.addEventListener("DOMContentLoaded", function () {

    if (!document.body.classList.contains("page-admin-dashboard")) return;

    //تحميل المستخدمين
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let students = users.filter(u => u.role === "student");
    let teachers = users.filter(u => u.role === "teacher");

    // الكورسات الأساسية
    let courses  = JSON.parse(localStorage.getItem("courses")) || [];

    // الكورسات التي يضيفها المدرس
    let teacherCourses = JSON.parse(localStorage.getItem("teacherCourses")) || [];

    // العدد الحقيقي للكورسات
    let totalCourses = courses.length + teacherCourses.length;

    //تحميل اسم المدير  
    const nameTitle = document.querySelector(".profile h2");
    const savedAdminName = localStorage.getItem("adminName");

    if (savedAdminName && nameTitle) {
        nameTitle.innerText = "مرحبًا " + savedAdminName + " 👨‍💼";
    }

    //تحديث الإحصائيات تلقائياً
    const stats = document.querySelectorAll(".stats b");

    if (stats.length >= 4) {
        stats[0].innerText = totalCourses; // عدد الكورسات الحقيقي
        stats[1].innerText = teachers.length;
        stats[2].innerText = students.length;
        stats[3].innerText = 0; // مفيش pending حالياً
    }

    //تشغيل زر إعدادات الحساب
    const profileSettingsBtn = document.querySelector(".admin-card .primary-btn");

    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener("click", function () {

            const newName = prompt("اكتب اسم المدير الجديد:");

            if (newName && newName.trim() !== "") {

                localStorage.setItem("adminName", newName.trim());

                if (nameTitle) {
                    nameTitle.innerText = "مرحبًا " + newName.trim() + " 👨‍💼";
                }

                alert("تم تحديث اسم المدير ✅");
            }

        });
    }

    //تشغيل أزرار الكروت
    const cards = document.querySelectorAll(".card");

    cards.forEach(function(card) {

        const title = card.querySelector("h3")?.innerText;
        const btn = card.querySelector("button");

        if (!btn || !title) return;

        btn.addEventListener("click", function() {

            // إدارة الكورسات
            if (title.includes("الكورسات")) {

                const newCourse = prompt("اكتب اسم الكورس الجديد:");

                if (newCourse && newCourse.trim() !== "") {

                    courses.push({ name: newCourse.trim() });

                    localStorage.setItem("courses", JSON.stringify(courses));

                    alert("تم إضافة الكورس ✅");

                    location.reload();
                }

            }

            //إدارة المدرسين
            else if (title.includes("المدرسين")) {

                alert("عدد المدرسين الحالي: " + teachers.length);

            }

            // إدارة الطلاب
            else if (title.includes("الطلاب")) {

                alert("عدد الطلاب الحالي: " + students.length);

            }

            // التقارير
            else if (title.includes("التقارير")) {

                alert(
                    "📊 تقرير النظام:\n\n" +
                    "👨‍🎓 الطلاب: " + students.length + "\n" +
                    "👨‍🏫 المدرسين: " + teachers.length + "\n" +
                    "📚 الكورسات: " + totalCourses
                );

            }

            //إعدادات النظام (مسح البيانات)
            else if (title.includes("إعدادات")) {
                const confirmReset = confirm("هل تريد مسح كل بيانات المنصة؟");

                if (confirmReset) {

                    localStorage.clear();

                    alert("تم مسح البيانات 🔥");

                    location.reload();

                }

            }

        });

    });

});